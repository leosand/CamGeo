# Changelog

All notable changes to CamGeo are documented here.

Format: based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: this repository uses `vMAJOR.MINOR.PATCH` (e.g. v0.1.0). Data products carry their own version (**Collection 0.1, 0.2, 1.0...**) — see [docs/RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md).

## [Unreleased]

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
