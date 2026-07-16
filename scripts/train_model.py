#!/usr/bin/env python3
"""
ML Model Training Script
Trains a TensorFlow classification model on the Iris dataset and saves it with a scaler
"""

import os
import sys
import numpy as np
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
import joblib

# Create models directory
os.makedirs('public/models', exist_ok=True)

print("[ML Training] Loading Iris dataset...")
iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.target_names
input_features = iris.feature_names

print(f"[ML Training] Dataset loaded: {X.shape[0]} samples, {X.shape[1]} features")
print(f"[ML Training] Classes: {feature_names}")
print(f"[ML Training] Features: {input_features}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"[ML Training] Training set: {X_train_scaled.shape}")
print(f"[ML Training] Test set: {X_test_scaled.shape}")

# Build model
print("[ML Training] Building Keras model...")
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(4,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(3, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print("[ML Training] Model summary:")
model.summary()

# Train model
print("[ML Training] Training model...")
history = model.fit(
    X_train_scaled, y_train,
    epochs=100,
    batch_size=8,
    validation_data=(X_test_scaled, y_test),
    verbose=0
)

# Evaluate
test_loss, test_accuracy = model.evaluate(X_test_scaled, y_test, verbose=0)
print(f"[ML Training] Test accuracy: {test_accuracy:.4f}")

# Save model and scaler
model_path = 'public/models/iris_model.keras'
scaler_path = 'public/models/scaler.joblib'

print(f"[ML Training] Saving model to {model_path}...")
model.save(model_path)

print(f"[ML Training] Saving scaler to {scaler_path}...")
joblib.dump(scaler, scaler_path)

# Save metadata
metadata = {
    'classes': list(feature_names),
    'features': list(input_features),
    'num_features': len(input_features),
    'num_classes': len(feature_names),
    'accuracy': float(test_accuracy),
}

metadata_path = 'public/models/metadata.json'
import json
with open(metadata_path, 'w') as f:
    json.dump(metadata, f, indent=2)
print(f"[ML Training] Saving metadata to {metadata_path}...")

print("[ML Training] Training complete! ✓")
print(f"[ML Training] Model files saved to public/models/")
