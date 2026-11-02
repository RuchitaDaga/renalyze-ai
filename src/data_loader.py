import pandas as pd


def load_dataset(csv_path: str) -> pd.DataFrame:
    """
    Load the CKD dataset from a CSV file.
    """
    df = pd.read_csv(csv_path)
    print(f"Loaded: {df.shape}")
    return df
