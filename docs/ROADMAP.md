# CamGeo Roadmap

This roadmap describes the planned phases of the project. Dates are targets, not promises — the project is built by volunteers and partners. Changes to this roadmap follow the governance process (Level 3 or 4, see [../GOVERNANCE.md](../GOVERNANCE.md)).

## Phase 0 — Foundations (Weeks 1–2)

**Goal:** the project is set up and ready for contributors.

- [x] Repository, governance, methodology, contribution guide
- [x] Labels and issue templates configured
- [x] Google Earth Engine (GEE) project created (non-commercial tier)
- [x] Region boundaries and tiling grid defined for the 7 regions (Stage 1 of the pipeline)
- [ ] First community call announced

**Exit criteria:** a new contributor can set up and run a hello-world GEE script in under 1 hour.

## Phase 1 — MVP pipeline (Weeks 3–8)

**Goal:** the full processing chain works end-to-end on one pilot tile per region.

- [x] Multi-sensor GEE feature extraction pipeline (Sentinel-1 SAR dual-pol + Sentinel-2 optical + DEM) — Stage 3
- [ ] Cloud-free mosaics for one year (Sentinel-2; Sentinel-1 fallback) — Stage 2
- [ ] First training samples collected (target: 200 per class per region, focusing on shaded agroforestry vs dense forest) — Stage 4
- [ ] Random Forest classification per region with 10-class legend — Stage 5
- [ ] Spatial and temporal filters — Stage 6

**Exit criteria:** a classified map exists for at least one tile in each of the 7 regions, produced 100% from repository code. Special attention to the Grand Ouest (West, Northwest, Southwest), where montane forest, grassland, agroforests and plantations are hardest to separate.

## Phase 2 — Validation and Collection 0.1 (Weeks 9–12)

**Goal:** publish a credible first release.

- [ ] Independent validation samples and confusion matrices per region — Stage 7
- [ ] Accuracy report published (overall accuracy, per-class F1, and Olofsson area-adjusted metrics)
- [ ] Maps exported as Cloud-Optimized GeoTIFFs (COGs); samples as GeoParquet — Stage 8
- [ ] STAC catalogue published; dataset mirrored on Hugging Face with a dataset card
- [ ] Method note (mini-ATBD) for Collection 0.1
- [ ] DOI minted via Zenodo so the work can be cited

**Exit criteria:** Collection 0.1 is public, documented, reproducible, and citable.

## Phase 3 — Community and improvement (Months 4–6)

**Goal:** grow the contributor base and improve quality.

- [ ] Partnership with at least one Cameroonian university or NGO for validation (candidates: universities of Yaoundé I, Douala, Dschang, Buea)
- [ ] Time series extended backwards with Landsat (towards 2000)
- [ ] Experimental deep learning track benchmarked against the Random Forest baseline (FLAIR-HUB inspiration)
- [ ] Public web viewer (free hosting via MapLibre)
- [ ] First external users giving feedback

## Phase 4 — Scale (Months 6–12, conditional)

**Goal:** complete national coverage by adding the 3 remaining regions (Centre, North, Far North), and decide on thematic extensions.

Options: fine-scale disturbance alerts; thematic layers (cocoa agroforestry, selective logging gaps, plantation dynamics). This phase also explores sustainability: academic research grants, open science awards, and community co-funding — while keeping data and methods 100% open. Any major strategic evolution is a Level 4 governance decision.

## Kill criteria (honesty clause)

We stop or rethink if, after Phase 2:
- Overall accuracy for forest / non-forest stays below 70% despite two improvement cycles, **or**
- Fewer than 3 active contributors remain after 3 months of outreach, **or**
- The free infrastructure proves insufficient and no open funding path exists.

Failing fast and publishing why is a success, not a shame.

---

*Version 0.2 — August 2026 (7 regions, 10 discriminative classes, Sentinel-1 radar integration). Inspired by MapBiomas and FLAIR-HUB.*
