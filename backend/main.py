from pathlib import Path
import catboost as cb
import joblib
import numpy as np
import pandas as pd
from typing import Optional, List
from fastapi import FastAPI, HTTPException   # ❌ Depends removed
...
from backend.auth import router as auth_router  # ❌ get_current_user removed

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.preprocessing import preprocess_single_sample
from backend.routers import report   # ✅ correct import

# ✅ CREATE APP FIRST
app = FastAPI(title="Renalyze CKD API")

# ✅ THEN INCLUDE ROUTERS
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(report.router)   # ✅ now this is valid


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye open; prod me specific origin use karo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST / RESPONSE MODELS
# =========================


class CKDInput(BaseModel):
    # Core labs & urine (same as CSV header)
    age: float = Field(alias="Age of the patient")
    bp: float = Field(alias="Blood pressure (mm/Hg)")
    sg: float = Field(alias="Specific gravity of urine")
    al: float = Field(alias="Albumin in urine")
    su: float = Field(alias="Sugar in urine")
    rbc: str = Field(alias="Red blood cells in urine")
    pc: str = Field(alias="Pus cells in urine")
    pcc: str = Field(alias="Pus cell clumps in urine")
    ba: str = Field(alias="Bacteria in urine")
    bgr: float = Field(alias="Random blood glucose level (mg/dl)")
    bu: float = Field(alias="Blood urea (mg/dl)")
    sc: float = Field(alias="Serum creatinine (mg/dl)")
    sodium: float = Field(alias="Sodium level (mEq/L)")
    potassium: float = Field(alias="Potassium level (mEq/L)")
    hemoglobin: float = Field(alias="Hemoglobin level (gms)")
    pcv: float = Field(alias="Packed cell volume (%)")
    wbc: float = Field(alias="White blood cell count (cells/cumm)")
    rbc_count: float = Field(alias="Red blood cell count (millions/cumm)")

    # Conditions
    htn: str = Field(alias="Hypertension (yes/no)")
    dm: str = Field(alias="Diabetes mellitus (yes/no)")
    cad: str = Field(alias="Coronary artery disease (yes/no)")
    appetite: str = Field(alias="Appetite (good/poor)")
    pe: str = Field(alias="Pedal edema (yes/no)")
    ane: str = Field(alias="Anemia (yes/no)")

    # Advanced renal function & labs
    egfr: float = Field(alias="Estimated Glomerular Filtration Rate (eGFR)")
    upr: float = Field(alias="Urine protein-to-creatinine ratio")
    urine_output: float = Field(alias="Urine output (ml/day)")
    serum_albumin: float = Field(alias="Serum albumin level")
    cholesterol: float = Field(alias="Cholesterol level")
    pth: float = Field(alias="Parathyroid hormone (PTH) level")
    serum_calcium: float = Field(alias="Serum calcium level")
    serum_phosphate: float = Field(alias="Serum phosphate level")

    # History & lifestyle
    family_history: str = Field(alias="Family history of chronic kidney disease")
    smoking: str = Field(alias="Smoking status")
    bmi: float = Field(alias="Body Mass Index (BMI)")
    physical_activity: str = Field(alias="Physical activity level")
    dm_duration: float = Field(alias="Duration of diabetes mellitus (years)")
    htn_duration: float = Field(alias="Duration of hypertension (years)")

    # Biomarkers
    cystatin_c: float = Field(alias="Cystatin C level")
    microscopy: str = Field(alias="Urinary sediment microscopy results")
    crp: float = Field(alias="C-reactive protein (CRP) level")
    il6: float = Field(alias="Interleukin-6 (IL-6) level")


class FeatureImpact(BaseModel):
    name: str
    value: Optional[float] = None
    impact: float


class CKDOutput(BaseModel):
    risk: str
    probability: float
    top_features: Optional[List[FeatureImpact]] = None  # for SHAP / importance


# =========================
# LOAD MODEL & ENCODERS
# =========================

MODEL_PATH = Path("outputs/models/catboost_ckd_model.cbm")
LABEL_ENCODER_PATH = Path("outputs/models/ckd_label_encoder.joblib")
CAT_ENCODERS_PATH = Path("outputs/models/categorical_encoders.joblib")

if not MODEL_PATH.exists():
    raise RuntimeError(f"Model file not found: {MODEL_PATH}")

model = cb.CatBoostClassifier()
model.load_model(str(MODEL_PATH))

label_encoder = (
    joblib.load(LABEL_ENCODER_PATH) if LABEL_ENCODER_PATH.exists() else None
)
cat_encoders = (
    joblib.load(CAT_ENCODERS_PATH) if CAT_ENCODERS_PATH.exists() else None
)  # currently unused


# =========================
# ROUTES
# =========================


@app.get("/")
def root():
    return {"message": "Renalyze CKD API is running ✅"}


@app.post("/predict", response_model=CKDOutput)
def predict_ckd(
    inp: CKDInput,
):
    try:
        # by_alias=True => keys CSV headers jaise honge
        input_dict = inp.model_dump(by_alias=True)

        # Preprocess using your existing pipeline
        X = preprocess_single_sample(input_dict)

        preds = model.predict(X)
        probas = model.predict_proba(X)

        # CatBoost multiclass predict() returns shape (n, 1) -> flatten to a scalar
        pred_raw = np.ravel(preds)[0]
        confidence = float(max(probas[0]))

        # Decode label if encoder used in training
        if label_encoder is not None:
            risk_label = label_encoder.inverse_transform([int(pred_raw)])[0]
        else:
            risk_label = str(pred_raw)

        # =========================
        # Global feature importance
        # =========================
        top_impacts: List[FeatureImpact] = []

        try:
            importances = model.get_feature_importance(type="FeatureImportance")
            feature_names = list(X.columns)

            if len(importances) == len(feature_names):
                feature_values = X.iloc[0].tolist()
                impacts: List[FeatureImpact] = []

                for name, val, imp in zip(feature_names, feature_values, importances):
                    numeric_val: Optional[float] = None
                    try:
                        if pd.notna(val):
                            numeric_val = float(val)
                    except Exception:
                        numeric_val = None

                    impacts.append(
                        FeatureImpact(
                            name=str(name),
                            value=numeric_val,
                            impact=float(imp),
                        )
                    )

                impacts_sorted = sorted(
                    impacts, key=lambda f: abs(f.impact), reverse=True
                )
                top_impacts = impacts_sorted[:5]
            else:
                print(
                    f"Feature importance length mismatch: "
                    f"{len(importances)} vs {len(feature_names)}"
                )
        except Exception as fi_err:
            print("Feature importance error:", fi_err)
            top_impacts = []

        return CKDOutput(
            risk=risk_label,
            probability=confidence,
            top_features=top_impacts if top_impacts else None,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
