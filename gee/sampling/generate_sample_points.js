/**
 * CamGeo — Stage 4a: sample points generator (MVP Sud Region focus)
 * -----------------------------------------------------------------
 * Generates random sampling points inside the focal MVP region (Sud).
 * These points are exported as a CSV and imported into Collect Earth Online
 * where contributors visually assign land cover classes.
 *
 * Lean MVP design: focuses community labeling on the Sud cocoa belt (~350 points)
 * rather than dispersing effort across 2,800 points in 7 regions.
 *
 * How to use: paste into the GEE Code Editor, click Run, then launch the export task.
 */

// ------------------------------- Config ------------------------------------
// MVP focus: Sud region (cocoa agroforestry belt)
var REGION_NAMES = ['Sud'];
// Phase 2 multi-region expansion:
// var REGION_NAMES = ['Est', 'Sud', 'Adamaoua', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest'];

var POINTS_PER_REGION = 350; // Lean MVP target: 350 high-confidence samples
var SEED = 42;               // fixed seed = reproducible sampling
// ----------------------------------------------------------------------------

var regions = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.inList('ADM1_NAME', REGION_NAMES));

function sampleRegion(region) {
  var regionName = ee.String(region.get('ADM1_NAME'));
  var pts = ee.FeatureCollection.randomPoints({
    region: region.geometry(),
    points: POINTS_PER_REGION,
    seed: SEED,
    maxError: 50
  });
  return pts.map(function(f) {
    var coords = ee.List(f.geometry().coordinates());
    var sampleId = regionName.cat('_').cat(ee.String(f.id()));
    return f.set({
      region: regionName,
      sample_id: sampleId,
      PLOTID: sampleId,
      LON: ee.Number(coords.get(0)),
      LAT: ee.Number(coords.get(1))
    });
  });
}

var samples = ee.FeatureCollection(regions.map(sampleRegion)).flatten();

print('Total MVP sample points:', samples.size());
print('Points per region:', samples.aggregate_histogram('region'));

// --------------------------------- Display ----------------------------------
Map.centerObject(regions, 7);
Map.addLayer(regions.style({color: 'FF0000', fillColor: '00000000'}), {}, 'MVP Region (Sud)');
Map.addLayer(samples.style({color: 'FFFF00', pointSize: 2}), {}, 'Sample points');

// --------------------------------- Export -----------------------------------
Export.table.toDrive({
  collection: samples,
  description: 'camgeo_sample_points_sud_v01',
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_sample_points_sud_v01',
  fileFormat: 'CSV',
  selectors: ['PLOTID', 'LON', 'LAT', 'region', 'sample_id']
});
