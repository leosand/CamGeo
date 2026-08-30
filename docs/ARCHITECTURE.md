# CamGeo Technical Architecture

This document describes the technical stack and data flow. Core constraint: **zero infrastructure cost at startup** — every component must have a permanent free tier.

## 1. Design principles

1. **Free forever at MVP scale** — no paid service is required to reproduce the project.
2. **Portable** — code must not be locked to one vendor. The Google Earth Engine (GEE) code is the reference implementation, but the pipeline design (mosaic → features → classify → filter → validate → publish) can be re-implemented with open tools (STAC + xarray + Dask) if we ever need to leave GEE.
3. **Everything as code** — pipelines, parameters, and documentation live in Git. Data lives in object storage, referenced by manifests.
4. **Simple over clever** — a Random Forest that the whole community understands beats a deep model nobody can maintain.

## 2. Components

| Layer | Tool (free tier) | Role |
|---|---|---|
| Processing | Google Earth Engine (non-commercial) | Satellite mosaics, features, classification, filters |
| Code hosting | GitHub | Source code, issues, reviews, CI (GitHub Actions) |
| Data publishing | Hugging Face Datasets + Zenodo | Public datasets, DOI for citations |
| Catalogue | Static STAC catalogue on GitHub Pages / Cloudflare Pages | Machine-readable index of all assets |
| Viewer | MapLibre on Cloudflare Pages (later) | Public map browsing |
| Validation | Collect Earth Online (free) | Visual interpretation of samples |

**Important legal note:** GEE's free tier is for non-commercial use. Research, publication, and open data production are allowed. If CamGeo one day runs paid services on GEE outputs produced operationally, we must either switch to a paid GEE plan or re-implement the pipeline on the open stack (see §5). This is a Level 4 governance decision.

## 3. Repository structure (planned)

```
CamGeo/
├── gee/                  # Google Earth Engine scripts (JavaScript)
│   ├── mosaics/          # Stage 2: cloud-free composites
│   ├── features/         # Stage 3: indices and terrain features
│   ├── classification/   # Stage 5: Random Forest per region
│   └── filters/          # Stage 6: spatial and temporal filters
├── python/               # Python package (local tools)
│   ├── camgeo/           # sampling, validation, export, STAC builders
│   └── tests/
├── samples/              # training & validation sample manifests (small files)
├── stac/                 # static catalogue files
├── docs/                 # all documentation
└── .github/              # templates and CI workflows
```

## 4. Data flow

```
Satellite archives (Sentinel-1/2, Landsat — free)
        │
        ▼
[GEE] Cloud-free annual mosaics per tile (7 regions)
        │
        ▼
[GEE] Feature stack (bands + indices + terrain)
        │
        ▼
[GEE] Random Forest classification (per region)
        │  trained on community-labelled samples
        ▼
[GEE] Spatial + temporal filters
        │
        ▼
[Python] Validation against independent samples → accuracy report
        │
        ▼
[Python] Export: COG rasters + GeoParquet vectors + STAC metadata
        │
        ▼
Publication: Hugging Face (data) + Zenodo (DOI) + GitHub Pages (catalogue)
```

## 5. Exit strategy from GEE (portability)

If GEE's terms or quotas ever become a problem, the open-source replacement stack is:
- **STAC + COG** to find and stream imagery (e.g. from public cloud buckets)
- **xarray + Dask** for large raster computation
- **scikit-learn / PyTorch** for models
- **DuckDB + GeoParquet** for vector analytics

This path costs engineering time instead of licence fees. We keep it viable by isolating GEE-specific code inside the `gee/` folder and keeping sample/export logic in plain Python.

## 6. Environments and CI

- `requirements-dev.txt`: pinned versions for Python tools
- GitHub Actions (free for this repository): lint (ruff), format check (black), unit tests on every pull request
- No secrets in the repository. GEE authentication is personal and local; CI never touches GEE.

## 7. What we deliberately do NOT build (yet)

- No custom web platform or user accounts
- No real-time alerts (Phase 4 candidate)
- No mobile app
- No paid API

Each of these is easy to add later; each is a distraction before Collection 0.1 exists.

---

*Version 0.1 — August 2026.*
