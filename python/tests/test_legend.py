"""Guards for the 10-class legend (METHODOLOGY.md §3).

The legend is the contract between four places that must never drift:

  - ``METHODOLOGY.md`` §3         — the authority (a legend change is a
                                    Level 3 governance decision)
  - ``viewer/index.html``         — the public legend drawn on the map
  - ``gee/classification/classify_region.js`` — the colours of the exported map
  - ``gee/filters/postprocess_filters.js``    — the colours of the cleaned map

These tests are deliberately static: they read the files as text so they run
without Google Earth Engine, a browser, or any extra dependency.

Run with: pytest tests/ -v
"""

import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
METHODOLOGY = REPO / "METHODOLOGY.md"
VIEWER = REPO / "viewer" / "index.html"
GEE_FILES = [
    REPO / "gee" / "classification" / "classify_region.js",
    REPO / "gee" / "filters" / "postprocess_filters.js",
]

HEX = r"#[0-9a-fA-F]{6}"


def methodology_legend() -> dict[int, str]:
    """Parse the class table of METHODOLOGY.md §3 into {code: class name}."""
    text = METHODOLOGY.read_text(encoding="utf-8")
    rows = re.findall(r"^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|", text, re.MULTILINE)
    legend = {int(code): name.strip() for code, name in rows if int(code) <= 10}
    assert sorted(legend) == list(range(1, 11)), legend
    return legend


def viewer_palette() -> list[str]:
    """Colours of the viewer CLASSES array, in class-code order."""
    text = VIEWER.read_text(encoding="utf-8")
    entries = re.findall(
        r"\{ code: (\d+), name: '[^']+', color: '(" + HEX + r")'", text
    )
    by_code = {int(code): colour for code, colour in entries}
    assert sorted(by_code) == list(range(1, 11)), by_code
    return [by_code[i] for i in range(1, 11)]


def gee_palette(path: Path) -> list[str]:
    """Colours of the PALETTE_10 / PALETTE array of a GEE script."""
    text = path.read_text(encoding="utf-8")
    match = re.search(r"var PALETTE(?:_10)?\s*=\s*\[(.*?)\];", text, re.DOTALL)
    assert match, f"no PALETTE array in {path}"
    return re.findall(HEX, match.group(1))


def test_methodology_has_ten_classes():
    legend = methodology_legend()
    assert len(legend) == 10
    # Spot-check the two classes that were swapped in the GEE palettes before
    # commit 61c98a7 (Mangrove rendered as savanna, and vice versa).
    assert legend[6].startswith("Mangrove")
    assert legend[7].startswith("Savanna")


@pytest.mark.parametrize("gee_file", GEE_FILES, ids=lambda p: p.name)
def test_gee_palette_matches_viewer(gee_file: Path):
    assert gee_palette(gee_file) == viewer_palette(), (
        f"{gee_file.relative_to(REPO)} diverges from viewer/index.html — "
        "class 6 is Mangrove (#2e8b8b) and class 7 is Savanna / grassland "
        "(#c8d47a) per METHODOLOGY.md §3"
    )


@pytest.mark.parametrize("gee_file", GEE_FILES, ids=lambda p: p.name)
def test_gee_scripts_contain_no_escaped_newlines(gee_file: Path):
    """A literal backslash-n in a script means the file was double-encoded.

    ``postprocess_filters.js`` shipped with three of them, which is a syntax
    error in Google Earth Engine and invisible to the CI otherwise.
    """
    text = gee_file.read_text(encoding="utf-8")
    assert "\\n" not in text, f"{gee_file.relative_to(REPO)} contains a literal \\n"


@pytest.mark.parametrize("gee_file", GEE_FILES, ids=lambda p: p.name)
def test_gee_scripts_target_the_mvp_region(gee_file: Path):
    """Every pipeline script must default to the Sud cocoa pilot."""
    text = gee_file.read_text(encoding="utf-8")
    assert re.search(
        r"var REGION\s*=\s*'Sud'", text
    ), f"{gee_file.relative_to(REPO)} does not target the Sud pilot"
