/**
 * CamGeo — Stage 3: feature stack
 * --------------------------------
 * Builds the full feature image used for classification:
 *   spectral bands (from the Stage 2 composite)
 *   + vegetation / water / built-up indices (NDVI, NDWI, NDBI)
 *   + terrain features (elevation, slope, aspect from SRTM)
 *   + annual rainfall (CHIRPS, climate context)
 *
 * Standalone script: it rebuilds the annual composite so it can run alone
 * in the GEE Code Editor. Set REGION and YEAR like in Stage 2.
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Littoral';
var YEAR = 2024;
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
  .median()
  .clip(region)
  .rename(['blue', 'green', 'red', 'nir', 'swir1', 'swir2']);

// ------------------------------- Indices ------------------------------------
// NDVI  = vegetation greenness  (NIR - RED) / (NIR + RED)
// NDWI  = open water            (GREEN - NIR) / (GREEN + NIR)
// NDBI  = built-up areas        (SWIR1 - NIR) / (SWIR1 + NIR)
var ndvi = composite.normalizedDifference(['nir', 'red']).rename('ndvi');
var ndwi = composite.normalizedDifference(['green', 'nir']).rename('ndwi');
var ndbi = composite.normalizedDifference(['swir1', 'nir']).rename('ndbi');

// ------------------------------- Terrain ------------------------------------
// SRTM DEM (30 m): elevation, slope and aspect.
// Terrain features are critical in the Grand Ouest highlands to separate
// montane forest from lowland forest and to model erosion-prone farmland.
var dem = ee.Image('USGS/SRTMGL1_003');
var terrain = ee.Terrain.products(dem).clip(region); // bands: slope, aspect, hillshade
var elevation = dem.select('elevation').clip(region);

// ------------------------------- Climate ------------------------------------
// CHIRPS daily rainfall summed over the year (climate context, ~5 km).
var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .sum()
  .clip(region)
  .rename('rainfall_annual');

// ------------------------------ Final stack ---------------------------------
var stack = composite
  .addBands([ndvi, ndwi, ndbi])
  .addBands(elevation)
  .addBands(terrain.select(['slope', 'aspect']))
  .addBands(rainfall)
  .toFloat();

print('Feature stack bands:', stack.bandNames());

// --------------------------------- Display ----------------------------------
Map.centerObject(region, 8);
Map.addLayer(ndvi, {min: 0, max: 0.9, palette: ['white', 'green']}, 'NDVI');
Map.addLayer(terrain.select('slope'), {min: 0, max: 30, palette: ['blue', 'yellow', 'red']}, 'Slope (degrees)');

// ------------------- Stage 5 stub (after Stage 4 sampling) ------------------
// Once training samples are collected (see METHODOLOGY.md, Stage 4):
//
// var samples = ee.FeatureCollection('projects/YOUR-PROJECT/assets/camgeo/samples_v01');
// var classifier = ee.Classifier.smileRandomForest({numberOfTrees: 100, seed: 42})
//   .setOutputMode('CLASSIFICATION')
//   .train({features: samples, classProperty: 'landcover', inputProperties: stack.bandNames()});
// var classified = stack.classify(classifier);
// Map.addLayer(classified.randomVisualizer(), {}, 'LULC classification');

// --------------------------------- Export -----------------------------------
Export.image.toDrive({
  image: stack,
  description: 'camgeo_stack_' + REGION + '_' + YEAR,
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_stack_' + REGION + '_' + YEAR,
  region: region,
  scale: SCALE,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
