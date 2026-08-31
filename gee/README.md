# CamGeo GEE scripts

JavaScript scripts for **Google Earth Engine (GEE)** — the free, non-commercial platform where CamGeo's satellite processing happens.

## How to run them

1. Create a free non-commercial GEE account at https://earthengine.google.com (register a Cloud project, choose the non-commercial tier).
2. Open the Code Editor: https://code.earthengine.google.com
3. Paste a script from this folder and click **Run**.

## Order of execution

| # | Script | Pipeline stage | Output |
|---|---|---|---|
| 1 | `tiling/regions_grid.js` | Stage 1 — study area and tiling | 10 km × 10 km tile grid for the 7 regions |
| 2 | `mosaics/s2_annual_composite.js` | Stage 2 — cloud-free mosaics | Annual Sentinel-2 composite per region |
| 3 | `features/feature_stack.js` | Stage 3 — feature extraction | Stack: bands + NDVI/NDWI/NDBI + terrain |
| 4 | `sampling/generate_sample_points.js` | Stage 4a — sampling design | Random points CSV for the labelling tool |
| 5 | `classification/classify_region.js` | Stage 5 — Random Forest | Raw LULC map + validation table (needs samples asset) |
| 6 | `filters/postprocess_filters.js` | Stage 6 — cleaning | Filtered map (spatial + temporal) |

Stages 7 (accuracy reports) and 8 (GeoParquet/STAC exports) run in Python — see `../python/`.

Each script is standalone (the GEE editor runs one script at a time). Configuration is at the top of each file.

## Rules

- Every script must run top to bottom without manual edits.
- Region names follow the FAO GAUL level-1 naming used in the scripts (`Est`, `Sud`, `Adamaoua`, `Littoral`, `Ouest`, `Nord-Ouest`, `Sud-Ouest`).
- Exports go to your own Google Drive or GEE assets; publish nothing without a provenance manifest (see ../docs/DATA_POLICY.md).
- Watch your monthly EECU quota (free tier); test on one small region first (`Littoral` is the smallest).
