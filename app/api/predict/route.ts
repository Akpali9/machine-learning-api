import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

let cachedModel: any = null;
let cachedScaler: any = null;
let modelMetadata: any = null;

async function loadModel() {
  if (cachedModel && cachedScaler && modelMetadata) {
    return { model: cachedModel, scaler: cachedScaler, metadata: modelMetadata };
  }
  

  const pythonScript = `
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
import joblib
import json
import sys

model_path = 'public/models/iris_model.keras'
scaler_path = 'public/models/scaler.joblib'
metadata_path = 'public/models/metadata.json'

try:
    model = tf.keras.models.load_model(model_path)
    scaler = joblib.load(scaler_path)
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    
    print(json.dumps({
        'status': 'success',
        'metadata': metadata
    }))
except Exception as e:
    print(json.dumps({
        'status': 'error',
        'error': str(e)
    }), file=sys.stderr)
    sys.exit(1)
`;

  try {
    const pythonPath = path.join(process.cwd(), '.venv', 'bin', 'python');
    const result = execSync(`${pythonPath} -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });

    const output = JSON.parse(result);
    if (output.status === 'success') {
      modelMetadata = output.metadata;
      return { model: true, scaler: true, metadata: modelMetadata };
    } else {
      throw new Error(output.error);
    }
  } catch (error) {
    console.error('Model loading error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { features } = body;

    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected array of features.' },
        { status: 400 }
      );
    }

    if (features.length !== 4) {
      return NextResponse.json(
        {
          error: `Invalid number of features. Expected 4, got ${features.length}`,
        },
        { status: 400 }
      );
    }

    // Validate features are numbers
    if (!features.every((f: any) => typeof f === 'number')) {
      return NextResponse.json(
        { error: 'All features must be numbers' },
        { status: 400 }
      );
    }

    const pythonScript = `
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
import joblib
import json
import numpy as np
import sys

try:
    model = tf.keras.models.load_model('public/models/iris_model.keras')
    scaler = joblib.load('public/models/scaler.joblib')
    
    features = np.array([${features.join(', ')}]).reshape(1, -1)
    features_scaled = scaler.transform(features)
    
    predictions = model.predict(features_scaled, verbose=0)
    predicted_class = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_class])
    
    class_names = ['setosa', 'versicolor', 'virginica']
    
    result = {
        'status': 'success',
        'predicted_class': class_names[predicted_class],
        'predicted_class_index': predicted_class,
        'confidence': confidence,
        'all_probabilities': {
            'setosa': float(predictions[0][0]),
            'versicolor': float(predictions[0][1]),
            'virginica': float(predictions[0][2])
        },
        'input_features': [${features.join(', ')}]
    }
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({
        'status': 'error',
        'error': str(e)
    }), file=sys.stderr)
    sys.exit(1)
`;

    const pythonPath = path.join(process.cwd(), '.venv', 'bin', 'python');
    const result = execSync(`${pythonPath} -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });

    const prediction = JSON.parse(result);

    if (prediction.status === 'success') {
      return NextResponse.json(prediction);
    } else {
      return NextResponse.json(
        { error: prediction.error || 'Prediction failed' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { metadata } = await loadModel();

    return NextResponse.json({
      status: 'ready',
      metadata,
      endpoint: '/api/predict',
      method: 'POST',
      example_request: {
        features: [5.1, 3.5, 1.4, 0.2],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Model not ready', details: error.message },
      { status: 503 }
    );
  }
}
