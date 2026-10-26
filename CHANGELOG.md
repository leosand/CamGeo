# Changelog

All notable changes to CamGeo are documented here.

Format: based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: this repository uses `vMAJOR.MINOR.PATCH` (e.g. v0.1.0). Data products carry their own version (**Collection 0.1, 0.2, 1.0...**) — see [docs/RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md).

## [Unreleased]

### Added

- Area-of-Interest (AOI) & parcel analytics module (`python/camgeo/parcels.py`): zonal statistics, area breakdown in hectares, canopy integrity scoring, and audit-ready landscape report generation with full test suite (`python/tests/test_parcels.py`).
- Radar backscatter fusion in GEE feature extraction (`gee/features/feature_stack.js`): Sentinel-1 SAR C-band dual-polarization (VV, VH) and cross-ratio (VH/VV) to resolve canopy volume scattering and structure.
- Classification legend expanded to 10 scientific classes in `METHODOLOGY.md`, formalizing shaded agroforestry (Class 3) and canopy disturbance (Class 2).
- Standard 10-class color palette and multi-sensor support in GEE classification (`gee/classification/classify_region.js`) and post-processing filters (`gee/filters/postprocess_filters.js`).
- Interactive filters in the public web viewer (`viewer/index.html`): samples can be narrowed by land cover class (the legend entries double as checkboxes, so the 10 classes are listed once) and by region (dropdown built from the loaded samples, no hardcoded list). A live counter reports how many samples match, and an explicit message appears when the combination matches nothing.

### Changed

- Harmonized class nomenclature (`smallholder agriculture`, `industrial plantation`) across methodology, labeling manual, STAC metadata, sample schemas, and analytical tools.
- Prioritized pilot delivery gates (G1–G3) in `docs/RELEASE_PROCESS.md` and `docs/ROADMAP.md` focusing on southern agroforestry belt calibration (Sud & Littoral).
- Pinned `ruff==0.17.0` and `black==26.10.1` in `python/requirements-dev.txt`: the unpinned `ruff>=0.5` let new rules (`UP017`, `RUF046`) turn the CI red without any code change.

### Fixed

- `stac/examples/collection-example.json` was double JSON-encoded (a single line of escaped text), so `json.loads` failed at line 1 and the STAC validation job reported the collection as unresolvable, cascading into `item-example.json`. The file is now plain, readable JSON; content is unchanged.
- Lint/format drift in `python/camgeo/` (`exporters.py` `UP017`, `parcels.py` `I001`, `validation.py` `RUF046`) and `python/tests/test_validation.py`, restoring a green CI on `main`.
- Wrong land cover codes in the viewer demo dataset (`viewer/data/demo_points.geojson`): the Adamaoua sample declared `class_code` 3 (shaded agroforestry) for a savanna / grassland point (now 7), and the Littoral sample declared 8 (water) for an urban / built-up point (now 9). Both now match `METHODOLOGY.md` §3 and the legend in `viewer/index.html`.
- The LULC raster is now added safely when `viewer/data/regions.geojson` is absent: the viewer falls back to drawing it above the basemap instead of referencing a missing layer id.

## [v0.1.0] - 2026-08-31

First pre-release: full project framing and a complete (unexecuted) pipeline skeleton.

### Added

- Governance: collegial model with working groups, steering committee and 4-level decisions — `GOVERNANCE.md`
- Methodology inspired by MapBiomas and FLAIR-HUB, covering 7 pilot regions including the Grand Ouest — `METHODOLOGY.md`
- GEE pipeline (Stages 1–6): tiling grid, cloud-free mosaics, feature stack, sampling points, Random Forest classification, spatial/temporal filters — `gee/`
- Python tools (Stages 7–8): validation metrics (confusion matrix, OA, F1) with unit tests, GeoParquet / provenance manifest / STAC item builders — `python/`
- Community: contributing guide, code of conduct, labelling guide, recruitment plan, sample schema — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `docs/LABELLING_GUIDE.md`, `docs/RECRUITMENT.md`, `samples/`
- Standards and automation: STAC examples, label taxonomy, issue/PR templates, CI (ruff + black + pytest + STAC validation) — `stac/`, `docs/LABELS.md`, `.github/`
- Legal: Apache-2.0 (code), CC-BY-4.0 (data/docs), NOTICE with methodological attributions — `LICENSE`, `NOTICE`
- Public web viewer skeleton (MapLibre, no build step) — `viewer/`
- Delivery automation: gated release workflow, release process, citation and security files — `docs/RELEASE_PROCESS.md`, `CITATION.cff`, `SECURITY.md`

### Notes

- No data products published yet: no samples collected, no map validated. This pre-release marks a ready-to-contribute project, not a usable dataset.

[v0.1.0]: https://github.com/leosand/CamGeo/releases/tag/v0.1.0
