# CamGeo Scientific Roadmap & Milestones

This document charts the progressive development of the open CamGeo infrastructure.

## Phase 1 — Framework & Pilot Regional Baselines (Months 1–3)

- [x] Technical architecture, governance rules, and open code repository initialization.
- [x] Multi-sensor GEE feature extraction pipeline (Sentinel-1 SAR + Sentinel-2 optical + DEM).
- [ ] Pilot benchmark collection over the Littoral and Sud pilot regions (focusing on shaded agroforestry vs dense forest).
- [ ] Initial release of 1,500 expert-reviewed training geometries published in GeoParquet format.

## Phase 2 — Multi-Region Expansion & Public Collection 0.1 (Months 4–6)

- [ ] Extension of processing grids across 7 administrative regions covering the major biomes of Cameroon.
- [ ] Execution of stratified independent accuracy audits (error matrices and F1 scores published per class).
- [ ] STAC static catalog deployment and dataset distribution via Hugging Face and Zenodo registries.
- [ ] Publication of the Collection 0.1 Technical Methodology Note (mini-ATBD).

## Phase 3 — National Scale, Temporal Depth & Modeling (Months 7–12)

- [ ] Complete national synthesis across the remaining three northern regions (Centre, Nord, Extrême-Nord).
- [ ] Retrospective annual time series back-processing to establish multi-year land dynamics baselines.
- [ ] Deployment of deep learning benchmark baselines (U-Net / vision transformers) evaluated against the Random Forest baseline.
- [ ] Submission of a peer-reviewed data paper documenting the open benchmark dataset.

## Continuity & Maintenance Criteria

The initiative prioritizes sustainable long-term data quality:
- If overall forest-vs-non-forest validation falls below 75% accuracy across two consecutive evaluation runs, pipeline parameters undergo mandatory community review.
- Annual collections are released consistently to maintain unbroken ecological monitoring baselines.
