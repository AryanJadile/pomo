import numpy as np
from PIL import Image
import os
import onnxruntime as ort

class PomeVisionAgent:
    def __init__(self, model_path=None):
        self.class_names = ['Alternaria', 'Anthracnose', 'Bacterial_Blight', 'Cercospora', 'Healthy']

        if model_path is None:
            default_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'pome_vision_model.onnx')
            if os.path.exists(default_path):
                model_path = default_path

        self.session = None
        if model_path and os.path.exists(model_path):
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
        """Predicts the disease class of a pomegranate image."""
        if not self.session:
            return "Error: ONNX model not loaded"

        try:
            with Image.open(image_path) as img:
                image = img.convert('RGB')
            input_tensor = self.preprocess(image)
            
            outputs = self.session.run(None, {self.input_name: input_tensor})
            preds = np.argmax(outputs[0], axis=1)
            
            return self.class_names[preds[0]]
        except Exception as e:
            return f"Error: {str(e)}"
