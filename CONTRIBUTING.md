# Contributing to CamGeo

Thank you for your interest! CamGeo is built by a community — developers, geospatial experts, ecologists, students, and people with local knowledge of Cameroon. This guide explains how to join in.

## 1. Ways to contribute

| Contribution | Skills needed | Where to start |
|---|---|---|
| **Code** (pipelines, scripts, tools) | Python, JavaScript, or willingness to learn | Issues labelled `good first issue` |
| **Training samples** (labelling satellite images) | Careful eyes, local knowledge helps | Validation & Local Knowledge WG |
| **Validation** (checking map quality) | Geography or ecology background | Validation & Local Knowledge WG |
| **Documentation & translation** (EN/FR) | Clear writing | Community & Outreach WG |
| **Local expertise** (what is really happening on the ground) | Field knowledge of Cameroon | Open an issue, tell us what you know |
| **Design, communication, partnerships** | Varies | Community & Outreach WG |

*WG = Working Group — see [GOVERNANCE.md](GOVERNANCE.md).*

## 2. Ground rules

- Read and follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Write in **simple English** and define every acronym the first time you use it (see [docs/GLOSSARY.md](docs/GLOSSARY.md)). French is welcome in discussions; final documentation is in English so the widest community can use it.
- Small pull requests beat big ones. One change per pull request.
- Be kind in reviews: criticize work, never people.

## 3. Development setup

1. **Fork** this repository and clone your fork.
2. Create a free **Google Earth Engine (GEE)** account (non-commercial use) at earthengine.google.com — this is where satellite processing happens.
3. Install Python 3.11+ and create a virtual environment:
   ```bash
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements-dev.txt
   ```
4. Run the checks before submitting:
   ```bash
   make lint && make test
   ```

## 4. Workflow

1. **Find or open an issue** describing what you want to do. For significant changes (new data source, method change), open an **RFC** issue first (see [GOVERNANCE.md](GOVERNANCE.md), Level 3).
2. **Create a branch** from `main`: `type/short-description`, e.g. `feature/ndwi-features` or `docs/fix-glossary`.
3. **Commit** with clear messages: `type: what changed` (e.g. `feat: add NDWI index to feature stage`).
4. **Open a pull request (PR)** using the template. Link the issue it closes.
5. **Review**: a maintainer of the relevant WG reviews within ~7 days. Lazy consensus applies: after 72 hours without objections, a maintainer may merge.
6. **Merge**: done by a maintainer, squash merge, with the issue linked.

## 5. Style conventions

- **Python**: formatted with `black`, linted with `ruff`, type hints encouraged.
- **GEE JavaScript**: follow the existing examples in `gee/`.
- **Docs**: Markdown, short sentences, simple words, acronyms defined at first use.
- **Data files**: never commit large data; commit manifests (metadata files) instead — see [docs/DATA_POLICY.md](docs/DATA_POLICY.md).

## 6. Contributing training samples or validation

You do not need to code:
1. Ask to join the Validation & Local Knowledge WG (open an issue with the `validation` label).
2. You will get access to the labelling tool and the labelling guide (`docs/labelling_guide.md`, planned).
3. Every sample you label is double-checked by a second contributor — quality over quantity.

## 7. Recognition

Contributors are credited in each release note. Data contributors are listed in dataset citation files (CITATION.cff). Becoming a **maintainer** follows the contribution ladder in [GOVERNANCE.md](GOVERNANCE.md) §3.2.

## 8. Questions?

Open an issue with the `question` label, or join the monthly community call (announced in issues). There are no stupid questions — if something is unclear, our documentation needs fixing, so tell us.
