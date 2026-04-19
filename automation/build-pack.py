"""
EasyTradeSetup — Pack Builder
Reads source files and packages them into tier ZIPs for Gumroad upload.
Run locally or in Google Colab (mount Drive first).
"""

import os
import zipfile
from pathlib import Path

ROOT = Path(__file__).parent.parent
DELIVERABLES = ROOT / "deliverables"
PINE_DIR     = ROOT / "pine-scripts" / "v1"

TIERS = {
    "Basic": {
        "price": "999",
        "files": [
            PINE_DIR / "ETS-Intraday-v1.0.pine",
        ],
        "output": "ETS-Basic-Pack.zip",
    },
    "Pro": {
        "price": "1999",
        "files": [
            PINE_DIR / "ETS-Intraday-v1.0.pine",
        ],
        "output": "ETS-Pro-Pack.zip",
    },
    "Expert": {
        "price": "3999",
        "files": [
            PINE_DIR / "ETS-Intraday-v1.0.pine",
        ],
        "output": "ETS-Expert-Pack.zip",
    },
}


def validate_pine(path: Path) -> bool:
    """Basic structural check on a Pine Script file."""
    if not path.exists():
        print(f"  [MISSING] {path.name}")
        return False
    content = path.read_text(encoding="utf-8")
    checks = {
        "version declaration":  "//@version=5" in content,
        "strategy/indicator":   "strategy(" in content or "indicator(" in content,
        "overlay setting":      "overlay" in content,
    }
    all_ok = True
    for check, result in checks.items():
        status = "✓" if result else "✗"
        if not result:
            all_ok = False
        print(f"  [{status}] {check}")
    return all_ok


def build_zip(tier_name: str, config: dict) -> bool:
    """Package files for a tier into a ZIP."""
    out_path = DELIVERABLES / config["output"]
    DELIVERABLES.mkdir(exist_ok=True)

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for fpath in config["files"]:
            if fpath.exists():
                zf.write(fpath, fpath.name)
                print(f"  + {fpath.name}")
            else:
                print(f"  [SKIP — not found] {fpath.name}")

    size_kb = out_path.stat().st_size / 1024
    print(f"  → {out_path.name} ({size_kb:.1f} KB)")
    return True


def main():
    print("=" * 50)
    print("EasyTradeSetup — Pack Builder")
    print("=" * 50)

    print("\n[1] Validating Pine Scripts")
    for f in PINE_DIR.glob("*.pine"):
        print(f"\n  {f.name}")
        validate_pine(f)

    print("\n[2] Building ZIPs")
    for tier, config in TIERS.items():
        print(f"\n  {tier} Pack (₹{config['price']})")
        build_zip(tier, config)

    print("\n✓ Done. Upload ZIPs from /deliverables/ to Gumroad.")
    print("=" * 50)


if __name__ == "__main__":
    main()
