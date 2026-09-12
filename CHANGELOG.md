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

### Changed

- Harmonized class nomenclature (`smallholder agriculture`, `industrial plantation`) across methodology, labeling manual, STAC metadata, sample schemas, and analytical tools.
- Prioritized pilot delivery gates (G1–G3) in `docs/RELEASE_PROCESS.md` and `docs/ROADMAP.md` focusing on southern agroforestry belt calibration (Sud & Littoral).

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
