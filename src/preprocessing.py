import pandas as pd
from typing import List, Tuple
from pathlib import Path
import json


# -------------------------------
# Existing function (FOR TRAINING)
# -------------------------------
def preprocess_data(
    df: pd.DataFrame, target_col: str
) -> Tuple[pd.DataFrame, pd.Series, List[str]]:
    """
    Split dataset into features (X), target (y),
    remove obvious ID columns, and detect categorical columns.
    """

    df = df.copy()

    # Drop common ID-like columns if present
    for col in ["id", "ID", "patient_id", "Patient ID"]:
        if col in df.columns:
            df = df.drop(columns=[col])

    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataframe.")

    y = df[target_col].astype(str)
    X = df.drop(columns=[target_col])

    # Categorical columns (object dtype)
    cat_features = X.select_dtypes(include=["object"]).columns.tolist()

    print("Categorical columns:", cat_features)

    return X, y, cat_features


# -----------------------------------------
# ✅ PART FOR FASTAPI / SINGLE PREDICT
# -----------------------------------------

METADATA_PATH = Path("outputs/models/metadata.json")

if not METADATA_PATH.exists():
    raise RuntimeError(f"Metadata file not found: {METADATA_PATH}")

with METADATA_PATH.open("r", encoding="utf-8") as f:
    META = json.load(f)

# 🚨 Training time wali EXACT feature order + categorical cols
if "feature_order" not in META:
    raise RuntimeError(
        f"'feature_order' key not found in metadata. Available keys: {list(META.keys())}"
    )

FEATURE_COLUMNS: List[str] = META["feature_order"]
CATEGORICAL_COLUMNS: List[str] = META.get("categorical_columns", [])


def preprocess_single_sample(data: dict) -> pd.DataFrame:
    """
    FastAPI se aaya hua single patient dict ko
    training jaise feature DataFrame me convert karega.
    """

    # Dict -> DataFrame (single row)
    df = pd.DataFrame([data])

    # Drop ID columns if accidentally sent
    for col in ["id", "ID", "patient_id", "Patient ID"]:
        if col in df.columns:
            df = df.drop(columns=[col])

    # Column order EXACT training jaisa
    df = df.reindex(columns=FEATURE_COLUMNS)

    # ---- Handle categorical columns: no NaN, all string ----
    # Sirf woh columns jo actually exist karte hain unpe apply karo
    cat_cols_present = [c for c in CATEGORICAL_COLUMNS if c in df.columns]

    if cat_cols_present:
        df[cat_cols_present] = (
            df[cat_cols_present]
            .astype("string")        # ensure string dtype
            .fillna("missing")       # NaN -> "missing"
        )

    return df
