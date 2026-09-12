/**
 * CamGeo — Stage 3: multi-sensor feature stack (MVP Sud Region)
 * -------------------------------------------------------------
 * Builds the complete multi-sensor feature image for the MVP pilot:
 *   - Sentinel-2 optical spectral bands (from Stage 2 cloud-masked composite)
 *   - Spectral indices: NDVI (greenness), NDWI (water/moisture), NDBI (built-up)
 *   - Sentinel-1 SAR C-band dual-polarization: VV, VH, and cross-ratio (VH/VV)
 *     (critical for resolving volume scattering in shaded cocoa agroforestry)
 *   - Topographic metrics from SRTM: elevation, slope, aspect
 *   - Climate context: annual precipitation from CHIRPS
 *
 * Standalone script: set REGION and YEAR, paste into the GEE Code Editor, click Run.
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Sud';        // MVP focal region: Sud (cocoa belt)
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

// --------------------------- Optical (Sentinel-2) ---------------------------
var composite = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(region)
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
  .map(maskClouds)
  .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'])
  .median()
  .clip(region)
  .rename(['blue', 'green', 'red', 'nir', 'swir1', 'swir2']);

var ndvi = composite.normalizedDifference(['nir', 'red']).rename('ndvi');
var ndwi = composite.normalizedDifference(['green', 'nir']).rename('ndwi');
var ndbi = composite.normalizedDifference(['swir1', 'nir']).rename('ndbi');

// ------------------------------ Radar (Sentinel-1) --------------------------
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(region)
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select(['VV', 'VH'])
  .median()
  .clip(region);

var s1_ratio = s1.select('VH').subtract(s1.select('VV')).rename('sar_vh_vv_ratio');

// ------------------------------- Topography ---------------------------------
var dem = ee.Image('USGS/SRTMGL1_003');
var terrain = ee.Terrain.products(dem).clip(region);
var elevation = dem.select('elevation').clip(region);

// --------------------------------- Climate ----------------------------------
var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
  .sum()
  .clip(region)
  .rename('rainfall_annual');

// ------------------------------ Combined Stack ------------------------------
var stack = composite
  .addBands([ndvi, ndwi, ndbi])
  .addBands(s1.select(['VV', 'VH']))
  .addBands(s1_ratio)
  .addBands(elevation)
  .addBands(terrain.select(['slope', 'aspect']))
  .addBands(rainfall)
  .toFloat();

print('Sud feature stack bands:', stack.bandNames());

// --------------------------------- Display ----------------------------------
Map.centerObject(region, 7);
Map.addLayer(ndvi, {min: 0, max: 0.9, palette: ['white', 'green']}, 'NDVI (Sud)');
Map.addLayer(s1_ratio, {min: -15, max: -3, palette: ['blue', 'yellow', 'red']}, 'SAR VH/VV Ratio');

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
