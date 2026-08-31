"""Stage 8 — export helpers for CamGeo releases.

Builds the three artefacts every published asset needs (see docs/DATA_POLICY.md):
  - GeoParquet sample files (standard geospatial format)
  - provenance manifests (JSON: inputs, code version, quality)
  - STAC items (machine-readable description of each map product)
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


def samples_csv_to_geoparquet(csv_path: str | Path, out_path: str | Path) -> Path:
    """Converts a samples CSV (with lon/lat columns) to GeoParquet."""
    import geopandas as gpd
    import pandas as pd

    df = pd.read_csv(csv_path)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["lon"], df["lat"]),
        crs="EPSG:4326",
    )
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    gdf.to_parquet(out_path, index=False)
    return out_path


def build_provenance_manifest(
    asset: str,
    collection: str,
    code_tag: str,
    inputs: list[dict],
    quality: dict,
    licence: str = "CC-BY-4.0",
) -> dict:
    """Builds the provenance manifest documented in docs/DATA_POLICY.md §3."""
    return {
        "asset": asset,
        "collection": collection,
        "produced_at": datetime.now(timezone.utc).date().isoformat(),
        "code_tag": code_tag,
        "inputs": inputs,
        "licence": licence,
        "quality": quality,
    }


def write_manifest(manifest: dict, out_path: str | Path) -> Path:
    """Writes a provenance manifest dict to a JSON file."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(manifest, indent=2))
    return out_path


def build_stac_item(
    item_id: str,
    region: str,
    year: int,
    bbox: list[float],
    geometry: dict,
    assets: dict,
    overall_accuracy: float | None = None,
    collection: str = "camgeo-lulc",
    collection_version: str = "0.1",
) -> dict:
    """Builds a STAC item for one map product (see stac/examples/).

    assets: dict of {name: {"href": url, "type": mime, "title": label, "roles": [...]}}
    """
    return {
        "stac_version": "1.0.0",
        "type": "Feature",
        "id": item_id,
        "collection": collection,
        "geometry": geometry,
        "bbox": bbox,
        "properties": {
            "datetime": f"{year}-12-31T00:00:00Z",
            "camgeo:region": region,
            "camgeo:collection_version": collection_version,
            "camgeo:overall_accuracy": overall_accuracy,
        },
        "assets": assets,
        "links": [],
    }
