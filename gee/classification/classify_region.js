/**
 * CamGeo — Stage 5: Regional Random Forest classification
 * --------------------------------------------------------
 * Trains a Random Forest classifier using multi-sensor features
 * (Sentinel-2 optical + Sentinel-1 SAR + DEM + Climate) against
 * reference training samples (10-class scientific legend).
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Littoral';
var YEAR = 2024;
var SAMPLES_ASSET = 'projects/YOUR-PROJECT/assets/camgeo/samples_littoral_v01';
var CLASS_PROPERTY = 'class_code';
var N_TREES = 100;
var SEED = 42;
var SCALE = 20;
// ----------------------------------------------------------------------------

var region = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.eq('ADM1_NAME', REGION))
  .geometry();

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

var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(region)
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select(['VV', 'VH'])
  .median().clip(region);

var s1_ratio = s1.select('VH').subtract(s1.select('VV')).rename('sar_vh_vv_ratio');
var dem = ee.Image('USGS/SRTMGL1_003');
var terrain = ee.Terrain.products(dem).clip(region);
var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .sum().clip(region).rename('rainfall_annual');

var stack = composite
  .addBands(composite.normalizedDifference(['nir', 'red']).rename('ndvi'))
  .addBands(composite.normalizedDifference(['green', 'nir']).rename('ndwi'))
  .addBands(composite.normalizedDifference(['swir1', 'nir']).rename('ndbi'))
  .addBands(s1.select(['VV', 'VH']))
  .addBands(s1_ratio)
  .addBands(dem.select('elevation').clip(region))
  .addBands(terrain.select(['slope', 'aspect']))
  .addBands(rainfall)
  .toFloat();

var samples = ee.FeatureCollection(SAMPLES_ASSET);
print('Samples loaded:', samples.size());

function addSplit(f) {
  var c = f.geometry().coordinates();
  var kx = ee.Number(ee.List(c).get(0)).multiply(10).floor();
  var ky = ee.Number(ee.List(c).get(1)).multiply(10).floor();
  var bucket = kx.multiply(31).add(ky).mod(10);
  return f.set('split', bucket.lt(7));
}
var split = samples.map(addSplit);
var trainSamples = split.filter(ee.Filter.eq('split', true));
var valSamples = split.filter(ee.Filter.eq('split', false));

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

// 10-Class Standard Color Palette:
// 1: Dense Forest (#006400)
// 2: Degraded Forest (#7a9900)
// 3: Shaded Agroforestry (#2e8b57)
// 4: Smallholder Mosaics (#e8a33d)
// 5: Industrial Plantations (#8B4513)
// 6: Savanna/Grassland (#c8d47a)
// 7: Mangrove (#2e8b8b)
// 8: Aquatic (#1f5fd0)
// 9: Urban Fabric (#d43d2a)
// 10: Bare Soil / Mineral (#c2c2c2)
var PALETTE = [
  '#006400', '#7a9900', '#2e8b57', '#e8a33d', '#8B4513',
  '#c8d47a', '#2e8b8b', '#1f5fd0', '#d43d2a', '#c2c2c2'
];

Map.centerObject(region, 8);
Map.addLayer(classified, {min: 1, max: 10, palette: PALETTE}, 'LULC ' + REGION + ' ' + YEAR);

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
