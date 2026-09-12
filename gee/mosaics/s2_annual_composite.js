/**
 * CamGeo — Stage 2: cloud-free annual Sentinel-2 mosaic
 * ------------------------------------------------------
 * Builds one cloud-free composite image for the MVP pilot region (Sud).
 *
 * How to use: paste into the GEE Code Editor, click Run.
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Sud';        // MVP focal region: Sud (cocoa belt)
var YEAR = 2024;
var MONTHS = [1, 12];      // full year
var MAX_CLOUD_SCENE_PCT = 70;
var SCALE = 20;            // 20 m for fast export (10 m for final)
// ----------------------------------------------------------------------------

var region = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.eq('ADM1_NAME', REGION))
  .geometry();

function maskClouds(image) {
  var scl = image.select('SCL');
  var keep = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return image.updateMask(keep)
    .divide(10000)
    .copyProperties(image, ['system:time_start']);
}

var start = ee.Date.fromYMD(YEAR, MONTHS[0], 1);
var end = ee.Date.fromYMD(YEAR, MONTHS[1], 1).advance(1, 'month');

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(region)
  .filterDate(start, end)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', MAX_CLOUD_SCENE_PCT))
  .map(maskClouds);

print('Scenes used (Sud):', s2.size());

var composite = s2.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']).median().clip(region)
  .rename(['blue', 'green', 'red', 'nir', 'swir1', 'swir2']);

// Sentinel-1 radar fallback for persistent cloud cover
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(region)
  .filterDate(start, end)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select(['VV', 'VH'])
  .median()
  .clip(region);

// --------------------------------- Display ----------------------------------
Map.centerObject(region, 7);
Map.addLayer(composite, {bands: ['red', 'green', 'blue'], min: 0, max: 0.3}, 'True colour ' + YEAR);
Map.addLayer(composite, {bands: ['nir', 'swir1', 'red'], min: 0, max: 0.4}, 'False colour (vegetation)');
Map.addLayer(s1, {bands: ['VV'], min: -20, max: 0}, 'Sentinel-1 VV (radar)');

// --------------------------------- Export -----------------------------------
Export.image.toDrive({
  image: composite.toFloat(),
  description: 'camgeo_s2_' + REGION + '_' + YEAR,
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_s2_' + REGION + '_' + YEAR,
  region: region,
  scale: SCALE,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
