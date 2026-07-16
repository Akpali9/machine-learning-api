# ML Service Backend Documentation

## Overview

This project includes a **Machine Learning Service Backend** that uses TensorFlow/Keras to classify iris flowers. The API is built into Next.js using Python in API routes.

### Key Features

- ✅ **Classification Model**: TensorFlow neural network trained on iris dataset
- ✅ **REST API**: Simple POST/GET endpoints for predictions
- ✅ **Web Dashboard**: Interactive UI for testing predictions
- ✅ **Model Persistence**: Trained model saved with feature scaler and metadata
- ✅ **Error Handling**: Comprehensive validation and error messages

## Architecture

```
┌─────────────────────┐
│  Next.js Frontend   │ (React component with form)
└──────────┬──────────┘
           │
           ├─ POST /api/predict ──┐
           │                       │
           └─ GET /api/predict     ├─ Next.js API Route (TypeScript)
                                   │ (execSync to Python)
                                   │
                                   └─ Python Runtime
                                      ├─ Load TensorFlow model
                                      ├─ Load feature scaler
                                      └─ Return predictions
```

## Setup

### 1. Virtual Environment
The project includes a Python virtual environment at `.venv/` with all dependencies installed:
- TensorFlow 2.x
- scikit-learn
- joblib
- numpy

### 2. Model Training

Train or retrain the ML model:
```bash
pnpm train
```

Or manually:
```bash
source .venv/bin/activate
python scripts/train_model.py
```

This will:
- Load the iris dataset (150 samples, 4 features)
- Split into training (120) and test (30) sets
- Train a 2-layer neural network with dropout
- Save files to `public/models/`:
  - `iris_model.keras` - Trained TensorFlow model
  - `scaler.joblib` - Feature normalization scaler
  - `metadata.json` - Model metadata

### 3. Run the Application

```bash
pnpm dev
```

Visit `http://localhost:3000` to use the interactive dashboard.

## API Endpoints

### GET /api/predict

Get model information and metadata.

**Response:**
```json
{
  "status": "ready",
  "metadata": {
    "classes": ["setosa", "versicolor", "virginica"],
    "features": [
      "sepal length (cm)",
      "sepal width (cm)",
      "petal length (cm)",
      "petal width (cm)"
    ],
    "num_features": 4,
    "num_classes": 3,
    "accuracy": 1.0
  },
  "endpoint": "/api/predict",
  "method": "POST"
}
```

### POST /api/predict

Get classification predictions for flower measurements.

**Request:**
```json
{
  "features": [5.1, 3.5, 1.4, 0.2]
}
```

**Response:**
```json
{
  "status": "success",
  "predicted_class": "setosa",
  "predicted_class_index": 0,
  "confidence": 0.9987,
  "all_probabilities": {
    "setosa": 0.9987,
    "versicolor": 0.0013,
    "virginica": 0.0000
  },
  "input_features": [5.1, 3.5, 1.4, 0.2]
}
```

**Error Response:**
```json
{
  "error": "Invalid number of features. Expected 4, got 3"
}
```

## Model Details

### Architecture
```
Input Layer (4 features)
    ↓
Dense Layer (64 neurons, ReLU)
    ↓
Dropout (20%)
    ↓
Dense Layer (32 neurons, ReLU)
    ↓
Dropout (20%)
    ↓
Output Layer (3 neurons, Softmax)
    ↓
Classification (setosa, versicolor, virginica)
```

### Training Parameters
- **Optimizer**: Adam
- **Loss Function**: Sparse Categorical Crossentropy
- **Epochs**: 100
- **Batch Size**: 8
- **Test Accuracy**: 100% (on iris dataset)

### Features Expected
1. Sepal Length (cm) - typically 4.3-7.9 cm
2. Sepal Width (cm) - typically 2.0-4.4 cm
3. Petal Length (cm) - typically 1.0-6.9 cm
4. Petal Width (cm) - typically 0.1-2.5 cm

## File Structure

```
project/
├── app/
│   ├── api/
│   │   └── predict/
│   │       └── route.ts          # ML API endpoint
│   ├── page.tsx                  # Frontend dashboard
│   └── layout.tsx
├── lib/
│   └── ml-utils.ts               # ML utility functions
├── scripts/
│   └── train_model.py            # Model training script
├── public/
│   └── models/
│       ├── iris_model.keras      # Trained model
│       ├── scaler.joblib         # Feature scaler
│       └── metadata.json         # Model metadata
├── package.json
└── ML_SERVICE.md                 # This file
```

## Usage Examples

### Using cURL

```bash
# Get model info
curl http://localhost:3000/api/predict

# Make prediction
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

### Using JavaScript/Fetch

```javascript
// Make prediction
const response = await fetch('/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ features: [5.1, 3.5, 1.4, 0.2] })
});

const result = await response.json();
console.log(`Predicted: ${result.predicted_class}`);
console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
```

### Example Predictions

**Setosa:**
```json
{"features": [5.1, 3.5, 1.4, 0.2]} → "setosa" (99.9%)
```

**Versicolor:**
```json
{"features": [5.9, 2.7, 4.2, 1.3]} → "versicolor" (98.5%)
```

**Virginica:**
```json
{"features": [6.3, 3.3, 6.0, 2.5]} → "virginica" (99.8%)
```

## Extending the Model

### Using Your Own Dataset

1. Replace the data loading in `scripts/train_model.py`:
```python
# Instead of load_iris():
X, y = load_your_data()  # Your custom data
```

2. Update metadata in the training script with your classes and features

3. Retrain:
```bash
pnpm train
```

### Using Different Models

Replace the model architecture in `scripts/train_model.py`:

**For Regression:**
```python
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(1)  # Single output
])
model.compile(optimizer='adam', loss='mse', metrics=['mae'])
```

**For More Classes:**
Update the output layer neurons to match your number of classes.

## Performance Considerations

### Local Development
- Python is executed via `execSync` in each request
- Model is loaded from disk each time
- Suitable for development and testing

### Production Optimization
For production, consider:
1. **Model Caching**: Cache loaded model in memory between requests
2. **Batch Processing**: Support batch predictions
3. **Async Execution**: Use Python subprocess pools
4. **Model Quantization**: Reduce model size with TensorFlow Lite
5. **Separate Python Service**: Use `python-services` for dedicated ML backend

## Troubleshooting

### Model Not Found
Ensure model files exist in `public/models/`:
```bash
ls public/models/
# Should show: iris_model.keras, scaler.joblib, metadata.json
```

If missing, retrain:
```bash
pnpm train
```

### Python Errors
Check that virtual environment is set up:
```bash
source .venv/bin/activate
python --version
```

### API Returns 500 Error
Check server logs for Python execution errors. Ensure all features are valid numbers.

### Slow Predictions
TensorFlow has startup overhead. For production use cases, consider:
- Keeping model in memory
- Using a dedicated Python service
- Quantizing the model

## Next Steps

### Recommended Enhancements

1. **Batch Predictions** - Accept multiple samples per request
2. **Model Versioning** - Support multiple model versions
3. **Feature Normalization UI** - Show acceptable ranges
4. **Visualization** - Plot feature importance
5. **Monitoring** - Log predictions for analysis
6. **Model Update** - Hot-reload new models without restart
7. **Authentication** - Secure API endpoints
8. **Rate Limiting** - Prevent abuse

### Alternative Deployment Options

**Using Python Services (Recommended for production):**
```javascript
// In next.config.mjs
export default {
  experimentalServices: {
    python: {
      script: 'api/ml_service.py',
      port: 3001
    }
  }
};
```


**Using Standalone Flask API:**
- Deploy Python service separately
- Next.js calls external ML service
- Better scalability and isolation

## References

- [TensorFlow/Keras Documentation](https://www.tensorflow.org/api_docs)
- [scikit-learn Documentation](https://scikit-learn.org/stable/)
- [Iris Dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
