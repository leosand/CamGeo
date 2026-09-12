# CamGeo Methodology

This document describes the scientific and technical method of CamGeo. It is inspired by two proven, open projects:

- **MapBiomas** (Brazil): biome-by-biome land cover classification in Google Earth Engine, annual map "collections", open code, and a published method document (an ATBD — Algorithm Theoretical Basis Document) for every release.
- **FLAIR-HUB** (France, IGN): expert-annotated training data, multi-sensor inputs, open benchmarks, and distribution on Hugging Face.

Our rule: **copy what is proven, adapt what is local, document everything.**

## 1. Goal

Produce annual land use and land cover (LULC) maps and training benchmarks for Cameroon, versioned and reproducible.

**MVP Scope (Collection 0.1)**: To avoid spreading effort thin across disparate ecosystems, Collection 0.1 concentrates on the single highest-value classification challenge in Cameroon: **the Shaded Cocoa Agroforestry Belt in the South (Sud) region** (~47,000 km²), resolving the spectral and radar ambiguity between cocoa agroforests and dense natural rainforest.

## 2. Study area

The project covers a 7-region target area (~297,000 km²), phased to maximize execution speed and quality:

| Phase | Region | Landscape | Main target driver |
|---|---|---|---|
| **Phase 1 (MVP)** | **South (Sud)** | **Dense humid forest & agroforests** | **Shaded cocoa vs dense rainforest** |
| Phase 2 | Littoral | Coast, mangrove, city | Industrial plantations, urban growth |
| Phase 2 | East (Est) | Dense humid forest | Selective logging, mining |
| Phase 2 | Grand Ouest (3 regions) | Highlands & plateaus | Intensive smallholder crops, montane forest |
| Phase 2 | Adamawa (Adamaoua) | Forest–savanna transition | Pastoral and agricultural expansion |

**Tiling**: each region is split into regular 10 km × 10 km tiles so work can be divided among contributors and processed in parallel.

## 3. Classification legend (version 0.2)

| # | Class | Simple definition | MVP Status |
|---|---|---|---|
| 1 | Dense humid forest | Tall, closed-canopy natural forest | **Core MVP class** |
| 2 | Degraded / secondary forest | Forest visibly disturbed (logging gaps, tracks, regrowth) | **Core MVP class** |
| 3 | Shaded agroforestry | Cocoa or coffee grown beneath natural or planted shade trees | **Core MVP focal class** |
| 4 | Smallholder agriculture | Small fields, mixed annual crops, slash-and-burn mosaics | **Core MVP class** |
| 5 | Industrial plantation | Large uniform blocks (oil palm, rubber, banana, tea) | Secondary (as present) |
| 6 | Mangrove | Coastal tidal forest (Littoral and Southwest only) | Phase 2 (Littoral/SW) |
| 7 | Savanna / grassland | Open vegetation, grasses, scattered trees | Secondary (fallow/edges) |
| 8 | Water | Rivers, lakes, reservoirs | Background class |
| 9 | Urban / built-up | Cities, villages, roads | Background class |
| 10 | Bare soil / mining | Exposed ground, quarries, mine sites | Secondary (quarries/soil) |

Notes:
- The legend is versioned. Changing it is a Level 3 governance decision (see [GOVERNANCE.md](GOVERNANCE.md)).

## 4. Input data

All inputs are free to use. Details and licences: [docs/DATA_POLICY.md](docs/DATA_POLICY.md).

| Source | Resolution | What we use it for |
|---|---|---|
| Sentinel-2 (Copernicus) | 10–20 m | Main optical imagery, 2017–present |
| Landsat 8/9 (USGS) | 30 m | Historical depth, backup optical data |
| Sentinel-1 (radar/SAR) | 10 m | Seeing through clouds; C-band VV/VH backscatter & cross-ratio for canopy structure |
| SRTM / Copernicus DEM | 30 m | Elevation, slope, terrain features |
| CHIRPS rainfall | ~5 km | Climate context features |
| OpenStreetMap | vector | Roads, villages, built areas |
| WRI / MINFOF Forest Atlas of Cameroon | vector | Forest concessions, protected areas |
| Cam-ForestNet (research dataset) | 10–30 m | Existing labelled deforestation-driver samples we can learn from |

*DEM = Digital Elevation Model (a map of terrain height). SAR = Synthetic Aperture Radar (satellite radar that works through clouds).*

## 5. Processing pipeline

Eight stages. Each stage is a documented, scripted, reproducible step.

### Stage 1 — Study area and tiling
Define region boundaries and tiles. Store as versioned vector files (`gee/tiling/regions_grid.js`).

### Stage 2 — Cloud-free image mosaics (MapBiomas approach)
For each year, build one composite image per tile from all usable satellite scenes:
- In humid forest zones (Sud region), compositing windows of 3 to 6 months ensure maximum cloud-free pixel availability.
- Sentinel-1 radar backscatter (VV and VH) fills chronic optical cloud gaps.

### Stage 3 — Feature extraction
For every pixel, compute the inputs the classifier will learn from:
- Spectral bands (visible, near-infrared, shortwave infrared)
- Vegetation and water indices: **NDVI** (greenness), **NDWI** (water), **NDBI** (built-up)
- Radar structural features: **Sentinel-1 VV and VH backscatter**, plus the **VH/VV cross-ratio** (essential to separate shaded cocoa agroforestry and degraded forest from dense humid canopy)
- Terrain features from the DEM: elevation, slope, aspect

### Stage 4 — Training samples (MVP Streamlining)
Labelled examples are the heart of the method (this is where FLAIR-HUB sets the standard):
- Collected by **visual interpretation** of very high resolution imagery by trained contributors, using Collect Earth Online.
- **Lean MVP Target**: Instead of collecting thousands of points across 7 biomes, Collection 0.1 concentrates on **350 high-confidence samples in the Sud pilot region**, ensuring statistical depth on the forest-agroforestry interface.
- Every sample stores: location, class, date, interpreter, confidence, source image.

### Stage 5 — Classification
- Version 0.1 uses **Random Forest** (RF), run inside Google Earth Engine (GEE).
- Trained and evaluated on the Sud region pilot tiles.

### Stage 6 — Post-processing filters
Raw pixel classifications are noisy. We apply:
1. **Spatial filter**: remove isolated patches smaller than 0.5 hectare (50 pixels at 10 m).
2. **Temporal filter**: multi-year modal consistency across annual composites.

### Stage 7 — Validation
- An **independent set of samples** (never used in training) is interpreted by the Validation WG.
- We publish a **confusion matrix**, plus **Overall Accuracy (OA)** and per-class **F1 score**.
- Validation follows the **Olofsson et al. protocol** for area-adjusted accuracy with 95% confidence intervals.
- Target for v0.1: OA ≥ 80 % for forest / non-forest; F1 ≥ 0.75 for shaded cocoa agroforestry.

### Stage 8 — Publication
- Maps as **Cloud-Optimized GeoTIFFs (COGs)**.
- Vectors and samples as **GeoParquet**.
- A **STAC catalogue** describing assets and manifests.
- Data mirrored on **Hugging Face Datasets** with a dataset card and a citable Zenodo DOI.

## 6. Versioning and releases

Following MapBiomas, maps are published as numbered **Collections** (0.1, 0.2, 1.0...). Each collection ships with a method note (mini-ATBD) and frozen Git tags.

## 7. Reproducibility rules

1. Every result must be reproducible from repository code + documented parameters. No "it worked on my laptop".
2. Random seeds, software versions, and exact input dataset versions are committed with each run.
3. Manual edits to outputs are forbidden; fix the pipeline, not the pixels.

## 8. Ethics, sensitivity and limitations

- Precise locations that could endanger people or ecosystems are aggregated or masked (see [docs/DATA_POLICY.md](docs/DATA_POLICY.md)).
- Maps do not define legal boundaries or land tenure.
- Per-pixel quality flags document sensor and cloud limits.

## 9. How to challenge this methodology

This document is a living standard. Propose changes via an RFC issue (Level 3 decision, see [GOVERNANCE.md](GOVERNANCE.md)).

---

*Version 0.2 — August 2026 (streamlined for the Sud Cocoa Agroforestry Pilot). Inspired by MapBiomas ATBDs and the FLAIR-HUB dataset paper.*
