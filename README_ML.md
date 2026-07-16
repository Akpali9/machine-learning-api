# Machine Learning Service Backend

A production-ready **ML Classification API** built with Next.js and Python (TensorFlow/Keras). This project demonstrates how to integrate machine learning models into a Next.js application with a beautiful web dashboard.

## ✨ Features

- 🚀 **TensorFlow/Keras Model** - State-of-the-art neural network for iris flower classification
- 🎯 **REST API** - Simple POST/GET endpoints for making predictions
- 🎨 **Interactive Dashboard** - Beautiful web UI for testing predictions in real-time
- 📊 **Real-time Visualizations** - Confidence scores and class probability distributions
- ✅ **100% Accuracy** - Pre-trained model with perfect test accuracy on iris dataset
- 🔧 **Easy to Extend** - Modify training script to use your own datasets and models

## 🚀 Quick Start

### 1. Install Dependencies

All Python dependencies are pre-installed in the `.venv/` virtual environment:
- TensorFlow 2.x
- scikit-learn
- numpy
- joblib

### 2. Train the Model (Optional)

The model is already trained and saved. To retrain:

```bash
pnpm train
```

### 3. Start the Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000** to see the interactive dashboard.

## 📖 Usage

### Web Dashboard

The dashboard provides an interactive interface to:
- ✏️ Enter flower measurements (sepal/petal dimensions)
- 🎲 Use quick example buttons to test different flower types
- 📈 View prediction results with confidence scores
- 📊 See class probability distributions

### API Endpoints

#### Get Model Info
```bash
curl http://localhost:3000/api/predict
```

**Response:**
```json
{
  "status": "ready",
  "metadata": {
    "classes": ["setosa", "versicolor", "virginica"],
    "features": ["sepal length (cm)", "sepal width (cm)", "petal length (cm)", "petal width (cm)"],
    "num_features": 4,
    "num_classes": 3,
    "accuracy": 1.0
  }
}
```

#### Make a Prediction
```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

**Response:**
```json
{
  "status": "success",
  "predicted_class": "setosa",
  "confidence": 0.9999,
  "all_probabilities": {
    "setosa": 0.9999,
    "versicolor": 0.0001,
    "virginica": 0.0000
  }
}
```

## 📚 Project Structure

```
project/
├── app/
│   ├── api/predict/route.ts        # ML API endpoint
│   ├── page.tsx                    # Dashboard UI
│   └── layout.tsx                  # Layout
├── scripts/
│   └── train_model.py              # Model training script
├── lib/
│   └── ml-utils.ts                 # ML utility functions
├── public/models/
│   ├── iris_model.keras            # Trained TensorFlow model
│   ├── scaler.joblib               # Feature normalization scaler
│   └── metadata.json               # Model metadata
├── ML_SERVICE.md                   # Detailed documentation
└── package.json
```

## 🧠 Model Architecture

```
Input (4 features)
    ↓
Dense Layer (64 neurons, ReLU activation)
    ↓
Dropout (20%)
    ↓
Dense Layer (32 neurons, ReLU activation)
    ↓
Dropout (20%)
    ↓
Output Layer (3 neurons, Softmax)
    ↓
Classification (setosa, versicolor, virginica)
```

### Training Details
- **Dataset**: Iris Flower Dataset (150 samples)
- **Train/Test Split**: 80/20
- **Optimizer**: Adam
- **Loss Function**: Sparse Categorical Crossentropy
- **Epochs**: 100
- **Batch Size**: 8
- **Test Accuracy**: 100%

## 🔄 How It Works

1. **Frontend** (React) sends flower measurements to the API
2. **API Route** (Next.js) executes Python code via `execSync`
3. **Python Runtime** loads the TensorFlow model and scaler
4. **Model** normalizes features and makes predictions
5. **API** returns results with confidence scores
6. **Dashboard** displays predictions with visualizations

## ✋ Example Predictions

### Setosa Flower
```json
{"features": [5.1, 3.5, 1.4, 0.2]} → "setosa" (100.0%)
```

### Versicolor Flower
```json
{"features": [5.9, 2.7, 4.2, 1.3]} → "versicolor" (99.6%)
```

### Virginica Flower
```json
{"features": [6.3, 3.3, 6.0, 2.5]} → "virginica" (100.0%)
```

## 🛠️ Customization

### Train on Your Own Dataset

Edit `scripts/train_model.py`:

```python
# Replace load_iris() with your data loading:
from sklearn.datasets import load_your_dataset
X, y = load_your_dataset()
```

Then retrain:
```bash
pnpm train
```

### Change Model Architecture

Modify the neural network in `scripts/train_model.py`:

```python
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(input_dim,)),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(num_classes, activation='softmax')
])
```

### Add More Features to Dashboard

Edit `app/page.tsx` to add:
- Upload CSV files for batch predictions
- Download prediction results
- Model performance metrics
- Feature importance analysis

## 📦 Deployment

### Production Considerations

For production use, consider:

1. **Model Caching** - Keep model in memory across requests
2. **Batch Predictions** - Support multiple samples per request
3. **Separate Python Service** - Use dedicated Python backend for scalability
4. **Model Versioning** - Support multiple model versions
5. **API Authentication** - Secure endpoints with API keys
6. **Rate Limiting** - Prevent abuse
7. **Monitoring** - Track predictions for analysis

### Deploy to Vercel

```bash
git push origin main
```

Your app will deploy automatically to Vercel.

## 🐛 Troubleshooting

### Model Not Found
```bash
ls public/models/
# Should show: iris_model.keras, scaler.joblib, metadata.json
```

If missing, retrain the model:
```bash
pnpm train
```

### API Returns Error
Check that the virtual environment is active:
```bash
source .venv/bin/activate
python --version
```

### Slow Predictions
TensorFlow has startup overhead. The first prediction may take 1-2 seconds. For production, cache the model.

## 📚 References

- [TensorFlow Documentation](https://www.tensorflow.org/api_docs)
- [scikit-learn Documentation](https://scikit-learn.org/)
- [Iris Dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Next.js, TensorFlow, and Python**
