import numpy as np
from PIL import Image
import os
import onnxruntime as ort

class PomeVisionAgentONNX:
    def __init__(self, model_path):
        self.class_names = ['Alternaria', 'Anthracnose', 'Bacterial_Blight', 'Cercospora', 'Healthy']
        self.session = ort.InferenceSession(model_path)
        self.input_name = self.session.get_inputs()[0].name

    def preprocess(self, image: Image.Image) -> np.ndarray:
        image = image.resize((224, 224), Image.BILINEAR)
        img_data = np.array(image, dtype=np.float32) / 255.0
        img_data = np.transpose(img_data, (2, 0, 1))
        
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)
        img_data = (img_data - mean) / std
        
        return np.expand_dims(img_data, axis=0)

    def predict(self, image_path: str) -> str:
        try:
            image = Image.open(image_path).convert('RGB')
            input_tensor = self.preprocess(image)
            outputs = self.session.run(None, {self.input_name: input_tensor})
            preds = np.argmax(outputs[0], axis=1)
            return self.class_names[preds[0]]
        except Exception as e:
            return f"Error: {str(e)}"

if __name__ == "__main__":
    model_path = os.path.join("models", "pome_vision_model.onnx")
    agent = PomeVisionAgentONNX(model_path)
    # create a dummy image to test
    img = Image.new('RGB', (300, 300), color='red')
    img.save("dummy.jpg")
    print("Prediction:", agent.predict("dummy.jpg"))
    import sys
    sys.exit(0)
