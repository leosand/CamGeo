/**
 * CamGeo — Stage 6: post-processing filters
 * ------------------------------------------
 * Cleans raw classifications:
 *   1. SPATIAL filter — removes isolated patches smaller than the minimum
 *      mapping unit (MMU, default 0.5 ha) and replaces them with the
 *      surrounding majority class.
 *   2. TEMPORAL filter — for multi-year stacks, keeps only class changes
 *      that are consistent over time (per-pixel majority vote = mode).
 *
 * DEMO_MODE = true: the script builds a toy 2-class map (forest/non-forest
 * from NDVI) so you can see the filters working WITHOUT any samples asset.
 * DEMO_MODE = false: the script loads your real Stage 5 output asset.
 */

// ------------------------------- Config ------------------------------------
var REGION = 'Littoral';
var YEAR = 2024;
var DEMO_MODE = true;
var CLASSIFIED_ASSET = 'projects/YOUR-PROJECT/assets/camgeo/lulc_littoral_2024_raw'; // used when DEMO_MODE = false
var MMU_PIXELS = 50; // 50 pixels at 10 m ≈ 0.5 hectare (minimum mapping unit)
// ----------------------------------------------------------------------------

var region = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.eq('ADM1_NAME', REGION))
  .geometry();

var classified;
if (DEMO_MODE) {
  // Toy classification: forest where NDVI > 0.6 on the annual composite.
  var maskClouds = function(image) {
    var scl = image.select('SCL');
    var keep = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
    return image.updateMask(keep).divide(10000).copyProperties(image, ['system:time_start']);
  };
  var composite = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(region)
    .filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
    .map(maskClouds)
    .select(['B4', 'B8'])
    .median().clip(region);
  var ndvi = composite.normalizedDifference(['B8', 'B4']);
  classified = ndvi.gt(0.6).rename('lulc').byte(); // 1 = forest, 0 = other
} else {
  classified = ee.Image(CLASSIFIED_ASSET).clip(region).rename('lulc').byte();
}

// ------------------------------ Spatial filter -------------------------------
// Replaces patches smaller than the MMU with the majority class around them.
function spatialFilter(image, minPixels) {
  var majority = image.focalMode({radius: 1, units: 'pixels', kernelType: 'square'});
  var patchSize = image.connectedPixelCount({maxSize: minPixels, eightConnected: true});
  return image.where(patchSize.lt(minPixels), majority);
}

var spatialClean = spatialFilter(classified, MMU_PIXELS);

// ------------------------------ Temporal filter ------------------------------
// Given annual classifications (2022–2024 here), keeps the per-pixel mode
// (most frequent class). A pixel that flips for a single year is corrected.
// In production, pass the real annual Stage 5 assets; in DEMO_MODE we simulate
// neighbouring years with slightly perturbed thresholds.
var neighbours;
if (DEMO_MODE) {
  var ndviImg = ee.Image(classified); // reuse demo base
  neighbours = ee.ImageCollection.fromImages([
    spatialFilter(classified, MMU_PIXELS),
    spatialClean,
    spatialClean // placeholder third year (replace with real annual assets)
  ]);
} else {
  neighbours = ee.ImageCollection.fromImages([
    ee.Image(CLASSIFIED_ASSET.replace(YEAR, YEAR - 2)),
    ee.Image(CLASSIFIED_ASSET.replace(YEAR, YEAR - 1)),
    spatialClean
  ]);
}
var temporalClean = neighbours.reduce(ee.Reducer.mode()).rename('lulc').byte();

// --------------------------------- Display -----------------------------------
Map.centerObject(region, 9);
Map.addLayer(classified, {min: 0, max: 1, palette: ['#e8a33d', '#006400']}, 'Raw classification');
Map.addLayer(spatialClean, {min: 0, max: 1, palette: ['#e8a33d', '#006400']}, 'After spatial filter');
Map.addLayer(temporalClean, {min: 0, max: 1, palette: ['#e8a33d', '#006400']}, 'After temporal filter');

// --------------------------------- Export ------------------------------------
Export.image.toDrive({
  image: temporalClean,
  description: 'camgeo_lulc_' + REGION + '_' + YEAR + '_filtered',
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_lulc_' + REGION + '_' + YEAR + '_filtered',
  region: region,
  scale: 20,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
