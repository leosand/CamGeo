/**
 * CamGeo — Stage 5: Random Forest classification (one region)
 * ------------------------------------------------------------
 * Trains a Random Forest classifier on the community-labelled samples
 * and produces a land cover map for one region and one year.
 *
 * Prerequisite: samples labelled in the labelling tool (Stage 4) and
 * uploaded to GEE as a table asset:
 *   Code Editor → Assets → New → CSV file → upload samples_<region>.csv
 *   then copy the asset path into SAMPLES_ASSET below.
 *   The CSV must contain: lon, lat, class_code (see samples/README.md).
 *
 * Split rule (see samples/README.md): train/validation by TILE, never by
 * random points, so validation areas never touch training areas.
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Littoral';
var YEAR = 2024;
var SAMPLES_ASSET = 'projects/YOUR-PROJECT/assets/camgeo/samples_littoral_v01'; // ← replace
var CLASS_PROPERTY = 'class_code';
var N_TREES = 100;
var SEED = 42;
var SCALE = 20;
// ----------------------------------------------------------------------------

var region = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.eq('ADM1_NAME', REGION))
  .geometry();

// ------------------------- Feature stack (Stages 2+3) ------------------------
function maskClouds(image) {
  var scl = image.select('SCL');
  var keep = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return image.updateMask(keep).divide(10000).copyProperties(image, ['system:time_start']);
}

var composite = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(region)
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
  .map(maskClouds)
  .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'])
  .median().clip(region)
  .rename(['blue', 'green', 'red', 'nir', 'swir1', 'swir2']);

var dem = ee.Image('USGS/SRTMGL1_003');
var terrain = ee.Terrain.products(dem).clip(region);
var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .sum().clip(region).rename('rainfall_annual');

var stack = composite
  .addBands(composite.normalizedDifference(['nir', 'red']).rename('ndvi'))
  .addBands(composite.normalizedDifference(['green', 'nir']).rename('ndwi'))
  .addBands(composite.normalizedDifference(['swir1', 'nir']).rename('ndbi'))
  .addBands(dem.select('elevation').clip(region))
  .addBands(terrain.select(['slope', 'aspect']))
  .addBands(rainfall)
  .toFloat();

// ----------------------------- Samples import --------------------------------
var samples = ee.FeatureCollection(SAMPLES_ASSET);
print('Samples loaded:', samples.size());

// Deterministic tile-based split: samples in the same ~0.1° tile always fall
// in the same subset (train 70% / validation 30%).
function addSplit(f) {
  var c = f.geometry().coordinates();
  var kx = ee.Number(ee.List(c).get(0)).multiply(10).floor();
  var ky = ee.Number(ee.List(c).get(1)).multiply(10).floor();
  var bucket = kx.multiply(31).add(ky).mod(10); // pseudo-hash of the tile
  return f.set('split', bucket.lt(7));           // true = train
}
var split = samples.map(addSplit);
var trainSamples = split.filter(ee.Filter.eq('split', true));
var valSamples = split.filter(ee.Filter.eq('split', false));
print('Train:', trainSamples.size(), 'Validation:', valSamples.size());

// --------------------------- Train and classify ------------------------------
var training = stack.sampleRegions({
  collection: trainSamples,
  properties: [CLASS_PROPERTY],
  scale: SCALE,
  tileScale: 4
});

var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: N_TREES,
  seed: SEED
}).setOutputMode('CLASSIFICATION').train({
  features: training,
  classProperty: CLASS_PROPERTY,
  inputProperties: stack.bandNames()
});

var classified = stack.classify(classifier).byte().rename('lulc');

// ----------------------- Quick validation (details: Stage 7) -----------------
var validated = stack.sampleRegions({
  collection: valSamples,
  properties: [CLASS_PROPERTY],
  scale: SCALE,
  tileScale: 4
}).classify(classifier);

var cm = validated.errorMatrix(CLASS_PROPERTY, 'classification');
print('Confusion matrix (validation tiles):', cm);
print('Overall accuracy:', cm.accuracy());
print('Kappa:', cm.kappa());
// Per-class precision/recall/F1 are computed offline: export the validation
// table below and run python/camgeo/validation.py (Stage 7).

// --------------------------------- Display -----------------------------------
var PALETTE = ['#006400', '#7a9900', '#c8d47a', '#e8a33d', '#8B4513', '#2e8b8b', '#1f5fd0', '#d43d2a', '#c2c2c2'];
Map.centerObject(region, 8);
Map.addLayer(classified, {min: 1, max: 9, palette: PALETTE}, 'LULC ' + REGION + ' ' + YEAR);

// --------------------------------- Exports -----------------------------------
Export.image.toDrive({
  image: classified,
  description: 'camgeo_lulc_' + REGION + '_' + YEAR + '_raw',
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_lulc_' + REGION + '_' + YEAR + '_raw',
  region: region,
  scale: SCALE,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

Export.table.toDrive({
  collection: validated,
  description: 'camgeo_validation_' + REGION + '_' + YEAR,
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_validation_' + REGION + '_' + YEAR,
  fileFormat: 'CSV'
});
