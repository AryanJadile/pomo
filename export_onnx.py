import torch
import torchvision.models as models
import torch.nn as nn
import os

def export_model_to_onnx():
    device = torch.device('cpu')
    model = models.efficientnet_b0(weights=None)
    num_classes = 5
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, num_classes)
    
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "pome_vision_model.pth")
    if not os.path.exists(model_path):
        print(f"Model path not found: {model_path}")
        return
        
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    # Dummy input matching the expected input shape [batch_size, channels, height, width]
    dummy_input = torch.randn(1, 3, 224, 224, device=device)
    
    onnx_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "pome_vision_model.onnx")
    
    torch.onnx.export(model,
                      dummy_input,
                      onnx_path,
                      export_params=True,
                      opset_version=12,
                      do_constant_folding=True,
                      input_names=['input'],
                      output_names=['output'],
                      dynamic_axes={'input': {0: 'batch_size'},
                                    'output': {0: 'batch_size'}})
    
    print(f"Successfully exported ONNX model to: {onnx_path}")

if __name__ == "__main__":
    export_model_to_onnx()
