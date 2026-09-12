# CamGeo Roadmap

This roadmap describes the planned phases of the project. Dates are targets, not promises — the project is built by volunteers and partners. Changes to this roadmap follow the governance process (Level 3 or 4, see [../GOVERNANCE.md](../GOVERNANCE.md)).

## Phase 0 — Foundations (Weeks 1–2)

**Goal:** the project is set up and ready for contributors.

- [x] Repository, governance, methodology, contribution guide
- [x] Labels and issue templates configured
- [x] Google Earth Engine (GEE) project created (non-commercial tier)
- [x] Region boundaries and tiling grid defined (Stage 1 of the pipeline)
- [ ] First community call announced

**Exit criteria:** a new contributor can set up and run a hello-world GEE script in under 1 hour.

## Phase 1 — MVP Pipeline: Sud Cocoa Pilot (Weeks 3–6)

**Goal:** achieve an end-to-end validated pipeline and analytical capability on a single, high-value focal crop and region (Shaded Cocoa Agroforestry in the Sud Region, ~47,000 km²).

- [x] Multi-sensor GEE feature extraction pipeline (Sentinel-1 SAR dual-pol + Sentinel-2 optical + DEM) — Stage 3
- [x] Area of Interest (AOI) & parcel analytics module (`camgeo.parcels`): zonal statistics, canopy composition, and landscape reports
- [ ] Cloud-free composite for the Sud region (Sentinel-2; Sentinel-1 radar fallback) — Stage 2
- [ ] Focused training sample collection: **350 dual-reviewed samples in the Sud region**, prioritizing shaded cocoa agroforestry vs dense forest — Stage 4
- [ ] Random Forest classification on Sud pilot tiles — Stage 5
- [ ] Spatial and temporal post-processing filters — Stage 6
- [ ] Multi-source consensus check: cross-referencing CamGeo Sud pilot classifications with open global screening data (e.g. Whisp / Forest Data Partnership)

**Exit criteria:** a validated classification exists for the Sud pilot region, with published F1 score on shaded cocoa agroforestry and automated parcel integrity extraction verified via `camgeo.parcels`.

## Phase 2 — Validation and Collection 0.1 (Weeks 7–10)

**Goal:** publish a credible, peer-audited first data release.

- [ ] Independent validation confusion matrix and Olofsson area-adjusted metrics for the Sud cocoa belt — Stage 7
- [ ] Benchmarking parcel-level zonal extraction against open field points
- [ ] Maps exported as Cloud-Optimized GeoTIFFs (COGs); samples as GeoParquet — Stage 8
- [ ] Static STAC catalogue published; dataset mirrored on Hugging Face with dataset card
- [ ] Method note (mini-ATBD) for Collection 0.1 published
- [ ] Permanent citable DOI minted via Zenodo

**Exit criteria:** Collection 0.1 (Sud Cocoa Agroforestry) is public, documented, reproducible, and citable.

## Phase 3 — Multi-Region Expansion (Months 3–6)

**Goal:** scale the validated pipeline to the remaining 6 pilot regions across Cameroon.

- [ ] Extend processing to Littoral, Est, and the Grand Ouest highlands (West, Northwest, Southwest)
- [ ] Adaptation to secondary crops (oil palm plantations in Littoral, highland farming in Ouest)
- [ ] Partnership with Cameroonian university departments (Yaoundé I, Douala, Dschang, Buea) for regional validation
- [ ] Public web map viewer (MapLibre) live with multi-region layers

## Phase 4 — National Scale & Modeling (Months 6–12, conditional)

**Goal:** complete national coverage (Centre, North, Far North) and deploy deep learning benchmarks.

Options: retrospective time series to 2000 with Landsat; deep learning baseline (U-Net / vision transformers) evaluated against Random Forest; submission of a peer-reviewed data paper. Sustainability: academic research grants, open science awards, and community co-funding.

## Kill criteria (honesty clause)

We stop or rethink if, after Phase 2:
- Shaded cocoa agroforestry F1 score stays below 0.70 despite two improvement cycles, **or**
- Fewer than 3 active contributors remain after 3 months of outreach, **or**
- The free infrastructure proves insufficient and no open funding path exists.

Failing fast and publishing why is a success, not a shame.

---

*Version 0.2 — August 2026 (streamlined for the Sud Cocoa Agroforestry Pilot). Inspired by MapBiomas and FLAIR-HUB.*
