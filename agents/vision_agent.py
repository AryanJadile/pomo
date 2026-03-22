import torch
import torchvision.models as models
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os

class PomeVisionAgent:
    def __init__(self, model_path=None):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load pre-trained EfficientNetB0
        self.model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        
        # Adjust for Pomegranate Fruit Diseases Dataset 
        self.num_classes = 5
        num_ftrs = self.model.classifier[1].in_features
        self.model.classifier[1] = nn.Linear(num_ftrs, self.num_classes)
        
        self.class_names = ['Alternaria', 'Anthracnose', 'Bacterial_Blight', 'Cercospora', 'Healthy']

        if model_path is None:
            default_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'pome_vision_model.pth')
            if os.path.exists(default_path):
                model_path = default_path

        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            
        self.model.to(self.device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def predict(self, image_path: str) -> str:
        """Predicts the disease class of a pomegranate image."""
        try:
            image = Image.open(image_path).convert('RGB')
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(input_tensor)
                _, preds = torch.max(outputs, 1)
                
            return self.class_names[preds.item()]
        except Exception as e:
            return f"Error: {str(e)}"
