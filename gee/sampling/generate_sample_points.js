/**
 * CamGeo — Stage 4a: stratified sample points generator
 * ------------------------------------------------------
 * Generates random sampling points inside each of the 7 pilot regions.
 * These points are exported as a CSV and imported into a labelling tool
 * (e.g. Collect Earth Online) where contributors visually assign a land
 * cover class to each point (see docs/LABELLING_GUIDE.md).
 *
 * Design: equal allocation per region (simple random within region).
 * After the first classification exists (Stage 5), a second round will use
 * stratification by predicted class to target rare classes.
 *
 * How to use: paste into the GEE Code Editor, set the config, click Run,
 * then launch the export task (Tasks tab).
 */

// ------------------------------- Config ------------------------------------
var REGION_NAMES = ['Est', 'Sud', 'Adamaoua', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest'];
var POINTS_PER_REGION = 400; // v0.1 target: ~2800 points total
var SEED = 42;             // fixed seed = reproducible sampling
// ----------------------------------------------------------------------------

var regions = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.inList('ADM1_NAME', REGION_NAMES));

/** Generates random points for one region and tags them with metadata. */
function sampleRegion(region) {
  var regionName = ee.String(region.get('ADM1_NAME'));
  var pts = ee.FeatureCollection.randomPoints({
    region: region.geometry(),
    points: POINTS_PER_REGION,
    seed: SEED,
    maxError: 50
  });
  // Add region name, a unique sample id, and explicit lon/lat columns.
  return pts.map(function(f) {
    var coords = ee.List(f.geometry().coordinates());
    var sampleId = regionName.cat('_').cat(ee.String(f.id()));
    return f.set({
      region: regionName,
      sample_id: sampleId,
      PLOTID: sampleId,               // PLOTID/LON/LAT = expected by Collect Earth Online
      LON: ee.Number(coords.get(0)),
      LAT: ee.Number(coords.get(1))
    });
  });
}

var samples = ee.FeatureCollection(regions.map(sampleRegion)).flatten();

print('Total points:', samples.size());
print('Points per region:', samples.aggregate_histogram('region'));

// --------------------------------- Display ----------------------------------
Map.centerObject(regions, 6);
Map.addLayer(regions.style({color: 'FF0000', fillColor: '00000000'}), {}, 'Regions');
Map.addLayer(samples.style({color: 'FFFF00', pointSize: 2}), {}, 'Sample points');

// --------------------------------- Export -----------------------------------
// CSV with exactly the columns the labelling tool needs.
Export.table.toDrive({
  collection: samples,
  description: 'camgeo_sample_points_v01',
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_sample_points_v01',
  fileFormat: 'CSV',
  selectors: ['PLOTID', 'LON', 'LAT', 'region', 'sample_id']
});
