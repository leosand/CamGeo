# CamGeo Samples Manifests & Benchmarks

This directory contains the metadata manifests and reference schema for training and validation samples. 

## Sample Schema (Each row = one point)

| Column | Type | Description |
|---|---|---|
| `sample_id` | text | Unique identifier: `<region>_<tool-id>` (e.g. `Sud_12345`) |
| `lon` | number | Longitude in decimal degrees (WGS84, EPSG:4326) |
| `lat` | number | Latitude in decimal degrees (WGS84, EPSG:4326) |
| `region` | text | GAUL ADM1 region name (e.g. Sud, Littoral, Ouest) |
| `class_code` | integer | 1–10, according to the scientific legend in `METHODOLOGY.md` |
| `class_name` | text | Canonical class name matching `METHODOLOGY.md` |
| `label_date` | date | Date of interpretation (YYYY-MM-DD) |
| `imagery_date` | text | Acquisition date or composite season (e.g. `2024-Q1`) |
| `interpreter` | text | Contributor identifier or pseudonym |
| `confidence` | text | Interpretation certainty: `high`, `medium`, or `low` |
| `source` | text | Interpretation platform (e.g. `ceo`, `sepal`, `field`) |
| `review_status` | text | Quality assurance flag: `pending`, `reviewed`, `rejected` |
| `reviewer` | text | Independent second reviewer identifier |
| `notes` | text | Field/photo notes (e.g. shade canopy density, secondary species) |

## Quality Standards

- Only samples with `review_status = reviewed` and confidence `high` or `medium` enter model training.
- Low-confidence or discordant dual-interpretations trigger expert adjudication.
- Spatial partitioning: train and validation subsets are split by spatial blocks/tiles to eliminate spatial auto-correlation.
