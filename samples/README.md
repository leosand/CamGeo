# CamGeo samples

This folder holds the **manifests** (small metadata files) that describe our training and validation samples. The samples themselves are collected in the labelling tool (Collect Earth Online) and stored as data files outside Git (see [../docs/DATA_POLICY.md](../docs/DATA_POLICY.md) — never commit large data).

## Files

- `samples_template.csv` — the column structure every sample file must follow, with example rows
- Real sample exports are named `samples_<region>_<date>_vX.csv` and listed in a manifest JSON per release

## Sample schema (each row = one point)

| Column | Type | Description |
|---|---|---|
| `sample_id` | text | Unique id: `<region>_<tool-id>` (e.g. `Sud_12345`) |
| `lon` | number | Longitude, WGS84 (EPSG:4326) |
| `lat` | number | Latitude, WGS84 |
| `region` | text | One of: Est, Sud, Adamaoua, Littoral, Ouest, Nord-Ouest, Sud-Ouest |
| `class_code` | integer | 1–10, from the legend in [../METHODOLOGY.md](../METHODOLOGY.md) §3 |
| `class_name` | text | Class name exactly as in the legend |
| `label_date` | date (YYYY-MM-DD) | When the label was assigned |
| `imagery_date` | text | Date or period of the imagery used (e.g. `2024` or `2024-01/2024-06`) |
| `interpreter` | text | Contributor id or nickname (no personal data beyond consent) |
| `confidence` | text | `high`, `medium` or `low` — low-confidence samples are always re-reviewed |
| `source` | text | `ceo` (Collect Earth Online), `visual` (other tool), or `cam-forestnet` (reused open labels) |
| `review_status` | text | `pending`, `reviewed`, `rejected` |
| `reviewer` | text | Second contributor who checked the label (empty until reviewed) |
| `notes` | text | Free text, e.g. "hazy image", "border of two classes" |

## Workflow

1. **Generate points** with `gee/sampling/generate_sample_points.js` (CSV export).
2. **Label** in Collect Earth Online following [../docs/LABELLING_GUIDE.md](../docs/LABELLING_GUIDE.md).
3. **Review**: every sample is checked by a second contributor (`review_status: reviewed`).
4. **Freeze** per release: reviewed samples are exported to GeoParquet and listed in the Collection's STAC item (see [../stac/](../stac/)).

## Quality rules

- A sample is used for training only if `review_status = reviewed` and `confidence` is `high` or `medium`.
- `low` confidence samples never enter training; they are re-examined or dropped.
- 10% of each reviewer's work is randomly re-checked by a third person each month.
- Splits are by **tile**, never by random points, so training and validation areas do not touch (avoids inflated accuracy).
