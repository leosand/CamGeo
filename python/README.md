# CamGeo Python tools

Python package for the offline stages of the pipeline:

- **Stage 7 — validation**: confusion matrices, overall accuracy, per-class precision/recall/F1 from validation tables exported by GEE.
- **Stage 8 — exports**: convert samples to GeoParquet, build provenance manifests and STAC items.

## Install

```bash
cd python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
```

## Run the tests

```bash
pytest tests/ -v
```

## Usage

### Stage 7 — accuracy report

```python
from camgeo.validation import accuracy_report

summary = accuracy_report(
    samples_csv='camgeo_validation_Littoral_2024.csv',  # GEE export (class_code + classification columns)
    out_dir='reports/littoral_2024'
)
print(summary)
```

Writes: `confusion_matrix.csv`, `per_class_metrics.csv`, `summary.json`.

### Stage 8 — exports

```python
from camgeo.exporters import samples_csv_to_geoparquet, build_provenance_manifest, write_manifest

samples_csv_to_geoparquet('samples_littoral_v01.csv', 'samples_littoral_v01.parquet')

manifest = build_provenance_manifest(
    asset='camgeo_lulc_littoral_2024.tif',
    collection='0.1',
    code_tag='v0.1.0',
    inputs=[{'name': 'Sentinel-2 L2A', 'version': '2024 annual composite'}],
    quality={'overall_accuracy_forest_nonforest': 0.83}
)
write_manifest(manifest, 'camgeo_lulc_littoral_2024_manifest.json')
```

## Rules

- Code is formatted with `black` and linted with `ruff` (see ../CONTRIBUTING.md).
- Every function has a docstring in simple English.
- No secrets, no absolute paths, no data files committed to Git.
