import { execSync } from 'child_process';
import path from 'path';

/**
 * Get the Python executable path from the virtual environment
 */
export function getPythonPath(): string {
  const venvPath = path.join(process.cwd(), '.venv');
  const pythonPath = path.join(venvPath, 'bin', 'python');
  return pythonPath;
}

/**
 * Execute Python code in the virtual environment
 */
export function executePython(code: string): string {
  const pythonPath = getPythonPath();

  try {
    const result = execSync(`${pythonPath} -c "${code.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      env: {
        ...process.env,
        TF_CPP_MIN_LOG_LEVEL: '3', // Suppress TensorFlow warnings
      },
    });

    return result;
  } catch (error: any) {
    throw new Error(`Python execution failed: ${error.message}`);
  }
}

/**
 * Validate model file exists
 */
export function validateModelFiles(): boolean {
  const modelPath = path.join(process.cwd(), 'public/models/iris_model.keras');
  const scalerPath = path.join(process.cwd(), 'public/models/scaler.joblib');
  const metadataPath = path.join(
    process.cwd(),
    'public/models/metadata.json'
  );

  try {
    const fs = require('fs');
    return (
      fs.existsSync(modelPath) &&
      fs.existsSync(scalerPath) &&
      fs.existsSync(metadataPath)
    );
  } catch {
    return false;
  }
}

/**
 * Format prediction results for response
 */
export interface PredictionResult {
  predicted_class: string;
  predicted_class_index: number;
  confidence: number;
  all_probabilities: Record<string, number>;
  input_features: number[];
}

/**
 * Validate input features
 */
export function validateFeatures(features: any): { valid: boolean; error?: string } {
  if (!Array.isArray(features)) {
    return { valid: false, error: 'Features must be an array' };
  }

  if (features.length !== 4) {
    return { valid: false, error: `Expected 4 features, got ${features.length}` };
  }

  if (!features.every((f) => typeof f === 'number' && !isNaN(f))) {
    return { valid: false, error: 'All features must be valid numbers' };
  }

  // Check reasonable ranges for iris data
  if (!features.every((f) => f >= 0 && f <= 100)) {
    return { valid: false, error: 'Features should be in a reasonable range (0-100 cm)' };
  }

  return { valid: true };
}
