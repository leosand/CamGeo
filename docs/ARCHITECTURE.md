# CamGeo Technical Architecture

This document describes the technical stack and data flow. Core constraint: **zero infrastructure cost at startup** — every component relies on permanent open platforms and non-commercial tiers.

## 1. Design Principles

1. **Free Forever at Baseline Scale** — no paid proprietary service is required to reproduce the project.
2. **Sensor-Fusion Core** — systematically combining optical reflectance (Sentinel-2) with microwave structural sensitivity (Sentinel-1 SAR) to resolve cloud-obscured canopies and agroforestry structure.
3. **Reproducible Pipeline as Code** — pipelines, parameters, and manifests live in Git; heavy rasters and vectors live in open object registries (Hugging Face / Zenodo).
4. **Interoperable Open Standards** — STAC cataloging, Cloud-Optimized GeoTIFFs (COG), and GeoParquet.

## 2. Architecture Layers

| Layer | Tool / Standard | Role |
|---|---|---|
| Cloud Processing | Google Earth Engine (non-commercial) | Satellite composites, SAR metrics, feature extraction, Random Forest |
| Local Analytics | Python (camgeo package, GeoPandas) | Independent validation, error matrix computation, GeoParquet export |
| Code Hosting & CI | GitHub Actions | Linters (ruff, black), unit tests, automated STAC metadata validation |
| Data Publishing | Hugging Face Datasets + Zenodo | Open benchmark distribution, versioned releases, DOI minting |
| Discovery | Static STAC Catalog (GitHub Pages) | Machine-readable indexing of collections, items, and assets |
| Visualization | MapLibre GL JS | Open-source web preview for raster and sample layers |

## 3. Data Flow

```
Satellite Archives (Sentinel-1 SAR + Sentinel-2 Optical + Copernicus DEM)
        │
        ▼
[GEE] Cloud-filtered multi-temporal composites & SAR dual-pol metrics
        │
        ▼
[GEE] Multi-sensor feature stack (10 m / 20 m resolution)
        │
        ▼
[GEE] Regional Random Forest classification (10 ecological classes)
        │
        ▼
[GEE] Spatial and temporal consistency filters
        │
        ▼
[Python] Area-adjusted validation & confusion matrix generation (Olofsson et al.)
        │
        ▼
[Python] Export: COG rasters + GeoParquet sample vectors + STAC manifests
        │
        ▼
Publication: Hugging Face Datasets + Zenodo (citable DOI) + STAC Catalog
```
