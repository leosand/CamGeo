# Data Issue 1 — Sud samples v01 (Gate G2)

First reference sample set for the Sud cocoa pilot, collected in Collect Earth
Online (CEO) against the point draw produced by
`../gee/sampling/generate_sample_points.js`.

- **Region:** Sud (cocoa basin)
- **Points:** 349
- **Deliverable:** Gate G2 — see [issue #2](https://github.com/leosand/CamGeo/issues/2)
  and `../docs/RELEASE_PROCESS.md` (target v0.3.0)

## Files

| File | Role |
|---|---|
| `samples_sud_v01_ceo.csv` | 4-column import file used to load the points into CEO (`PLOTID,SAMPLEID,LAT,LON`) |
| `ceo-CamGeo---Sud---v01-plot-data-2026-10-12.csv` | CEO plot-level export (one row per plot, class distribution in percent) |
| `ceo-CamGeo---Sud---v01-sample-data-2026-10-12.csv` | CEO sample-level export (one row per interpreted point) |

## What is in the data

Sample-level export, 349 rows:

| Class | Code | Points |
|---|---|---|
| Dense humid forest | 1 | 122 |
| Degraded / secondary forest | 2 | 66 |
| Shaded agroforestry | 3 | 103 |
| Smallholder agriculture | 4 | 28 |
| Industrial plantation | 5 | 25 |
| Mangrove | 6 | 1 |
| Water | 8 | 1 |
| Urban / built-up | 9 | 3 |

Confidence reported by the interpreter: 94 `high`, 231 `medium`, 24 `low`.
Per `../samples/README.md`, `low` confidence samples never enter training.

## Privacy decisions applied to this folder

These files are published in a public repository, so `../docs/DATA_POLICY.md` §5
("Personal data of contributors — names, emails — is never published without
consent") applies:

- **The `email` column was removed** from both CEO exports. It carried a
  contributor's personal address on every row; the repository schema
  (`../samples/samples_template.csv`) has no such column and uses `interpreter`
  (a contributor id or nickname) instead.
- **Progress-report PDFs are not included.** They were part of the original
  contribution but carry the intern's and the supervisors' real names and the
  host organisation's name, which the policy forbids publishing. They can be
  shared outside the repository, or reintroduced here after redaction.

No other column was changed: order, values, encoding and line endings are the
contributor's.

## Known gap

`../samples/README.md` specifies that a sample deliverable is named
`samples_<region>_<date>_vX.csv` and follows `samples/samples_template.csv`
(`sample_id, lon, lat, region, class_code, class_name, label_date,
imagery_date, interpreter, confidence, source, review_status, reviewer, notes`).

The CEO exports here are the **raw tool output**, which is useful for traceability
but is not that deliverable yet. Producing `samples_sud_v01.csv` in the canonical
schema, with `review_status` filled by the review round, remains to be done before
the G2 quality rule (`review_status = reviewed`, confidence `high` or `medium`)
can be evaluated.
