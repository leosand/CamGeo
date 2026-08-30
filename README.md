# CamGeo

**Open, AI-ready geospatial data for Cameroon — built in the open, by a community.**

## What is CamGeo?

CamGeo is an open science project. Our goal is to produce detailed, well-documented maps and datasets of Cameroon that artificial intelligence (AI) models can learn from directly.

Our first product is a set of annual **land use and land cover (LULC)** maps — maps that show what covers the ground (forest, savanna, farmland, water, cities, mines) and how it changes over time.

We are inspired by two reference projects:

- **MapBiomas** (Brazil, mapbiomas.org): annual LULC maps produced since 1985 with free satellite data, fully open code and open methods.
- **FLAIR-HUB** (France, by the national mapping agency IGN): a very large, carefully annotated dataset designed to train AI models, distributed on Hugging Face with open source benchmarks.

CamGeo adapts their methods to Cameroon: local classes, local validation, local partners.

## Scope of version 0.1 (the MVP)

Our minimum viable product (MVP) covers **7 regions of Cameroon** — about 297,000 km², or 62% of the national territory. They were chosen to represent the country's main landscapes, from dense rainforest to the western highlands:

| Region | Main landscape | Why it matters |
|---|---|---|
| East (Est) | Dense humid forest | Logging, mining, forest concessions |
| South (Sud) | Forest and farming front | Cocoa, smallholder deforestation |
| Adamawa (Adamaoua) | Forest–savanna transition | Fast agricultural and pastoral change |
| Littoral | Coast and city | Industrial plantations, mangroves, Douala urban growth |
| West (Ouest) | High plateaus (Grassfields) | Very dense population, intensive farming, erosion |
| Northwest (Nord-Ouest) | Highlands, montane grassland | Pastoralism, farming on slopes, montane forest loss |
| Southwest (Sud-Ouest) | Humid forest, Mount Cameroon | Agro-industrial plantations, cocoa, mangroves |

The last three regions form the **Grand Ouest**, a block of highlands and densely farmed landscapes that is a hard — and therefore valuable — test for any classification method.

- **Time period**: 2017 to present (the Sentinel-2 satellite era), one map per year
- **Spatial detail**: 10 to 30 metres per pixel
- **Classes**: 8–10 land cover classes (see [METHODOLOGY.md](METHODOLOGY.md))

## What we produce

1. **Annual LULC maps** — open data under the CC-BY-4.0 licence
2. **Training samples** — labelled examples for machine learning (ML), each one documented with its source, date and quality level
3. **A STAC catalogue** — a standard, machine-readable index of all our data (STAC = SpatioTemporal Asset Catalog)
4. **Validation reports** — honest accuracy numbers for every release
5. **Open methods** — every step is documented and reproducible (see [METHODOLOGY.md](METHODOLOGY.md))

## Our principles

- **Open by default**: open code (Apache-2.0), open data (CC-BY-4.0), open methods.
- **Provenance first**: every dataset records its sources, dates, and processing steps.
- **Local knowledge matters**: maps are validated with Cameroonian experts and partners.
- **Zero-cost infrastructure**: we build on free tools (Google Earth Engine for non-commercial research, GitHub, Hugging Face) so that anyone can reproduce our work.
- **Honest quality**: we publish what works and what does not.

## Repository layout

```
CamGeo/
├── README.md            ← you are here
├── GOVERNANCE.md        ← who decides what, and how
├── METHODOLOGY.md       ← the full scientific and technical method
├── CONTRIBUTING.md      ← how to join and contribute
├── CODE_OF_CONDUCT.md   ← community rules
├── LICENSE              ← Apache-2.0 (code)
├── docs/
│   ├── ROADMAP.md       ← phases, timeline, kill criteria
│   ├── ARCHITECTURE.md  ← technical stack and data flow
│   ├── DATA_POLICY.md   ← licences, provenance, sensitive data rules
│   └── GLOSSARY.md      ← every acronym and technical term, defined
└── .github/             ← pull request and issue templates
```

## How to contribute

We welcome developers, geospatial experts, ecologists, students, and anyone with local knowledge of Cameroon. Read [CONTRIBUTING.md](CONTRIBUTING.md), then pick an open issue or propose your own.

## Governance (short version)

CamGeo is run **collegially**: anyone can propose anything, working groups decide in their own domain by lazy consensus, and a small steering committee only steps in for cross-cutting or contested decisions. Full details in [GOVERNANCE.md](GOVERNANCE.md).

## Licences

- **Code**: Apache License 2.0 (see [LICENSE](LICENSE))
- **Data and documentation**: Creative Commons Attribution 4.0 (CC-BY-4.0) — you can reuse everything, including commercially, as long as you credit CamGeo

## Key documents

| Document | Read it if you want to... |
|---|---|
| [GOVERNANCE.md](GOVERNANCE.md) | Understand roles, decisions, and how to become a maintainer |
| [METHODOLOGY.md](METHODOLOGY.md) | Understand or challenge the scientific method |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Make your first contribution |
| [docs/ROADMAP.md](docs/ROADMAP.md) | See where the project is going |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understand the technical stack |
| [docs/DATA_POLICY.md](docs/DATA_POLICY.md) | Understand data licences and sensitivity rules |
| [docs/GLOSSARY.md](docs/GLOSSARY.md) | Look up any acronym or technical term |

## Contact

Open an issue in this repository, or reach out through the community channels listed in [CONTRIBUTING.md](CONTRIBUTING.md).
