# CamGeo Release Process

How CamGeo versions its work and ships (pre-)releases. Releases are **delivery-gated**: a release is cut when a delivery milestone is reached, not on a calendar.

## 1. Two version lines

| Line | Format | Covers | Example |
|---|---|---|---|
| **Repository release** | `vMAJOR.MINOR.PATCH` | Code, docs, pipeline state | v0.1.0 |
| **Data Collection** | `Collection X.Y` | Published map products + samples | Collection 0.1 |

A GitHub release always carries a repository version. When it also publishes data, the notes name the Collection explicitly.

## 2. Pre-release attributes (required)

Every pre-release on this repository must have:

1. A **tag** `vX.Y.Z` on `main`
2. The **pre-release flag** set to `true` while the project is below v1.0.0
3. **Release notes** extracted from `CHANGELOG.md` (one section per version — the workflow fails if the section is missing)
4. A **passing quality gate**: Python tests green (validation + parcel analytics) + STAC examples valid (the release workflow runs them; a red gate blocks the release)
5. **Licence and attribution intact**: `LICENSE`, `NOTICE`, `docs/DATA_POLICY.md` present and unchanged since last review

## 3. Delivery gates → versions

| Gate | Target version | Criteria to cut the pre-release |
|---|---|---|
| G0 — Framing | v0.1.0 | Repo, governance, methodology, pipeline skeleton (done 2026-08-30) |
| G1 — First pixels | v0.2.0 | Stage 1–2 executed: tile grid exported + first mosaic visually validated on 2+ priority regions (Sud and Littoral pilot focus) |
| G2 — First labels | v0.3.0 | ≥ 400 reviewed samples per region in the labelling tool, prioritizing dual-interpretation of shaded agroforestry (Class 3) vs dense forest (Class 1) on pilot tiles |
| G3 — First maps & AOI metrics | v0.4.0 | Stage 5–6 run on pilot regions; GEE accuracy printed + initial parcel/AOI zonal statistics evaluated via `camgeo.parcels` |
| G4 — Collection 0.1 | v0.9.0 | Stage 7 report published (OA ≥ 80% forest/non-forest target), STAC live, DOI minted, viewer updated, benchmark parcel integrity suite verified |
| G5 — Collection 1.0 | v1.0.0 | Full re-validation across all 7 regions, national extension decision (Phase 4), governance review — first non-pre-release |

## 4. How to cut a pre-release (one click)

1. Update `CHANGELOG.md`: move items from `Unreleased` into a new `## [vX.Y.Z] - YYYY-MM-DD` section (required — the workflow checks it).
2. Go to **Actions → Release → Run workflow**, enter the version (e.g. `v0.2.0`), keep `prerelease: true`.
3. The workflow: runs the quality gate → creates and pushes the tag → creates the GitHub pre-release with the changelog section as notes.

Fallback from a terminal:

```bash
git tag -a v0.2.0 -m "CamGeo v0.2.0" && git push origin v0.2.0
gh release create v0.2.0 --prerelease --title "CamGeo v0.2.0" --generate-notes
```

## 5. Automation rules

- **CI** (`.github/workflows/ci.yml`) runs on every push/PR: lint, format, tests, STAC validation. Red CI = no release.
- **Release notes categories** (`.github/release.yml`) map merged PRs to changelog categories via our label taxonomy (`docs/LABELS.md`) — label your PRs correctly and release notes write themselves.
- **The Release workflow is the only allowed path to tags and releases** — no manual tags on `main`, so every release is traceable to a gate in this document.
- Data Collections add their own artefacts (manifests, STAC items, DOI) on top of the GitHub release; they are attached as links in the release notes.

## 6. Rollback

A broken release is never edited silently: mark it as draft, publish a patch release (vX.Y.Z+1) with the fix, and document the incident in the changelog. Data retractions follow `docs/DATA_POLICY.md` §6.

---

*Version 0.2 — August 2026.*
