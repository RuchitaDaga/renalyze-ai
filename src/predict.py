import argparse
import os
from typing import List

import numpy as np
import pandas as pd
import joblib
from catboost import CatBoostClassifier


ID_COLS = ["id", "ID", "patient_id", "Patient ID"]


def load_model(model_path: str) -> CatBoostClassifier:
    model = CatBoostClassifier()
    model.load_model(model_path)
    print(f"Model loaded from: {model_path}")
    return model


def load_encoder(encoder_path: str):
    encoder = joblib.load(encoder_path)
    print(f"Label encoder loaded from: {encoder_path}")
    return encoder


def prepare_features(df: pd.DataFrame, model: CatBoostClassifier) -> pd.DataFrame:
    """
    Align input dataframe with the model's expected feature set:
    - Drop target column if present
    - Drop ID columns
    - Ensure all expected columns exist
    - Drop any unexpected extra columns
    - Reorder columns to match training order
    """

    df = df.copy()

    # Drop ID-like columns if present
    dropped_ids = []
    for col in ID_COLS:
        if col in df.columns:
            df = df.drop(columns=[col])
            dropped_ids.append(col)
    if dropped_ids:
        print(f"Dropped ID columns: {dropped_ids}")

    # Drop common possible target column names if present
    for target_like in ["Target", "target", "label", "Label"]:
        if target_like in df.columns:
            df = df.drop(columns=[target_like])
            print(f"Dropped existing target column from input: {target_like}")

    # Get feature names from trained model
    feature_names: List[str] = model.feature_names_
    print(f"Model expects {len(feature_names)} features.")

    # Add missing columns as NaN
    missing_cols = [c for c in feature_names if c not in df.columns]
    if missing_cols:
        print(f"Adding missing columns with NaN: {missing_cols}")
        for c in missing_cols:
            df[c] = np.nan

    # Drop extra columns not used by model
    extra_cols = [c for c in df.columns if c not in feature_names]
    if extra_cols:
        print(f"Dropping unused extra columns: {extra_cols}")
        df = df.drop(columns=extra_cols)

    # Reorder columns
    df = df[feature_names]

    print(f"Final feature shape for prediction: {df.shape}")
    return df


def predict_from_csv(
    model_path: str,
    encoder_path: str,
    input_csv: str,
    out_csv: str,
    prediction_col: str = "Predicted_Label",
) -> None:
    # 1. Load model and encoder
    model = load_model(model_path)
    encoder = load_encoder(encoder_path)

    # 2. Load input data
    df_input = pd.read_csv(input_csv)
    print(f"Input data loaded: {df_input.shape} from {input_csv}")

    # Save a copy to attach predictions while keeping original columns
    df_output = df_input.copy()

    # 3. Prepare features for model
    X = prepare_features(df_input, model)

    # 4. Predict (integer labels)
    y_pred_int = model.predict(X).reshape(-1)

    # 5. Convert to original string labels using encoder
    y_pred_labels = encoder.inverse_transform(y_pred_int)

    # 6. Attach predictions
    df_output[prediction_col] = y_pred_labels

    # 7. Save output
    os.makedirs(os.path.dirname(out_csv), exist_ok=True)
    df_output.to_csv(out_csv, index=False)
    print(f"\nPredictions saved to: {out_csv}")

    # 8. Show a preview
    print("\nSample predictions:")
    print(df_output[[prediction_col]].head(10))


def main():
    parser = argparse.ArgumentParser(description="CKD Prediction Script")

    parser.add_argument(
        "--model",
        required=True,
        help="Path to trained CatBoost model (.cbm)",
    )
    parser.add_argument(
        "--encoder",
        required=True,
        help="Path to label encoder (.joblib)",
    )
    parser.add_argument(
        "--input-csv",
        required=True,
        help="Input CSV file with patient records",
    )
    parser.add_argument(
        "--out-csv",
        required=True,
        help="Output CSV file to save predictions",
    )
    parser.add_argument(
        "--prediction-col",
        default="Predicted_Label",
        help="Name of prediction column to add to output CSV",
    )

    args = parser.parse_args()

    predict_from_csv(
        model_path=args.model,
        encoder_path=args.encoder,
        input_csv=args.input_csv,
        out_csv=args.out_csv,
        prediction_col=args.prediction_col,
    )


if __name__ == "__main__":
    main()
