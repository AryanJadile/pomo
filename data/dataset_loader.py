import pandas as pd
import json
import os
from typing import List, Dict, Any

class FruitDatasetLoader:
    """
    Extensible Data Loader for Time-Series Fruit Datasets with Environmental metadata.
    Currently maps cross-validation families (Lythraceae/Rosaceae) via standard schemas.
    """
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = data_dir
        
    def load_environmental_data(self, csv_path: str) -> pd.DataFrame:
        """Loads environmental metadata (Temp, Humidity, Irradiance)."""
        if os.path.exists(csv_path):
            return pd.read_csv(csv_path)
        return pd.DataFrame()

    def get_fruit_mapping(self, fruit_family: str) -> Dict[str, Any]:
        """Provides mappings for disease phenotypes across similar families."""
        mappings = {
            "Lythraceae": {
                "fruit": "Pomegranate",
                "diseases": ["Anthracnose", "Blight", "Cercospora"],
                "key_compounds": ["Punicalagin", "Vitamin C"]
            },
            "Myrtaceae": {
                "fruit": "Guava",
                "diseases": ["Anthracnose", "Fruit Rot", "Canker"],
                "key_compounds": ["Vitamin C", "Lycopene"]
            },
            "Rosaceae": {
                "fruit": "Strawberry",
                "diseases": ["Anthracnose", "Botrytis", "Powdery Mildew"],
                "key_compounds": ["Anthocyanins", "Vitamin C"]
            }
        }
        return mappings.get(fruit_family, {})

    def iter_dataset(self, metadata_df: pd.DataFrame, image_dir: str):
        """Standardized generator to iterate over cross-family datasets."""
        for _, row in metadata_df.iterrows():
            yield {
                "image_id": row.get("image_id", "unknown"),
                "temp_c": row.get("temp", 25.0),
                "humidity": row.get("humidity", 60.0),
                "irradiance": row.get("irradiance", 800.0),
                "fruit_family": row.get("family", "Lythraceae"),
                "ground_truth_disease": row.get("disease_label", "Healthy")
            }

if __name__ == "__main__":
    loader = FruitDatasetLoader()
    mapping = loader.get_fruit_mapping("Lythraceae")
    print("Pomegranate Mapping:", mapping)
