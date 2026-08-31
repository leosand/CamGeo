# CamGeo Viewer

A public web map for CamGeo data, built with [MapLibre GL JS](https://maplibre.org/) (open source map library). No build step, no server code, no cost: one HTML file plus GeoJSON data files.

## What it shows

- OpenStreetMap basemap
- **Region boundaries** of the 7 pilot regions (file `data/regions.geojson`)
- **Sample points** coloured by land cover class (demo file included)
- **LULC maps** (from Collection 0.1 onwards) as Cloud-Optimized GeoTIFFs through a TiTiler endpoint
- Click a sample point to see its attributes; legend matches the 9 classes of [../METHODOLOGY.md](../METHODOLOGY.md)

## Run it locally (2 minutes)

```bash
cd viewer
python -m http.server 8000
# open http://localhost:8000
```

## Add the region boundaries

The viewer expects `data/regions.geojson`. Produce it in Google Earth Engine:

1. Run `../gee/tiling/regions_grid.js`.
2. Export the **regions** (not the tiles) as GeoJSON:
   ```javascript
   Export.table.toDrive({
     collection: regions,
     description: 'camgeo_regions',
     folder: 'camgeo',
     fileNamePrefix: 'regions',
     fileFormat: 'GeoJSON'
   });
   ```
3. Copy the file into `viewer/data/regions.geojson`.

## Show a LULC map (Collection 0.1 and later)

1. Publish a map as a Cloud-Optimized GeoTIFF (COG) reachable by URL (Hugging Face, object storage).
2. In `index.html`, set:
   ```javascript
   var LULC_COG_URL = 'https://…/camgeo_lulc_littoral_2024_cog.tif';
   ```
3. The viewer streams it through the free TiTiler demo endpoint (`titiler.xyz`). For production traffic, deploy your own TiTiler on a free tier — see [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## Deploy it (free)

- **GitHub Pages** (once the repository is public): Settings → Pages → deploy from branch `main`, root. The viewer is then at `https://<user>.github.io/CamGeo/viewer/`. Note: Pages on a *private* repo requires a paid GitHub plan.
- **Cloudflare Pages** (works with private repositories on the free plan): create a Pages project connected to this repository, set the output directory to `viewer`, no build command.

## Rules

- Only publish data that passed the checks in [../docs/DATA_POLICY.md](../docs/DATA_POLICY.md) (licences, sensitive data).
- Keep the legend in `index.html` in sync with the class legend in [../METHODOLOGY.md](../METHODOLOGY.md) — a legend change is a Level 3 decision.
