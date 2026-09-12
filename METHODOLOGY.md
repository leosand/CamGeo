# CamGeo Methodology

This document describes the scientific and technical method of CamGeo. It is inspired by two proven, open projects:

- **MapBiomas** (Brazil): biome-by-biome land cover classification in Google Earth Engine, annual map "collections", open code, and a published method document (an ATBD — Algorithm Theoretical Basis Document) for every release.
- **FLAIR-HUB** (France, IGN): expert-annotated training data, multi-sensor inputs, open benchmarks, and distribution on Hugging Face.

Our rule: **copy what is proven, adapt what is local, document everything.**

## 1. Goal

Produce annual land use and land cover (LULC) maps of 7 pilot regions of Cameroon, plus the labelled training data used to make them — all open, versioned, and reproducible.

## 2. Study area

Seven regions (~297,000 km², about 62% of Cameroon), chosen to cover the country's main landscape types (biomes):

| Region | Approx. area | Landscape | Main change drivers to detect |
|---|---|---|---|
| East (Est) | ~109,000 km² | Dense humid forest | Selective logging, mining |
| South (Sud) | ~47,000 km² | Forest and farming front | Cocoa agroforestry, smallholder farming |
| Adamawa (Adamaoua) | ~64,000 km² | Forest–savanna transition | Pastoral and agricultural expansion |
| Littoral | ~20,000 km² | Coast, mangrove, city | Plantations, urban growth |
| West (Ouest) | ~14,000 km² | High plateaus (Grassfields) | Farm intensification, erosion, gallery forest loss |
| Northwest (Nord-Ouest) | ~17,000 km² | Highlands, montane grassland | Overgrazing, farming on slopes, montane forest loss |
| Southwest (Sud-Ouest) | ~25,000 km² | Humid forest, Mount Cameroon | Plantation expansion, cocoa, urban growth |

The **Grand Ouest** block (West, Northwest, Southwest) adds highland and montane landscapes with very dense smallholder farming and agro-industrial plantations. It is the hardest test of the method: montane forest can look like grassland, and plantations can look like forest. If the pipeline works there, it works anywhere in the country.

**Tiling**: each region is split into regular tiles (for example 10 km × 10 km) so work can be divided among contributors and processed in parallel.

## 3. Classification legend (version 0.2)

| # | Class | Simple definition |
|---|---|---|
| 1 | Dense humid forest | Tall, closed-canopy natural forest (lowland and montane) |
| 2 | Degraded / secondary forest | Forest visibly disturbed (logging gaps, tracks, regrowth) |
| 3 | Shaded agroforestry | Cocoa or coffee grown beneath natural or planted shade trees |
| 4 | Smallholder agriculture | Small fields, mixed annual crops, slash-and-burn mosaics |
| 5 | Industrial plantation | Large uniform blocks (oil palm, rubber, banana, tea) |
| 6 | Mangrove | Coastal tidal forest (Littoral and Southwest only) |
| 7 | Savanna / grassland | Open vegetation, grasses, scattered trees (incl. montane grassland) |
| 8 | Water | Rivers, lakes, reservoirs |
| 9 | Urban / built-up | Cities, villages, roads |
| 10 | Bare soil / mining | Exposed ground, quarries, mine sites, eroded slopes |

Notes:
- A class that does not exist in a region (e.g. mangrove in Adamawa) is simply not mapped there.
- The legend is versioned. Changing it is a Level 3 governance decision (see [GOVERNANCE.md](GOVERNANCE.md)).

## 4. Input data

All inputs are free to use. Details and licences: [docs/DATA_POLICY.md](docs/DATA_POLICY.md).

| Source | Resolution | What we use it for |
|---|---|---|
| Sentinel-2 (Copernicus) | 10–20 m | Main optical imagery, 2017–present |
| Landsat 8/9 (USGS) | 30 m | Historical depth, backup optical data |
| Sentinel-1 (radar/SAR) | 10 m | Seeing through clouds; C-band VV/VH backscatter & cross-ratio for canopy structure |
| SRTM / Copernicus DEM | 30 m | Elevation, slope, terrain features (critical in the Grand Ouest highlands) |
| CHIRPS rainfall | ~5 km | Climate context features |
| OpenStreetMap | vector | Roads, villages, built areas |
| WRI / MINFOF Forest Atlas of Cameroon | vector | Forest concessions, protected areas |
| Cam-ForestNet (research dataset) | 10–30 m | Existing labelled deforestation-driver samples we can learn from |

*DEM = Digital Elevation Model (a map of terrain height). SAR = Synthetic Aperture Radar (satellite radar that works through clouds).*

## 5. Processing pipeline

Eight stages. Each stage is a documented, scripted, reproducible step.

### Stage 1 — Study area and tiling
Define region boundaries and tiles. Store as versioned vector files.

### Stage 2 — Cloud-free image mosaics (MapBiomas approach)
For each year, build one composite image per tile from all usable satellite scenes:
- In humid forest zones, a single month rarely has cloud-free images — we use **compositing windows of 3 to 6 months** (per-pixel best-pixel selection).
- Where optical data is still missing, Sentinel-1 radar fills the gap.
- In the highlands, we preferentially weight dry-season scenes to separate grassland from cropland.

### Stage 3 — Feature extraction
For every pixel, compute the inputs the classifier will learn from:
- Spectral bands (visible, near-infrared, shortwave infrared)
- Vegetation and water indices: **NDVI** (vegetation greenness), **NDWI** (water), **NDBI** (built-up areas)
- Radar features: **Sentinel-1 VV and VH backscatter**, plus the **VH/VV cross-ratio** (essential to separate shaded agroforestry and degraded forest from dense humid canopy)
- Terrain features from the DEM: elevation, slope, aspect — essential to separate montane forest from lowland forest and to model erosion-prone farmland
- Optional texture and seasonal statistics

### Stage 4 — Training samples
Labelled examples are the heart of the method (this is where FLAIR-HUB sets the standard):
- Collected by **visual interpretation** of very high resolution imagery by trained contributors, using a free tool (e.g. Collect Earth Online).
- Reuse of existing open labels (e.g. Cam-ForestNet classes) where licences allow.
- Every sample stores: location, class, date, interpreter, confidence, source image.
- Target for v0.1: **at least 200 samples per class per region** (for classes present in that region), reviewed by a second person.

### Stage 5 — Classification
- Version 0.1 uses **Random Forest** (RF), a robust machine learning algorithm — the same family MapBiomas uses — run inside Google Earth Engine (GEE).
- Training is done **per region** (like MapBiomas classifies biome by biome), because a cocoa agroforest in the Southwest and a maize field in the Northwest do not look alike.
- Later versions may add deep learning models (inspired by FLAIR-HUB's multimodal networks) as an experimental track, benchmarked against the RF baseline.

### Stage 6 — Post-processing filters
Raw pixel classifications are noisy. We apply, in order:
1. **Spatial filter**: remove tiny isolated patches smaller than a minimum mapping unit (e.g. 0.5 hectare).
2. **Temporal filter**: a pixel's class must be consistent across years (e.g. dense forest cannot become water for one year and forest again).
All filter rules are scripted and versioned, never manual edits.

### Stage 7 — Validation
- An **independent set of samples** (never used in training) is interpreted by the Validation WG.
- We publish a **confusion matrix** per region, plus standard metrics: **Overall Accuracy (OA)** — share of correctly labelled samples — and per-class **F1 score** (balance of precision and recall).
- Validation follows the **Olofsson et al. protocol** for area-adjusted accuracy and unbiased area estimation with 95% confidence intervals.
- Target for v0.1: OA ≥ 80 % for the forest / non-forest distinction; per-class results published honestly even when lower. We expect and report harder classes in the Grand Ouest (montane forest vs grassland; plantation vs agroforest).

### Stage 8 — Publication
- Maps as **Cloud-Optimized GeoTIFFs (COGs)** — raster files readable directly over HTTP.
- Vectors and samples as **GeoParquet** — a compact, standard, columnar geospatial format.
- A **STAC catalogue** (machine-readable index) describing every asset with its metadata.
- Data mirrored on **Hugging Face Datasets** (like FLAIR-HUB) with a dataset card documenting content, licence, and limitations.

## 6. Versioning and releases

Following MapBiomas, maps are published as numbered **Collections** (0.1, 0.2, 1.0...). Each collection ships with:
- A **method note** (our mini-ATBD): what changed, which data, which parameters, which accuracy.
- Frozen code (a Git tag) and frozen parameters, so any result can be reproduced exactly.

## 7. Reproducibility rules

1. Every result must be reproducible from repository code + documented parameters. No "it worked on my laptop".
2. Random seeds, software versions, and exact input dataset versions are committed with each run.
3. Manual edits to outputs are forbidden; fix the pipeline, not the pixels.

## 8. Ethics, sensitivity and limitations

- We never publish precise locations that could endanger people or ecosystems (e.g. exact positions of endangered species or sensitive community sites) — such data is aggregated or masked (see [docs/DATA_POLICY.md](docs/DATA_POLICY.md)).
- A 10–30 m satellite map is not a legal document: our maps do not define land ownership or official boundaries. This matters especially in areas with land disputes.
- Cloud cover, smoke and sensor limits create uncertainty; we publish per-pixel quality flags instead of hiding it.

## 9. How to challenge this methodology

This document is a living standard. Propose changes via an RFC issue (Level 3 decision, see [GOVERNANCE.md](GOVERNANCE.md)). Good challenges cite evidence: a paper, a test, or field data.

---

*Version 0.2 — August 2026 (scope extended to 7 regions, 10 discriminative classes including shaded agroforestry). Inspired by MapBiomas ATBDs and the FLAIR-HUB dataset paper.*
