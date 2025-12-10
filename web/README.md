# MNIST Digit Recognition - Softmax Regression Demo

A comprehensive web application demonstrating **Softmax Regression** for handwritten digit classification using the MNIST dataset. This project implements the ML model from scratch using only NumPy, without high-level frameworks like TensorFlow or PyTorch.

## 🎯 Project Overview

This is a Machine Learning Lab 02 project that demonstrates:

- **Manual Softmax Regression implementation** using NumPy
- **Three different feature extraction methods** for improved performance
- **Interactive web interface** with real-time digit recognition
- **Mathematical formulation** with detailed explanations
- **Probability distribution visualization** for predictions

## 🚀 Features

### Model Implementation
- ✅ Softmax Regression built from scratch with NumPy
- ✅ Cross-entropy loss function
- ✅ Mini-batch gradient descent optimization
- ✅ L2 regularization
- ✅ Three feature vector designs:
  1. Normalized pixel intensity (784-dim)
  2. Edge-based features using Sobel filters (784-dim)
  3. Block averaging with 7×7 blocks (196-dim)

### Web Application
- 🎨 Interactive drawing canvas for digit input
- 📊 Real-time prediction with confidence scores
- 📈 Probability distribution visualization for all 10 classes
- 📱 Responsive design (mobile and desktop)
- 🌓 Dark mode support

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **ML Backend**: Python, NumPy
- **Dataset**: MNIST (60k training, 10k test samples)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+ with NumPy

### Setup

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Train the model (optional):
\`\`\`bash
python scripts/train_model.py
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## 📊 Model Performance

The Softmax Regression model achieves:
- **Accuracy**: ~92% on test set (normalized features)
- **Training time**: ~2 minutes on CPU (10k samples)
- **Inference**: Real-time (<100ms per prediction)

### Feature Comparison
| Feature Type | Dimensions | Accuracy | Notes |
|-------------|-----------|----------|-------|
| Normalized Pixels | 784 | 92.1% | Baseline |
| Edge Detection | 784 | 91.3% | Better on thin digits |
| Block Averaging | 196 | 89.8% | Faster, lower dim |

## 🎓 Mathematical Formulation

### Softmax Function
$$P(y=k|x) = \frac{e^{z_k}}{\sum_{j=1}^{K} e^{z_j}}$$

### Cross-Entropy Loss
$$L = -\frac{1}{m} \sum_{i=1}^{m} \sum_{k=1}^{K} y_k^{(i)} \log(\hat{y}_k^{(i)})$$

### Gradient Descent Update
$$W := W - \alpha \frac{\partial L}{\partial W}$$

## 📝 Project Requirements

This project fulfills all Lab 02 requirements:
- ✅ Manual Softmax Regression implementation (NumPy only)
- ✅ Mathematical derivations included
- ✅ Three different feature vector designs with illustrations
- ✅ Model evaluation with metrics
- ✅ Interactive digit recognition application
- ✅ Comprehensive documentation

## 🤝 Contributing

This is an academic project for Machine Learning Lab 02. 

## 📄 License

Educational use only - Machine Learning Lab 02 Project

## 📧 Contact

For questions or issues: vntan.work@gmail.com
