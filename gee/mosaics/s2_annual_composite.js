/**
 * CamGeo — Stage 2: cloud-free annual Sentinel-2 mosaic
 * ------------------------------------------------------
 * Builds one cloud-free composite image for one region and one year.
 * Method (MapBiomas-style): take every usable Sentinel-2 scene of the year,
 * mask clouds pixel by pixel, then keep the median value of each pixel.
 *
 * In humid forest zones (Est, Sud, Littoral, Sud-Ouest) clouds are frequent:
 * if the composite has holes, widen the window (see MONTHS below) or use
 * the Sentinel-1 radar fallback included at the bottom.
 *
 * How to use: paste into the GEE Code Editor, set REGION and YEAR, click Run.
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Littoral';   // one of: Est, Sud, Adamaoua, Littoral, Ouest, Nord-Ouest, Sud-Ouest
var YEAR = 2024;
var MONTHS = [1, 12];      // full year; for humid zones you can try [1, 6] + [7, 12] and compare
var MAX_CLOUD_SCENE_PCT = 70; // pre-filter: drop very cloudy scenes
var SCALE = 20;          // export resolution in metres (10 = full detail, 20 = faster)
// ----------------------------------------------------------------------------

var region = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.eq('ADM1_NAME', REGION))
  .geometry();

/**
 * Masks clouds using the Scene Classification Layer (SCL) delivered with
 * Sentinel-2 Level-2A. Removes: cloud shadows (3), medium clouds (8),
 * high clouds (9) and thin cirrus (10). Also rescales to reflectance 0-1.
 */
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

print('Scenes used:', s2.size());

var composite = s2.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']).median().clip(region)
  .rename(['blue', 'green', 'red', 'nir', 'swir1', 'swir2']);

// Radar fallback for persistently cloudy areas (Sentinel-1 sees through clouds).
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(region)
  .filterDate(start, end)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select(['VV', 'VH'])
  .median()
  .clip(region);

// --------------------------------- Display ----------------------------------
Map.centerObject(region, 8);
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
