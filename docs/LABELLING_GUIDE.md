# CamGeo Visual Interpretation & Labelling Manual

Accurate machine learning models depend entirely on rigorous training annotations. This manual instructs analysts on identifying complex landscape classes across Cameroon.

## 1. General Photo-Interpretation Rules

- Always assess a **100 m × 100 m spatial buffer (1 hectare)** around the coordinate, rather than the isolated central pixel.
- Verify historical imagery across both dry and wet seasons to distinguish permanent tree crops from cyclical annual agriculture.
- When an observation shows ambiguous multi-class mixtures, select the dominant canopy stratum and record secondary components in the metadata notes.

## 2. Structural Identification Keys (10 Classes)

### Class 1 — Dense Humid Forest
- **Visual Texture**: Continuous dark-green canopy, irregular canopy height with emergent trees, unbroken texture along river galleries.
- **Distinction**: Natural forest exhibits structural heterogeneity, unlike plantations which show strict geometric rows.

### Class 2 — Degraded / Selective Disturbance
- **Visual Texture**: Canopy interrupted by small gaps (< 0.5 ha), narrow access tracks, or localized patches of lighter secondary regrowth.
- **Temporal Clue**: Logging roads and felling gaps appear as sharp laterite incisions that gradually fade into secondary vegetation over 12–24 months.

### Class 3 — Shaded Agroforestry (Tree Crops)
- **Visual Texture**: Semi-closed canopy with uneven, pebbled texture. Occasional shade trees emerge over a denser, lower layer of perennial crops (cocoa, coffee).
- **Landscape Context**: Located in proximity to village settlements, along tertiary roads, or transitioning between smallholder plots and dense forest.
- **Distinction from Class 1**: Lower canopy height variance, presence of footpaths, and subtle seasonal canopy management.
- **Distinction from Class 5**: No uniform planting grid or monoculture geometry.

### Class 4 — Open Agricultural Mosaics
- **Visual Texture**: Patchwork quilt of small, irregular fields at various vegetative stages (bare soil, growing crops, herbaceous fallow).
- **Temporal Clue**: High seasonal turnover in vegetation indices between wet and dry seasons.

### Class 5 — Industrial Monocultures
- **Visual Texture**: Rigid rectangular blocks, geometric road grids, uniform crown size, and uniform tree age (oil palm, rubber, banana).
- **Extents**: Continuous spatial blocks exceeding 10 hectares.

### Class 6 — Savanna & Shrublands
- **Visual Texture**: Open herbaceous cover with scattered shrubs or stunted trees; common in Adamawa and the montane grasslands of the Grand Ouest.
- **Temporal Clue**: Pronounced dry-season browning and occasional burn scars.

### Class 7 — Mangrove Ecosystems
- **Visual Texture**: Dense tidal forest lining estuaries, delta channels, and coastal mudflats (Littoral and Sud-Ouest).

### Class 8 — Aquatic Surfaces
- **Visual Texture**: Permanent water bodies (rivers, lakes, reservoirs) displaying uniform dark or sediment-turbid tones.

### Class 9 — Impervious / Urban Fabric
- **Visual Texture**: High concentration of roof surfaces, orthogonal street networks, industrial structures, and compacted ground.

### Class 10 — Bare Soil & Mineral Surfaces
- **Visual Texture**: Completely unvegetated ground, active quarries, open-cast artisanal mining pits, and active erosion scarps.

## 3. Metadata Recording Standards

Every annotated sample record must conform to the required schema:
- `confidence`: `high` (unambiguous signature), `medium` (requires multi-date validation), `low` (flagged for senior review).
- `review_status`: `pending`, `reviewed`, `rejected`.
- `notes`: Document secondary characteristics (e.g., presence of shade trees, drainage ditches, recent clearing).
