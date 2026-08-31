# CamGeo STAC catalogue

**STAC** (SpatioTemporal Asset Catalog) is a standard, machine-readable way to describe geospatial data so that tools can find and use it without manual work. CamGeo publishes a static STAC catalogue with every data Collection.

## What is in this folder

- `examples/collection-example.json` — what our future Collection description will look like
- `examples/item-example.json` — what one map product (one region, one year) will look like

These are **teaching examples**: links (`href`) are placeholders. They will be replaced by real files when Collection 0.1 is published (see [../docs/ROADMAP.md](../docs/ROADMAP.md), Phase 2).

## Validate the examples

Free tools (note: since stac-validator v3, the command is `stac-validator` with a hyphen):

```bash
pip install stac-validator
stac-validator examples/collection-example.json
stac-validator examples/item-example.json
```

## Notes

- Fields starting with `camgeo:` are our own metadata (region, collection version, accuracy). If the catalogue grows, we will formalize them as a small public STAC extension.
- Licence of all data assets: CC-BY-4.0 (see [../docs/DATA_POLICY.md](../docs/DATA_POLICY.md)).
