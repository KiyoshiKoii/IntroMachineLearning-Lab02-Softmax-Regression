import numpy as np
import gzip
import pickle
from urllib import request
import os

# Download MNIST dataset
def download_mnist():
    """Download MNIST dataset from online source"""
    base_url = 'http://yann.lecun.com/exdb/mnist/'
    files = [
        'train-images-idx3-ubyte.gz',
        'train-labels-idx1-ubyte.gz',
        't10k-images-idx3-ubyte.gz',
        't10k-labels-idx1-ubyte.gz'
    ]
    
    print("Downloading MNIST dataset...")
    data_dir = 'mnist_data'
    os.makedirs(data_dir, exist_ok=True)
    
    for file in files:
        filepath = os.path.join(data_dir, file)
        if not os.path.exists(filepath):
            print(f"Downloading {file}...")
            request.urlretrieve(base_url + file, filepath)
    
    return data_dir

def load_mnist_images(filename):
    """Load MNIST images from gzip file"""
    with gzip.open(filename, 'rb') as f:
        data = np.frombuffer(f.read(), np.uint8, offset=16)
    return data.reshape(-1, 28, 28)

def load_mnist_labels(filename):
    """Load MNIST labels from gzip file"""
    with gzip.open(filename, 'rb') as f:
        data = np.frombuffer(f.read(), np.uint8, offset=8)
    return data

class SoftmaxRegression:
    """
    Softmax Regression implementation from scratch using NumPy
    
    Mathematical Formulation:
    - Hypothesis: h(x) = softmax(Wx + b)
    - Softmax: P(y=k|x) = exp(z_k) / sum(exp(z_j))
    - Loss: Cross-entropy = -1/m * sum(y * log(y_hat))
    - Gradient: dL/dW = -1/m * X^T * (y - y_hat)
    """
    
    def __init__(self, input_dim=784, num_classes=10, learning_rate=0.1, reg_lambda=0.01):
        self.input_dim = input_dim
        self.num_classes = num_classes
        self.learning_rate = learning_rate
        self.reg_lambda = reg_lambda
        
        # Initialize weights and bias
        self.W = np.random.randn(input_dim, num_classes) * 0.01
        self.b = np.zeros((1, num_classes))
        
    def softmax(self, z):
        """
        Compute softmax activation
        Input: z (m, K) - linear combinations
        Output: probabilities (m, K)
        """
        # Numerical stability: subtract max
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)
    
    def cross_entropy_loss(self, y_true, y_pred):
        """
        Compute cross-entropy loss
        """
        m = y_true.shape[0]
        # Clip predictions to avoid log(0)
        y_pred = np.clip(y_pred, 1e-10, 1 - 1e-10)
        loss = -np.sum(y_true * np.log(y_pred)) / m
        
        # Add L2 regularization
        reg_loss = (self.reg_lambda / 2) * np.sum(self.W ** 2)
        return loss + reg_loss
    
    def one_hot_encode(self, y):
        """Convert labels to one-hot encoding"""
        m = y.shape[0]
        one_hot = np.zeros((m, self.num_classes))
        one_hot[np.arange(m), y] = 1
        return one_hot
    
    def predict(self, X):
        """Make predictions"""
        z = np.dot(X, self.W) + self.b
        probabilities = self.softmax(z)
        return probabilities
    
    def train(self, X_train, y_train, X_val, y_val, epochs=100, batch_size=128):
        """
        Train the model using mini-batch gradient descent
        """
        m = X_train.shape[0]
        y_train_encoded = self.one_hot_encode(y_train)
        
        history = {'train_loss': [], 'val_loss': [], 'val_accuracy': []}
        
        for epoch in range(epochs):
            # Shuffle training data
            indices = np.random.permutation(m)
            X_train_shuffled = X_train[indices]
            y_train_shuffled = y_train_encoded[indices]
            
            # Mini-batch gradient descent
            for i in range(0, m, batch_size):
                X_batch = X_train_shuffled[i:i+batch_size]
                y_batch = y_train_shuffled[i:i+batch_size]
                
                # Forward pass
                z = np.dot(X_batch, self.W) + self.b
                y_pred = self.softmax(z)
                
                # Backward pass
                m_batch = X_batch.shape[0]
                dz = (y_pred - y_batch) / m_batch
                dW = np.dot(X_batch.T, dz) + (self.reg_lambda * self.W)
                db = np.sum(dz, axis=0, keepdims=True)
                
                # Update weights
                self.W -= self.learning_rate * dW
                self.b -= self.learning_rate * db
            
            # Compute losses
            train_pred = self.predict(X_train)
            train_loss = self.cross_entropy_loss(y_train_encoded, train_pred)
            
            val_pred = self.predict(X_val)
            y_val_encoded = self.one_hot_encode(y_val)
            val_loss = self.cross_entropy_loss(y_val_encoded, val_pred)
            val_accuracy = np.mean(np.argmax(val_pred, axis=1) == y_val)
            
            history['train_loss'].append(train_loss)
            history['val_loss'].append(val_loss)
            history['val_accuracy'].append(val_accuracy)
            
            if (epoch + 1) % 10 == 0:
                print(f"Epoch {epoch+1}/{epochs} - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}, Val Acc: {val_accuracy:.4f}")
        
        return history

def extract_features_normalized(images):
    """Feature 1: Normalized pixel intensity"""
    return images.reshape(-1, 784) / 255.0

def extract_features_edges(images):
    """Feature 2: Edge-based features using simple edge detection"""
    m = images.shape[0]
    features = np.zeros((m, 784))
    
    for i in range(m):
        img = images[i].astype(np.float32) / 255.0
        # Simple Sobel-like edge detection
        dx = np.abs(img[:, 1:] - img[:, :-1])
        dy = np.abs(img[1:, :] - img[:-1, :])
        
        # Pad to original size
        dx_padded = np.pad(dx, ((0, 0), (0, 1)), mode='constant')
        dy_padded = np.pad(dy, ((0, 1), (0, 0)), mode='constant')
        
        edges = np.sqrt(dx_padded**2 + dy_padded**2)
        features[i] = edges.flatten()
    
    return features

def extract_features_blocks(images):
    """Feature 3: Block averaging (7x7 blocks from 28x28 image)"""
    m = images.shape[0]
    block_size = 4
    n_blocks = 28 // block_size  # 7 blocks per dimension
    features = np.zeros((m, n_blocks * n_blocks))
    
    for i in range(m):
        img = images[i].astype(np.float32) / 255.0
        for r in range(n_blocks):
            for c in range(n_blocks):
                block = img[r*block_size:(r+1)*block_size, c*block_size:(c+1)*block_size]
                features[i, r * n_blocks + c] = np.mean(block)
    
    return features

# Main training script
if __name__ == "__main__":
    print("=== Softmax Regression Training ===\n")
    
    # Download and load data
    data_dir = download_mnist()
    
    print("\nLoading MNIST dataset...")
    X_train = load_mnist_images(os.path.join(data_dir, 'train-images-idx3-ubyte.gz'))
    y_train = load_mnist_labels(os.path.join(data_dir, 'train-labels-idx1-ubyte.gz'))
    X_test = load_mnist_images(os.path.join(data_dir, 't10k-images-idx3-ubyte.gz'))
    y_test = load_mnist_labels(os.path.join(data_dir, 't10k-labels-idx1-ubyte.gz'))
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples\n")
    
    # Use subset for faster training (demo purposes)
    X_train = X_train[:10000]
    y_train = y_train[:10000]
    X_test = X_test[:2000]
    y_test = y_test[:2000]
    
    # Feature 1: Normalized pixels
    print("Training with Feature 1: Normalized Pixel Intensity")
    X_train_feat1 = extract_features_normalized(X_train)
    X_test_feat1 = extract_features_normalized(X_test)
    
    model1 = SoftmaxRegression(input_dim=784, learning_rate=0.5)
    history1 = model1.train(X_train_feat1, y_train, X_test_feat1, y_test, epochs=50)
    
    # Save model
    with open('model_normalized.pkl', 'wb') as f:
        pickle.dump(model1, f)
    
    print("\n" + "="*50)
    print(f"Final Test Accuracy (Feature 1): {history1['val_accuracy'][-1]:.4f}")
    print("="*50)
    
    print("\nModel trained and saved as 'model_normalized.pkl'")
