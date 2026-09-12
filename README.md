# CamGeo

**Open, AI-ready geospatial training data and land cover benchmarks for Cameroon.**

## Overview

CamGeo is an open science initiative dedicated to solving one of Earth observation's hardest challenges in Central Africa: accurately distinguishing natural tropical forests from complex multi-layered agroforestry systems and monitoring fine-scale canopy changes under persistent equatorial cloud cover.

Global land cover products (ESA WorldCover, Google Dynamic World, Hansen GFC) face documented limitations across the Guineo-Congolian biome due to high tree-cover density in traditional shaded tree crops and chronic cloud obscuration. CamGeo provides locally validated, machine-learning-ready datasets, open reproducible pipelines, and standardized spatial benchmarks.

The project takes inspiration from two established open frameworks:
- **MapBiomas** (Brazil, mapbiomas.org): transparent annual collections, biome-tailored classification pipelines, and open algorithm theoretical basis documents.
- **FLAIR-HUB** (France, by IGN): expert-annotated spatial benchmarks, multi-sensor fusion, and standardized distribution via open machine learning registries.

## Core Products

1. **AI-Ready Training Benchmarks**: High-confidence point and polygon annotations documented with sensor provenance, temporal windows, and multi-interpreter verification.
2. **Annual Regional Calibrations**: High-resolution (10–20 m) multi-temporal composites and classification baselines covering the primary ecological zones of Cameroon.
3. **STAC Discovery Layer**: A standardized SpatioTemporal Asset Catalog indexing rasters, vector geometries, and provenance manifests.
4. **Peer-Audited Validation Matrices**: Transparent confusion matrices, area-adjusted accuracy metrics, and open validation datasets published under permanent DOIs.

## Ecological & Methodological Focus

CamGeo prioritizes distinct structural vegetation classes previously lumped into generic forest or agricultural categories:
- **Multi-layered agroforestry**: traditional shaded cocoa and coffee tree systems featuring dense upper canopies.
- **Fine-scale forest disturbance**: canopy openings, selective timber harvest tracks, and secondary regrowth mosaics.
- **Distinct agricultural morphologies**: industrial monoculture plantations versus heterogeneous smallholder crop systems.

## Scope of Version 0.1

The initial release covers **7 pilot regions** (~297,000 km², ~62% of Cameroon), capturing the full gradient from dense humid rainforests to the high plateaus and montane ecosystems of the Grand Ouest:
- **Regions**: Littoral, Sud, Est, Adamaoua, Ouest, Nord-Ouest, Sud-Ouest
- **Sensors**: Sentinel-2 (optical multi-spectral), Sentinel-1 (C-band dual-pol SAR), SRTM DEM (30 m)
- **Timeframe**: 2017–present (annual series)
- **Legend**: 10 ecologically discriminative classes (see [METHODOLOGY.md](METHODOLOGY.md))

## Principles

- **Open by Design**: Apache-2.0 for all software pipelines; CC-BY-4.0 for datasets, labels, and documentation.
- **Local Epistemic Sovereignty**: Prioritizing in-country ecological knowledge, university research networks, and localized ground observations.
- **Zero-Barrier Reproducibility**: Architected on open standards (STAC, GeoParquet, Cloud-Optimized GeoTIFFs) with reproducible compute environments.
- **Uncompromised Transparency**: Full disclosure of model uncertainty, classification errors, and persistent cloud-mask limitations.

## Repository Layout

```
CamGeo/
├── gee/                  # Earth Engine processing pipelines
│   ├── mosaics/          # Stage 2: cloud-filtered composites
│   ├── features/         # Stage 3: multi-band & structural indices
│   ├── classification/   # Stage 5: regional Random Forest models
│   └── filters/          # Stage 6: spatial-temporal consistency
├── python/               # Local validation, STAC export, metrics
├── samples/              # Training & validation manifests
├── stac/                 # Static catalog metadata
└── docs/                 # Methodology, labeling guides, architecture
```

## Contributing

We welcome contributions from ecologists, remote sensing scientists, software engineers, and local field observers. Consult `CONTRIBUTING.md` and `docs/LABELLING_GUIDE.md` to get started.

## Licences

- **Code**: Apache License 2.0 (see [LICENSE](LICENSE))
- **Data & Documentation**: Creative Commons Attribution 4.0 International ([CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/))
