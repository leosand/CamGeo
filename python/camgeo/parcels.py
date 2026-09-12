"""Area-of-Interest (AOI) and parcel-level landscape analytics for CamGeo.

Provides spatial intersection, zonal land cover composition, and landscape
integrity summaries for conservation zones, supply-sheds, or community perimeters.
"""

from __future__ import annotations

from typing import Any


CLASS_NAMES = {
    1: "dense humid forest",
    2: "degraded / secondary forest",
    3: "shaded agroforestry",
    4: "smallholder agriculture",
    5: "industrial plantation",
    6: "mangrove",
    7: "savanna / grassland",
    8: "water",
    9: "urban / built-up",
    10: "bare soil / mining",
}


def compute_class_breakdown(
    pixel_counts: dict[int, int], pixel_res_m: float = 10.0
) -> list[dict[str, Any]]:
    """Calculates area (in hectares) and percentage for each present class."""
    pixel_area_ha = (pixel_res_m * pixel_res_m) / 10000.0
    total_pixels = sum(pixel_counts.values())
    if total_pixels == 0:
        return []

    breakdown = []
    for code in sorted(pixel_counts.keys()):
        count = pixel_counts[code]
        area_ha = round(count * pixel_area_ha, 2)
        pct = round((count / total_pixels) * 100.0, 2)
        breakdown.append({
            "class_code": code,
            "class_name": CLASS_NAMES.get(code, "unknown"),
            "pixel_count": count,
            "area_ha": area_ha,
            "percentage": pct,
        })
    return breakdown


def evaluate_canopy_integrity(breakdown: list[dict[str, Any]]) -> dict[str, Any]:
    """Evaluates the proportion of tree-covered landscapes (natural forest vs agroforestry vs disturbance)."""
    by_code = {item["class_code"]: item["percentage"] for item in breakdown}
    dense_forest = by_code.get(1, 0.0)
    degraded_forest = by_code.get(2, 0.0)
    shaded_agroforestry = by_code.get(3, 0.0)
    total_tree_cover = round(dense_forest + degraded_forest + shaded_agroforestry, 2)

    dominant = "none"
    if total_tree_cover > 0:
        dominant = max(
            [
                ("dense humid forest", dense_forest),
                ("shaded agroforestry", shaded_agroforestry),
                ("degraded / secondary forest", degraded_forest),
            ],
            key=lambda x: x[1],
        )[0]

    return {
        "dense_forest_pct": dense_forest,
        "degraded_forest_pct": degraded_forest,
        "shaded_agroforestry_pct": shaded_agroforestry,
        "total_tree_canopy_pct": total_tree_cover,
        "canopy_dominant_class": dominant,
    }


def generate_landscape_report(
    aoi_id: str,
    pixel_counts: dict[int, int],
    metadata: dict[str, Any] | None = None,
    pixel_res_m: float = 10.0,
) -> dict[str, Any]:
    """Generates an audit-ready landscape integrity summary for an Area of Interest."""
    breakdown = compute_class_breakdown(pixel_counts, pixel_res_m=pixel_res_m)
    integrity = evaluate_canopy_integrity(breakdown)
    total_area_ha = round(sum(b["area_ha"] for b in breakdown), 2)

    return {
        "aoi_id": aoi_id,
        "total_area_ha": total_area_ha,
        "metadata": metadata or {},
        "class_breakdown": breakdown,
        "canopy_integrity": integrity,
    }
