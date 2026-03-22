import sys
import os
import torch
from PIL import Image

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agents.vision_agent import PomeVisionAgent

def create_dummy_image(path="dummy_image.jpg"):
    from PIL import Image
    image = Image.new('RGB', (224, 224), color = (73, 109, 137))
    image.save(path)
    return path

if __name__ == "__main__":
    print("Initializing Vision Agent...")
    try:
        agent = PomeVisionAgent()
        print(f"Loaded {agent.num_classes} classes: {agent.class_names}")

        dummy_path = create_dummy_image()
        print(f"Predicting on {dummy_path}...")
        
        prediction = agent.predict(dummy_path)
        print(f"Prediction result: {prediction}")

        if os.path.exists(dummy_path):
            os.remove(dummy_path)
            
        print("Verification successful!")
    except Exception as e:
        print(f"Verification failed: {e}")
