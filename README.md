# Renalyze AI – CKD Risk Prediction System

Renalyze AI is a full-stack web app that predicts a patient's **Chronic Kidney Disease (CKD) risk level** from 42 clinical, lab and lifestyle parameters, and shows which parameters matter most to the model.

**Stack:** Python · CatBoost · scikit-learn · FastAPI · React (Vite) · ReportLab (PDF reports)

## How it works

```
React form (42 inputs)  ──POST /predict (JSON)──►  FastAPI
                                                   │ preprocess_single_sample(): column order + categorical cleanup
                                                   │ CatBoost multiclass model → risk class + confidence
                                                   │ top-5 features by CatBoost feature importance
React result page  ◄────────── JSON ───────────────┘
```

- **Risk classes:** `No_Disease`, `Low_Risk`, `Moderate_Risk`, `High_Risk`, `Severe_Disease`
- **PDF report:** `POST /api/download-report`
- **Auth (demo):** `POST /auth/signup`, `POST /auth/login` (in-memory store, for local testing only)

## Model

| | |
|---|---|
| Dataset | `data/kidney_disease_dataset_balanced.csv`: 82,160 rows, 42 features, 5 balanced classes |
| Split | 80/20 stratified train/test (`random_state=42`) |
| Model | `CatBoostClassifier(loss_function="MultiClass", iterations=1500, depth=6, learning_rate=0.05)`, with categorical features handled natively |
| Risk model (test) | **Accuracy 97.57%**, macro F1 0.975 (`outputs/models/ckd_metrics.txt`) |
| Stage model (test) | **Accuracy 98.76%**, macro F1 0.988 (`outputs/models_stage/ckd_stage_metrics.txt`) |
| Most important features | Urine protein-to-creatinine ratio, urine output, serum phosphate, cystatin C, IL-6 |

## Run locally

**Backend** (from the repo root):
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```
API docs: http://127.0.0.1:8000/docs

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 and go to **Predict CKD**. To point the frontend at a deployed API, set `VITE_API_URL`.

**Retrain the models (optional):**
```bash
python -m src.train --csv data/kidney_disease_dataset_balanced.csv --out-dir outputs/models
python -m src.train_stage --csv data/kidney_disease_dataset_balanced.csv --out-dir outputs/models_stage
```

## Project structure

```
backend/   FastAPI app (main.py), auth, PDF report route
src/       data loading, preprocessing, training and batch-prediction scripts
outputs/   trained CatBoost models, encoders, metrics, confusion matrix
data/      training dataset + sample test patients
frontend/  React + Vite UI
```

## Limitations and next steps

- Feature importance is **global** (whole model). Per-patient SHAP explanations are the next step.
- The dataset is synthetic/balanced. The model needs validation on real hospital data before any clinical use.
- Auth is a demo in-memory store, not production-ready.

*Built for academic purposes. Not a medical device.*
