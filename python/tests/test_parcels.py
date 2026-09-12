"""Unit tests for camgeo.parcels (Area-of-Interest & parcel analytics).

Run with: pytest tests/ -v
"""

from camgeo.parcels import (
    compute_class_breakdown,
    evaluate_canopy_integrity,
    generate_landscape_report,
)


def test_compute_class_breakdown_empty():
    assert compute_class_breakdown({}) == []


def test_compute_class_breakdown_area_and_pct():
    # 1000 pixels at 10m: 100m^2 each -> 100,000 m^2 = 10 ha
    counts = {1: 500, 3: 400, 4: 100}
    bd = compute_class_breakdown(counts, pixel_res_m=10.0)
    assert len(bd) == 3
    assert bd[0]["class_code"] == 1
    assert bd[0]["area_ha"] == 5.0
    assert bd[0]["percentage"] == 50.0

    assert bd[1]["class_code"] == 3
    assert bd[1]["class_name"] == "shaded agroforestry"
    assert bd[1]["area_ha"] == 4.0
    assert bd[1]["percentage"] == 40.0


def test_evaluate_canopy_integrity():
    counts = {1: 300, 2: 100, 3: 400, 9: 200}
    bd = compute_class_breakdown(counts, pixel_res_m=10.0)
    integrity = evaluate_canopy_integrity(bd)

    assert integrity["dense_forest_pct"] == 30.0
    assert integrity["degraded_forest_pct"] == 10.0
    assert integrity["shaded_agroforestry_pct"] == 40.0
    assert integrity["total_tree_canopy_pct"] == 80.0
    assert integrity["canopy_dominant_class"] == "shaded agroforestry"


def test_generate_landscape_report_structure():
    counts = {1: 600, 3: 400}
    meta = {"source": "test_aoi", "region": "Sud"}
    report = generate_landscape_report("AOI_SUD_001", counts, metadata=meta)

    assert report["aoi_id"] == "AOI_SUD_001"
    assert report["total_area_ha"] == 10.0
    assert report["metadata"]["region"] == "Sud"
    assert "class_breakdown" in report
    assert "canopy_integrity" in report
