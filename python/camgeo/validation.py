"""Stage 7 — accuracy assessment for CamGeo classifications.

Input: a validation table exported from Google Earth Engine (Stage 5),
with one row per validation sample and at least two columns:
  - the reference class assigned by a human (default column: class_code)
  - the class predicted by the classifier (default column: classification)

Output: a confusion matrix, overall accuracy, and per-class
precision / recall / F1, written to CSV and JSON files.
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


def load_samples(path: str | Path) -> pd.DataFrame:
    """Loads a validation table (CSV) and returns a DataFrame."""
    df = pd.read_csv(path)
    return df


def confusion_matrix(
    df: pd.DataFrame,
    ref_col: str = "class_code",
    pred_col: str = "classification",
) -> pd.DataFrame:
    """Builds the confusion matrix: rows = reference (truth), columns = predicted."""
    if ref_col not in df.columns or pred_col not in df.columns:
        raise ValueError(f"Missing columns: need '{ref_col}' and '{pred_col}'")
    return pd.crosstab(
        df[ref_col],
        df[pred_col],
        rownames=["reference"],
        colnames=["predicted"],
        dropna=False,
    )


def overall_accuracy(cm: pd.DataFrame) -> float:
    """Overall accuracy = share of samples on the matrix diagonal."""
    correct = sum(cm.loc[c, c] for c in cm.index if c in cm.columns)
    total = cm.to_numpy().sum()
    return float(correct / total) if total else 0.0


def per_class_metrics(cm: pd.DataFrame) -> pd.DataFrame:
    """Per-class precision, recall and F1 from a confusion matrix.

    precision = among samples predicted as class c, how many were right
    recall    = among real samples of class c, how many were found
    F1        = harmonic mean of precision and recall
    """
    rows = []
    for c in cm.index:
        tp = int(cm.loc[c, c]) if c in cm.columns else 0
        predicted_as_c = int(cm[c].sum()) if c in cm.columns else 0
        real_c = int(cm.loc[c].sum())
        precision = tp / predicted_as_c if predicted_as_c else 0.0
        recall = tp / real_c if real_c else 0.0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
        rows.append({
            "class_code": c,
            "support": real_c,
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(f1, 4),
        })
    return pd.DataFrame(rows)


def accuracy_report(
    samples_csv: str | Path,
    out_dir: str | Path,
    ref_col: str = "class_code",
    pred_col: str = "classification",
) -> dict:
    """Full Stage 7 report: writes confusion_matrix.csv, per_class_metrics.csv
    and summary.json into out_dir. Returns the summary as a dict."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    df = load_samples(samples_csv)
    cm = confusion_matrix(df, ref_col, pred_col)
    metrics = per_class_metrics(cm)

    summary = {
        "samples_csv": str(samples_csv),
        "n_validation_samples": int(len(df)),
        "overall_accuracy": round(overall_accuracy(cm), 4),
        "per_class": metrics.to_dict(orient="records"),
    }

    cm.to_csv(out_dir / "confusion_matrix.csv")
    metrics.to_csv(out_dir / "per_class_metrics.csv", index=False)
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2))
    return summary
