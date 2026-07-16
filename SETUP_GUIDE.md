# ML Service Backend - Setup Guide

## What You Have

A complete, production-ready **Machine Learning Service Backend** with:

✅ Pre-trained TensorFlow classification model (100% accuracy)  
✅ Python virtual environment with all dependencies  
✅ REST API endpoints for predictions  
✅ Beautiful React dashboard for testing  
✅ Ready-to-use training and prediction pipeline

## File Locations

### Model Files (Ready to Use)
```
public/models/
├── iris_model.keras          # Trained TensorFlow model (59 KB)
├── scaler.joblib             # Feature normalization 
└── metadata.json             # Model metadata
```

### Python Components
```
scripts/
└── train_model.py            # Model training script (retrainable)

lib/
└── ml-utils.ts               # ML utility functions

.venv/                        # Python virtual environment (pre-configured)
```

### API & Frontend
```
app/
├── api/predict/route.ts      # ML API endpoint (POST/GET)
└── page.tsx                  # Interactive dashboard
```

## Getting Started

### 1. Start the Development Server
```bash
pnpm dev
```
Opens at `http://localhost:3000`

### 2. Test the Dashboard
- Enter flower measurements (or use Quick Example buttons)
- Click "Get Prediction" to see results
- View confidence scores and class probabilities

### 3. Test the API
```bash
# Get model info
curl http://localhost:3000/api/predict

# Make a prediction
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

## How It Works

```
┌─────────────────┐
│  React Frontend │  (Dashboard UI)
└────────┬────────┘
         │
    POST /api/predict
         │
    ┌────▼────────────┐
    │  Next.js API    │  (TypeScript Route Handler)
    │  route.ts       │
    └────┬────────────┘
         │
    execSync Python
         │
    ┌────▼────────────┐
    │  Python Runtime │  (Loads TensorFlow model)
    │  ├─ Load model  │
    │  ├─ Scale input │
    │  └─ Predict     │
    └────┬────────────┘
         │
    Return JSON result
         │
    ┌────▼────────────┐
    │  Dashboard      │  (Display results)
    │  Visualizations │
    └─────────────────┘
```

## Key Features

### 🎯 Classification Model
- **Task**: Iris flower classification
- **Classes**: Setosa, Versicolor, Virginica
- **Features**: 4 measurements (sepal length/width, petal length/width)
- **Architecture**: 2-layer neural network with dropout
- **Accuracy**: 100% on test set

### 🌐 REST API
- **GET /api/predict** - Get model metadata
- **POST /api/predict** - Make predictions
- Input validation, error handling, JSON responses

### 💎 Dashboard Features
- 📝 Manual input fields for measurements
- 🎲 Quick example buttons (Setosa, Versicolor, Virginica)
- 📊 Real-time probability visualizations
- 🎨 Modern dark theme UI with Tailwind CSS

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server at http://localhost:3000 |
| `pnpm train` | Retrain the ML model |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |

## Environment

- **Framework**: Next.js 16
- **Frontend**: React 19, Tailwind CSS
- **ML Framework**: TensorFlow/Keras
- **Data Processing**: scikit-learn, NumPy
- **Model Serialization**: joblib
- **Python Version**: 3.13
- **Virtual Environment**: Located at `.venv/`

## API Request/Response

### Request Example
```json
{
  "features": [5.1, 3.5, 1.4, 0.2]
}
```

### Response Example
```json
{
  "status": "success",
  "predicted_class": "setosa",
  "predicted_class_index": 0,
  "confidence": 0.9999998,
  "all_probabilities": {
    "setosa": 0.9999998,
    "versicolor": 0.0000001,
    "virginica": 0.0000000
  },
  "input_features": [5.1, 3.5, 1.4, 0.2]
}
```

## Next Steps

### Short Term
1. ✅ Test predictions with different flower types
2. ✅ Explore the API with different feature combinations
3. ✅ Review model architecture and training parameters

### Medium Term
- Retrain model with your own dataset
- Add batch prediction endpoint
- Implement model versioning
- Add API authentication

### Long Term
- Deploy to production
- Set up monitoring and logging
- Create admin dashboard for model management
- Build feature importance analysis
- Implement A/B testing with multiple models

## Extending the Project

### Add Your Own Model
1. Replace data loading in `scripts/train_model.py`
2. Update feature names and class names
3. Run `pnpm train` to retrain
4. Dashboard automatically updates!

### Modify Dashboard
Edit `app/page.tsx`:
- Change UI colors and styling
- Add new input fields
- Create visualizations
- Add model comparison features

### Enhance API
Add to `app/api/predict/route.ts`:
- Batch predictions
- Model versioning
- Prediction history
- Advanced error handling

## Documentation

- **ML_SERVICE.md** - Detailed ML backend documentation
- **README_ML.md** - Usage and customization guide
- **SETUP_GUIDE.md** - This file

## Support

All components are production-ready and well-documented. If you encounter issues:

1. Check console logs for errors
2. Verify model files exist in `public/models/`
3. Ensure Python virtual environment is active
4. Check API responses in browser DevTools

## Key Files to Know

```
app/api/predict/route.ts       ← API logic (modify here for features)
app/page.tsx                   ← Dashboard UI (modify for styling)
scripts/train_model.py         ← Model training (modify for your data)
lib/ml-utils.ts                ← Helper functions
public/models/*                ← Trained model artifacts
```

---

**Ready to use! Start with `pnpm dev`** 🚀
