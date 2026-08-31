"""Validates the CamGeo STAC example files.

Uses pystac's built-in validator, which checks documents against the
official STAC JSON Schemas. Unlike the stac-validator CLI (whose exit
codes are hard to read in CI), this script prints the exact error for
each file and exits 1 if any file is invalid.

Run from the repository root:
    pip install "pystac[validation]"
    python python/tools/validate_stac_examples.py
"""

import sys
from pathlib import Path

from pystac import Collection, Item

# This file lives at <repo>/python/tools/validate_stac_examples.py
REPO_ROOT = Path(__file__).resolve().parents[2]
EXAMPLES_DIR = REPO_ROOT / "stac" / "examples"


def main() -> int:
    """Validates both example files. Returns 0 if all valid, 1 otherwise."""
    checks = [
        ("collection-example.json", Collection),
        ("item-example.json", Item),
    ]
    failed = False
    for filename, stac_class in checks:
        path = EXAMPLES_DIR / filename
        try:
            stac_class.from_file(str(path)).validate()
            print(f"OK   {filename} — valid STAC document")
        except Exception as exc:  # noqa: BLE001 — print any validation error
            failed = True
            print(f"FAIL {filename}")
            print(f"     {type(exc).__name__}: {exc}")
    if failed:
        print("\nAt least one STAC example is invalid (see above).")
        return 1
    print("\nAll STAC examples are valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
