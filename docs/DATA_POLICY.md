# CamGeo Data Policy

This document defines the rules for data we use, data we produce, and data we must protect. It protects contributors, partners, and the people and ecosystems our maps describe.

## 1. Licences of input data

We only use data we are legally allowed to use. Key sources:

| Source | Licence / terms | What it allows us |
|---|---|---|
| Sentinel-1, Sentinel-2 (Copernicus/ESA) | Free and open | Full use, including derived products, with attribution |
| Landsat (USGS/NASA) | Public domain | Full use, attribution appreciated |
| SRTM / Copernicus DEM | Free and open | Full use with attribution |
| CHIRPS rainfall (UCSB) | Public domain / open | Full use with citation |
| OpenStreetMap | ODbL | Use with attribution; **careful**: derived databases may require share-alike — we use OSM only as input features, we do not republish OSM databases |
| WRI / MINFOF Forest Atlas of Cameroon | CC-BY-4.0 (per dataset — verify each layer) | Use with attribution after checking each layer's licence |
| Cam-ForestNet (research dataset) | Mixed: parts CC-BY-4.0, Planet imagery under NICFI terms | Reuse labels and open layers; **never republish restricted imagery** |
| Very high resolution imagery (e.g. NICFI Planet) | Restricted | Visual interpretation only, behind a login; **no redistribution** |

*Rule of thumb: if the licence of a source is unclear, we do not use it until it is clarified. The Data & Sensors WG keeps this table up to date.*

## 2. Licences of our outputs

- **Code**: Apache License 2.0
- **Maps, samples, catalogues, documentation**: CC-BY-4.0
  - Anyone may reuse them, including commercially.
  - Required attribution: *"Source: CamGeo project (github.com/leosand/CamGeo), Collection X.Y, CC-BY-4.0"*

## 3. Provenance (where every file comes from)

Every published dataset ships with a **manifest** — a small metadata file that records:
- the exact input datasets and versions used
- the code version (Git tag) that produced it
- the date of production and the parameters used
- the licence and attribution text
- a quality statement (what is known to be uncertain)

Example manifest (JSON):

```json
{
  "asset": "camgeo_lulc_east_2024_v0.1.tif",
  "collection": "0.1",
  "produced_at": "2026-10-15",
  "code_tag": "v0.1.0",
  "inputs": [
    {"name": "Sentinel-2 L2A", "version": "2024 annual composite"},
    {"name": "Copernicus DEM GLO-30", "version": "2021"}
  ],
  "licence": "CC-BY-4.0",
  "quality": {"overall_accuracy_forest_nonforest": 0.83}
}
```

## 4. Sensitive data rules

Some data can cause harm if published precisely. We **aggregate, blur, or withhold**:

1. **People**: no data that identifies individuals, homes, or community sites without explicit consent. Villages appear only as already mapped in public sources (e.g. OpenStreetMap).
2. **Ecosystems**: exact locations of endangered species nests, rare plants, or poaching-sensitive sites are never published at full resolution.
3. **Security**: if a partner (e.g. a park authority) asks us to restrict a layer, we respect it and document the restriction. Extra care applies in regions affected by insecurity.
4. **Land rights**: our maps are not legal documents. We never present classifications as proof of land ownership, and we say so in every dataset card. This matters especially in areas with land disputes, including parts of the Grand Ouest.

The Validation & Local Knowledge WG reviews every release against these rules. When in doubt, we publish less, not more.

## 5. Storage rules

- **Never commit large data files to Git.** Git stores manifests and code; data goes to Hugging Face / Zenodo / object storage.
- Personal data of contributors (names, emails) is never published without consent.
- Credentials and API keys are never committed; use environment variables (see [ARCHITECTURE.md](ARCHITECTURE.md)).

## 6. Takedown and corrections

Anyone can report a problem (privacy, error, misuse) by opening an issue. Verified problems are fixed in the next release and documented in the release notes. Serious privacy issues are fixed immediately, including removing data if needed.

---

*Version 0.1 — August 2026.*
