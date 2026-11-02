import argparse
import os
from collections import Counter

import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)

from catboost import CatBoostClassifier

from src.data_loader import load_dataset
from src.preprocessing import preprocess_data


def train_stage_model(csv_path: str, out_dir: str, stage_col: str = "Target") -> None:
    os.makedirs(out_dir, exist_ok=True)

    # 1. Load dataset
    df = load_dataset(csv_path)

    # 2. Preprocess
    X, y, cat_features = preprocess_data(df, stage_col)

    print("Stage class distribution (original):", Counter(y))

    # 3. Encode stage labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # 4. Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.2,
        random_state=42,
        stratify=y_encoded,
    )

    print(f"Train/Test (stage): {X_train.shape} {X_test.shape}")

    # 5. Categorical indices
    cat_feature_indices = [X.columns.get_loc(c) for c in cat_features]

    # 6. CatBoost multi-class model for stages
    model = CatBoostClassifier(
        loss_function="MultiClass",
        eval_metric="Accuracy",
        iterations=1200,
        depth=7,
        learning_rate=0.05,
        random_seed=42,
        verbose=200,
        task_type="CPU",
    )

    model.fit(
        X_train,
        y_train,
        cat_features=cat_feature_indices,
        eval_set=(X_test, y_test),
        use_best_model=True,
    )

    # 7. Evaluation
    y_pred = model.predict(X_test).reshape(-1)

    acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro")
    report = classification_report(
        y_test,
        y_pred,
        target_names=le.classes_,
        digits=4,
    )
    cm = confusion_matrix(y_test, y_pred)

    print(f"\nStage Model Accuracy: {acc}")
    print(f"Stage Model Macro F1: {macro_f1}\n")
    print("Stage Classification Report:\n", report)
    print("Stage Confusion Matrix:\n", cm)

    # 8. Save artifacts
    model_path = os.path.join(out_dir, "ckd_stage_model.cbm")
    encoder_path = os.path.join(out_dir, "ckd_stage_encoder.joblib")
    metrics_path = os.path.join(out_dir, "ckd_stage_metrics.txt")

    model.save_model(model_path)
    joblib.dump(le, encoder_path)

    with open(metrics_path, "w", encoding="utf-8") as f:
        f.write(f"Accuracy: {acc:.6f}\n")
        f.write(f"Macro F1: {macro_f1:.6f}\n\n")
        f.write("Classification Report:\n")
        f.write(report)
        f.write("\nConfusion Matrix:\n")
        f.write(np.array2string(cm))

    print(f"\nStage model + metadata saved in: {out_dir}")


def main():
    parser = argparse.ArgumentParser(description="Train CKD stage prediction model.")
    parser.add_argument("--csv", required=True, help="Path to kidney dataset CSV")
    parser.add_argument("--out-dir", required=True, help="Output directory to save model")
    parser.add_argument("--stage-col", default="Target", help="Stage / severity column")

    args = parser.parse_args()

    train_stage_model(
        csv_path=args.csv,
        out_dir=args.out_dir,
        stage_col=args.stage_col,
    )


if __name__ == "__main__":
    main()
