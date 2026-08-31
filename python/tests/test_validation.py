"""Unit tests for camgeo.validation (Stage 7).

Run with: pytest tests/ -v
The expected values below are computed by hand — do not change the fixture
without recomputing them.
"""

import pandas as pd

from camgeo.validation import confusion_matrix, overall_accuracy, per_class_metrics

# reference (truth): [1, 1, 1, 2, 2, 3]
# predicted:         [1, 1, 2, 2, 3, 3]
# Hand-computed:
#   matrix rows = reference, cols = predicted
#   ref 1 -> pred 1: 2, pred 2: 1          (row sum 3)
#   ref 2 -> pred 2: 1, pred 3: 1          (row sum 2)
#   ref 3 -> pred 3: 1                     (row sum 1)
#   correct = 2 + 1 + 1 = 4, total = 6  ->  OA = 4/6 = 0.6667
#   class 1: precision = 2/2 = 1.0, recall = 2/3 = 0.6667, F1 = 0.8

FIXTURE = pd.DataFrame({
    "class_code": [1, 1, 1, 2, 2, 3],
    "classification": [1, 1, 2, 2, 3, 3],
})


def test_confusion_matrix_shape_and_values():
    cm = confusion_matrix(FIXTURE)
    assert cm.loc[1, 1] == 2
    assert cm.loc[1, 2] == 1
    assert cm.loc[2, 3] == 1
    assert cm.to_numpy().sum() == 6


def test_overall_accuracy():
    cm = confusion_matrix(FIXTURE)
    assert abs(overall_accuracy(cm) - 4 / 6) < 1e-9


def test_per_class_metrics_class_1():
    cm = confusion_matrix(FIXTURE)
    metrics = per_class_metrics(cm).set_index("class_code")
    assert metrics.loc[1, "precision"] == 1.0
    assert abs(metrics.loc[1, "recall"] - 2 / 3) < 1e-3
    assert abs(metrics.loc[1, "f1"] - 0.8) < 1e-3
    assert metrics.loc[1, "support"] == 3


def test_per_class_metrics_all_classes_present():
    cm = confusion_matrix(FIXTURE)
    metrics = per_class_metrics(cm)
    assert set(metrics["class_code"]) == {1, 2, 3}
