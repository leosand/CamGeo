/**
 * CamGeo — Stage 1: Study area and tiling
 * ----------------------------------------
 * Builds a 10 km x 10 km tile grid for each of the 7 pilot regions of Cameroon:
 * Est, Sud, Adamaoua, Littoral, Ouest, Nord-Ouest, Sud-Ouest.
 *
 * Output: a FeatureCollection of tiles with properties:
 *   region  (region name)
 *   tile_id (region_col_row)
 *   col, row (grid coordinates)
 *
 * How to use: paste into the GEE Code Editor and click Run.
 * An export task (to Google Drive) is prepared at the bottom.
 */

// ------------------------------- Config ------------------------------------
var REGION_NAMES = ['Est', 'Sud', 'Adamaoua', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest'];
var CELL_SIZE_M = 10000; // 10 km tiles
// ----------------------------------------------------------------------------

// Region boundaries from the FAO GAUL level-1 dataset (admin level 1 = regions).
var regions = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon'))
  .filter(ee.Filter.inList('ADM1_NAME', REGION_NAMES));

print('Regions found:', regions.aggregate_array('ADM1_NAME'));
// If a region is missing, print all available names and fix REGION_NAMES:
// print(ee.FeatureCollection('FAO/GAUL/2015/level1')
//   .filter(ee.Filter.eq('ADM0_NAME', 'Cameroon')).aggregate_array('ADM1_NAME'));

/**
 * Returns the northern-hemisphere UTM projection (e.g. EPSG:32632) for a longitude.
 * Cameroon spans UTM zones 32N and 33N; we pick the zone of the region centroid.
 */
function utmEpsg(lon) {
  var zone = ee.Number(lon).add(180).divide(6).floor().add(1).int();
  return ee.String('EPSG:326').cat(zone.format('%02d'));
}

/** Builds the tile grid for one region (an ee.Feature from the GAUL collection). */
function makeGrid(region) {
  var geom = region.geometry();
  var regionName = ee.String(region.get('ADM1_NAME'));

  // Project to the region's UTM zone so tiles are square in metres.
  var lon = ee.Number(geom.centroid(1).coordinates().get(0));
  var crs = utmEpsg(lon);
  var coords = ee.List(geom.bounds(1, crs).coordinates().get(0));
  var xmin = ee.Number(ee.List(coords.get(0)).get(0));
  var ymin = ee.Number(ee.List(coords.get(0)).get(1));
  var xmax = ee.Number(ee.List(coords.get(2)).get(0));
  var ymax = ee.Number(ee.List(coords.get(2)).get(1));

  var colIds = ee.List.sequence(xmin.divide(CELL_SIZE_M).floor(),
                                xmax.divide(CELL_SIZE_M).floor().subtract(1));
  var rowIds = ee.List.sequence(ymin.divide(CELL_SIZE_M).floor(),
                                ymax.divide(CELL_SIZE_M).floor().subtract(1));

  var cells = colIds.map(function(c) {
    return rowIds.map(function(r) {
      var x = ee.Number(c).multiply(CELL_SIZE_M);
      var y = ee.Number(r).multiply(CELL_SIZE_M);
      var cell = ee.Geometry.Rectangle([x, y, x.add(CELL_SIZE_M), y.add(CELL_SIZE_M)], crs, false)
        .transform('EPSG:4326', 1);
      var tileId = regionName.cat('_').cat(ee.Number(c).format()).cat('_').cat(ee.Number(r).format());
      return ee.Feature(cell).set({region: regionName, col: c, row: r, tile_id: tileId});
    });
  }).flatten();

  // Keep only tiles that touch the region (border tiles are kept whole, not clipped).
  return ee.FeatureCollection(cells)
    .filter(ee.Filter.intersects('.geo', geom, null, ee.ErrorMargin(1)));
}

var tiles = ee.FeatureCollection(regions.map(makeGrid)).flatten();
print('Tile count:', tiles.size());
print('Example tile:', tiles.first());

// --------------------------------- Display ----------------------------------
Map.centerObject(regions, 6);
Map.addLayer(regions.style({color: 'FF0000', fillColor: '00000000'}), {}, 'Regions');
Map.addLayer(tiles.style({color: 'FFFFFF', fillColor: '00000000', width: 1}), {}, 'Tiles 10 km');

// --------------------------------- Export -----------------------------------
// Exports the grid as a GeoJSON file to your Google Drive (folder: camgeo).
Export.table.toDrive({
  collection: tiles,
  description: 'camgeo_tiles_10km',
  folder: 'camgeo',
  fileNamePrefix: 'camgeo_tiles_10km',
  fileFormat: 'GeoJSON'
});
