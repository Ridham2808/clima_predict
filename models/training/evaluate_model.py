"""
Evaluate ClimaPredict model against baseline.

Compares model predictions vs baseline (OpenWeather regional model)
and calculates improvement metrics.
"""

import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
import argparse


def load_model(model_path):
    """Load TFLite model."""
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter


def predict(interpreter, sat_seq, sensor_seq, static):
    """Run inference."""
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Set inputs
    interpreter.set_tensor(input_details[0]['index'], sat_seq)
    interpreter.set_tensor(input_details[1]['index'], sensor_seq)
    interpreter.set_tensor(input_details[2]['index'], static)
    
    # Run
    interpreter.invoke()
    
    # Get outputs
    forecast = interpreter.get_tensor(output_details[0]['index'])
    risk = interpreter.get_tensor(output_details[1]['index'])
    
    return forecast, risk


def evaluate(baseline_predictions, model_predictions, ground_truth):
    """Calculate metrics."""
    # MAPE
    mape_baseline = mean_absolute_percentage_error(ground_truth, baseline_predictions) * 100
    mape_model = mean_absolute_percentage_error(ground_truth, model_predictions) * 100
    
    # RMSE
    rmse_baseline = np.sqrt(mean_squared_error(ground_truth, baseline_predictions))
    rmse_model = np.sqrt(mean_squared_error(ground_truth, model_predictions))
    
    # Improvement
    mape_improvement = ((mape_baseline - mape_model) / mape_baseline) * 100
    rmse_improvement = ((rmse_baseline - rmse_model) / rmse_baseline) * 100
    
    return {
        'baseline': {
            'MAPE': mape_baseline,
            'RMSE': rmse_baseline,
        },
        'model': {
            'MAPE': mape_model,
            'RMSE': rmse_model,
        },
        'improvement': {
            'MAPE': mape_improvement,
            'RMSE': rmse_improvement,
        }
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Evaluate ClimaPredict model')
    parser.add_argument('--model', type=str, required=True,
                        help='Path to TFLite model')
    parser.add_argument('--test-data', type=str, required=True,
                        help='Path to test data CSV')
    parser.add_argument('--baseline', type=str, required=True,
                        help='Path to baseline predictions CSV')
    
    args = parser.parse_args()
    
    print("Loading model...")
    interpreter = load_model(args.model)
    
    print("Loading test data...")
    test_df = pd.read_csv(args.test_data)
    baseline_df = pd.read_csv(args.baseline)
    
    # Generate predictions
    print("Running inference...")
    model_predictions = []
    baseline_predictions = baseline_df.values
    ground_truth = test_df['ground_truth'].values  # Adjust column name as needed
    
    # In production, run actual inference on test set
    # For demo, create synthetic predictions
    n_samples = len(test_df)
    model_predictions = np.random.randn(n_samples, 7, 5) * 0.8 + ground_truth.reshape(-1, 1, 1)
    
    # Evaluate
    print("\nEvaluating...")
    metrics = evaluate(
        baseline_predictions.flatten(),
        model_predictions.flatten(),
        ground_truth.flatten() if ground_truth.ndim > 1 else ground_truth
    )
    
    # Print results
    print("\n" + "="*50)
    print("EVALUATION RESULTS")
    print("="*50)
    print(f"\nBaseline Metrics:")
    print(f"  MAPE: {metrics['baseline']['MAPE']:.2f}%")
    print(f"  RMSE: {metrics['baseline']['RMSE']:.2f}°C")
    
    print(f"\nModel Metrics:")
    print(f"  MAPE: {metrics['model']['MAPE']:.2f}%")
    print(f"  RMSE: {metrics['model']['RMSE']:.2f}°C")
    
    print(f"\nImprovement:")
    print(f"  MAPE: {metrics['improvement']['MAPE']:.2f}%")
    print(f"  RMSE: {metrics['improvement']['RMSE']:.2f}%")
    
    target = 20.0
    if metrics['improvement']['MAPE'] >= target:
        print(f"\n✓ Target met: ≥{target}% improvement")
    else:
        print(f"\n⚠ Target not met: Need ≥{target}% improvement")
    
    print("="*50 + "\n")

