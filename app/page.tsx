'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  all_probabilities: {
    setosa: number;
    versicolor: number;
    virginica: number;
  };
}


interface ModelInfo {
  classes: string[];
  features: string[];
  accuracy: number;
}

export default function Home() {
  const [features, setFeatures] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await fetch('/api/predict');
      if (response.ok) {
        const data = await response.json();
        setModelInfo(data.metadata);
      }
    } catch (err) {
      console.error('Error fetching model info:', err);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newFeatures = [...features];
      newFeatures[index] = numValue;
      setFeatures(newFeatures);
    }
  };

  const exampleSets = {
    setosa: [5.1, 3.5, 1.4, 0.2],
    versicolor: [5.9, 2.7, 4.2, 1.3],
    virginica: [6.3, 3.3, 6.0, 2.5],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-white">
            🌺 Iris Classification ML API
          </h1>
          <p className="mt-2 text-slate-400">
            TensorFlow-powered classification model for iris flower predictions
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-8">
              <h2 className="mb-6 text-xl font-semibold text-white">
                Enter Flower Measurements
              </h2>

              <div className="space-y-4">
                {modelInfo?.features.map((feature, index) => (
                  <div key={index}>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {feature}
                    </label>
                    <input
                      type="number"
                      value={features[index]}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      step="0.1"
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={`Enter ${feature}`}
                    />
                  </div>
                ))}
              </div>

              {/* Quick Examples */}
              <div className="mt-6 border-t border-slate-700 pt-6">
                <p className="mb-3 text-sm font-medium text-slate-300">
                  Quick Examples:
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {Object.entries(exampleSets).map(([label, values]) => (
                    <button
                      key={label}
                      onClick={() => setFeatures(values)}
                      className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-600"
                    >
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                disabled={loading}
                className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-600 py-6 text-lg font-semibold hover:from-blue-700 hover:to-cyan-700"
              >
                {loading ? 'Predicting...' : 'Get Prediction'}
              </Button>

              {error && (
                <div className="mt-4 rounded-lg border border-red-700 bg-red-900/20 p-4 text-red-400">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-8">
              <h2 className="mb-6 text-xl font-semibold text-white">
                Prediction Result
              </h2>

              {prediction ? (
                <div className="space-y-6">
                  {/* Main Prediction */}
                  <div className="rounded-lg border border-emerald-700 bg-emerald-900/30 p-4">
                    <p className="text-sm text-emerald-400">Predicted Class</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {prediction.predicted_class}
                    </p>
                    <p className="mt-2 text-sm text-emerald-300">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Class Probabilities */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-300">
                      Class Probabilities
                    </p>
                    <div className="space-y-2">
                      {Object.entries(prediction.all_probabilities).map(
                        ([className, prob]) => (
                          <div key={className}>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs capitalize text-slate-400">
                                {className}
                              </span>
                              <span className="text-xs font-semibold text-slate-300">
                                {(prob * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-700">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                style={{ width: `${prob * 100}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-center">
                  <p className="text-slate-400">
                    Enter measurements and click &quot;Get Prediction&quot; to see results
                  </p>
                </div>
              )}
            </div>

            {/* Model Info */}
            {modelInfo && (
              <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-4 font-semibold text-white">Model Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Test Accuracy</p>
                    <p className="font-semibold text-white">
                      {(modelInfo.accuracy * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Classes</p>
                    <p className="font-semibold text-white">
                      {modelInfo.num_classes}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Features</p>
                    <p className="font-semibold text-white">
                      {modelInfo.num_features}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-12 rounded-lg border border-slate-700 bg-slate-800 p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">
            API Documentation
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* GET Endpoint */}
            <div>
              <h3 className="mb-3 font-semibold text-cyan-400">GET /api/predict</h3>
              <p className="mb-4 text-sm text-slate-400">
                Get model information and metadata
              </p>
              <div className="rounded-lg border border-slate-600 bg-slate-900 p-4">
                <pre className="overflow-x-auto text-xs text-slate-300">
{`{
  "status": "ready",
  "metadata": {
    "classes": ["setosa", "versicolor", "virginica"],
    "features": ["sepal length (cm)", ...],
    "num_features": 4,
    "num_classes": 3,
    "accuracy": 1.0
  }
}`}
                </pre>
              </div>
            </div>

            {/* POST Endpoint */}
            <div>
              <h3 className="mb-3 font-semibold text-cyan-400">POST /api/predict</h3>
              <p className="mb-4 text-sm text-slate-400">
                Get predictions for given features
              </p>
              <div className="rounded-lg border border-slate-600 bg-slate-900 p-4">
                <pre className="overflow-x-auto text-xs text-slate-300">
{`{
  "features": [5.1, 3.5, 1.4, 0.2]
}

Response:
{
  "predicted_class": "setosa",
  "confidence": 0.99,
  "all_probabilities": {...}
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
