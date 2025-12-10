#!/usr/bin/env python3
"""
Python Model Service for Softmax Regression
Loads the trained model and provides prediction API
"""

import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# ========================================
# MODEL LOADING
# ========================================

class SoftmaxRegression:
    """Softmax Regression Model"""
    
    def __init__(self, model_dict):
        self.W = model_dict['W']
        self.b = model_dict['b']
        self.n_features = model_dict['n_features']
        self.n_classes = model_dict['n_classes']
    
    def softmax(self, z):
        """Softmax function with numerical stability"""
        if z.ndim == 1:
            z = z.reshape(1, -1)
        z_shifted = z - np.max(z, axis=1, keepdims=True)
        exp_z = np.exp(z_shifted)
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)
    
    def predict(self, X):
        """Predict class labels"""
        logits = X @ self.W + self.b
        probs = self.softmax(logits)
        return np.argmax(probs, axis=1)
    
    def predict_proba(self, X):
        """Return probability distribution"""
        logits = X @ self.W + self.b
        return self.softmax(logits)


class PCATransformer:
    """PCA Transformer"""
    
    def __init__(self, pca_dict):
        self.mean = pca_dict['mean']
        self.components = pca_dict['components']
        self.n_components = pca_dict['n_components']
    
    def transform(self, X):
        """Transform data to PCA space"""
        X_centered = X - self.mean
        return X_centered @ self.components


# Load model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../public/models/softmax_pca_model.pkl')

print("🔄 Loading model...")
print(f"   Checking path: {MODEL_PATH}")
print(f"   File exists: {os.path.exists(MODEL_PATH)}")

model_data = None
pca = None
model = None

try:
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model file not found!")
        print(f"   Please run notebook Phần 7 to export the model first.")
    else:
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)
        
        print(f"   Model data keys: {model_data.keys()}")
        
        pca = PCATransformer(model_data['pca'])
        model = SoftmaxRegression(model_data['model'])
        
        print("✅ Model loaded successfully!")
        print(f"   Accuracy: {model_data['metrics']['accuracy']:.4f}")
        print(f"   Feature dimensions: 784 → {pca.n_components}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    import traceback
    traceback.print_exc()
    model_data = None
    pca = None
    model = None


# ========================================
# IMAGE PREPROCESSING
# ========================================

def preprocess_image(image_data):
    """
    Preprocess image from base64 to model input format
    
    Args:
        image_data: Base64 encoded image string
    
    Returns:
        Numpy array of shape (784,) normalized to [0, 1]
    """
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert to grayscale
        image = image.convert('L')
        
        # Resize to 28x28
        image = image.resize((28, 28), Image.LANCZOS)
        
        # Convert to numpy array
        image_array = np.array(image, dtype=np.float32)
        
        # Normalize to [0, 1]
        image_array = image_array / 255.0
        
        # Flatten to (784,)
        image_flat = image_array.flatten()
        
        return image_flat
        
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")


# ========================================
# API ENDPOINTS
# ========================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'pca_loaded': pca is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint
    
    Expects JSON body:
    {
        "image": "base64_encoded_image_string"
    }
    
    Returns:
    {
        "digit": int,
        "confidence": float,
        "probabilities": [float] * 10
    }
    """
    try:
        # Check if model is loaded
        if model is None or pca is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get image from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        image_data = data['image']
        
        # Preprocess image
        image_flat = preprocess_image(image_data)
        
        # Transform with PCA
        image_pca = pca.transform(image_flat.reshape(1, -1))
        
        # Predict
        probabilities = model.predict_proba(image_pca)[0]
        predicted_digit = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_digit])
        
        # Return results
        return jsonify({
            'digit': predicted_digit,
            'confidence': confidence,
            'probabilities': probabilities.tolist()
        })
        
    except ValueError as e:
        print(f"❌ ValueError: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None or pca is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_type': model_data['model_type'],
        'metrics': model_data['metrics'],
        'metadata': model_data['metadata'],
        'pca_info': {
            'n_components': pca.n_components,
            'variance_explained': float(np.sum(model_data['pca']['explained_variance_ratio']))
        }
    })


# ========================================
# MAIN
# ========================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Starting Python Model Service")
    print("="*60)
    print(f"   Model path: {MODEL_PATH}")
    print(f"   Server: http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
