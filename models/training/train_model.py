"""
ClimaPredict Model Training Script

Trains a lightweight encoder-fusion-decoder architecture for hyper-local
climate forecasting. Exports to TensorFlow Lite with quantization.
"""

import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import argparse
import os

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


def create_model(input_shape_sat, input_shape_sensor, input_shape_static):
    """
    Create encoder-fusion-decoder model architecture.
    
    Args:
        input_shape_sat: (timesteps, features) for satellite data
        input_shape_sensor: (timesteps, features) for sensor data
        input_shape_static: (features,) for static features
    
    Returns:
        Compiled Keras model
    """
    # Satellite encoder
    sat_input = tf.keras.Input(shape=input_shape_sat, name='satellite')
    sat_encoded = tf.keras.layers.LSTM(32, return_sequences=True)(sat_input)
    sat_encoded = tf.keras.layers.LSTM(16)(sat_encoded)
    
    # Sensor encoder
    sensor_input = tf.keras.Input(shape=input_shape_sensor, name='sensor')
    sensor_encoded = tf.keras.layers.LSTM(16, return_sequences=True)(sensor_input)
    sensor_encoded = tf.keras.layers.LSTM(8)(sensor_encoded)
    
    # Static features
    static_input = tf.keras.Input(shape=(input_shape_static,), name='static')
    static_encoded = tf.keras.layers.Dense(8, activation='relu')(static_input)
    
    # Fusion
    fused = tf.keras.layers.Concatenate()([sat_encoded, sensor_encoded, static_encoded])
    fused = tf.keras.layers.Dense(32, activation='relu')(fused)
    fused = tf.keras.layers.Dropout(0.2)(fused)
    
    # Decoder
    decoder = tf.keras.layers.RepeatVector(7)(fused)  # 7 days
    decoder = tf.keras.layers.LSTM(32, return_sequences=True)(decoder)
    decoder = tf.keras.layers.TimeDistributed(
        tf.keras.layers.Dense(5, activation='linear')  # 5 forecast vars
    )(decoder)
    
    # Risk head
    risk_head = tf.keras.layers.Dense(16, activation='relu')(fused)
    risk_head = tf.keras.layers.Dense(7, activation='sigmoid')(risk_head)  # 7 days, 0-1 risk
    
    model = tf.keras.Model(
        inputs=[sat_input, sensor_input, static_input],
        outputs=[decoder, risk_head]
    )
    
    return model


def prepare_data(data_path):
    """
    Load and preprocess training data.
    
    Args:
        data_path: Path to CSV with columns: sat_seq, sensor_seq, static, forecast, risk
    
    Returns:
        X_train, X_val, y_train, y_val, scalers
    """
    print("Loading data...")
    df = pd.read_csv(data_path)
    
    # Parse sequences (stored as JSON strings or arrays)
    # In production, use proper parsing based on your data format
    
    # For demo, create synthetic data
    n_samples = 1000
    sat_seq = np.random.randn(n_samples, 8, 16).astype(np.float32)
    sensor_seq = np.random.randn(n_samples, 8, 3).astype(np.float32)
    static = np.random.randn(n_samples, 6).astype(np.float32)
    
    # Forecast targets (7 days × 5 vars)
    forecast = np.random.randn(n_samples, 7, 5).astype(np.float32)
    # Normalize forecast targets
    forecast[:, :, 0] = forecast[:, :, 0] * 5 + 20  # temp_min: 15-25°C
    forecast[:, :, 1] = forecast[:, :, 1] * 5 + 28  # temp_max: 23-33°C
    forecast[:, :, 2] = tf.nn.sigmoid(forecast[:, :, 2])  # precip_prob: 0-1
    forecast[:, :, 3] = np.abs(forecast[:, :, 3]) * 10 + 5  # wind: 5-15 km/h
    forecast[:, :, 4] = np.abs(forecast[:, :, 4]) * 20 + 60  # humidity: 60-80%
    
    # Risk targets (7 days)
    risk = tf.nn.sigmoid(np.random.randn(n_samples, 7, 1)).numpy().astype(np.float32)
    
    # Split
    X_sat_train, X_sat_val, X_sensor_train, X_sensor_val, X_static_train, X_static_val, \
    y_forecast_train, y_forecast_val, y_risk_train, y_risk_val = train_test_split(
        sat_seq, sensor_seq, static, forecast, risk,
        test_size=0.2, random_state=42
    )
    
    return (X_sat_train, X_sensor_train, X_static_train), \
           (X_sat_val, X_sensor_val, X_static_val), \
           (y_forecast_train, y_risk_train), \
           (y_forecast_val, y_risk_val)


def train(args):
    """Main training function."""
    print("Starting ClimaPredict model training...")
    
    # Prepare data
    (X_sat_train, X_sensor_train, X_static_train), \
    (X_sat_val, X_sensor_val, X_static_val), \
    (y_forecast_train, y_risk_train), \
    (y_forecast_val, y_risk_val) = prepare_data(args.data_path)
    
    # Create model
    model = create_model(
        input_shape_sat=(8, 16),
        input_shape_sensor=(8, 3),
        input_shape_static=6
    )
    
    # Compile
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss={
            'dense_2': 'mse',  # Forecast output
            'dense_3': 'binary_crossentropy'  # Risk output
        },
        loss_weights=[1.0, 0.5],
        metrics=['mae']
    )
    
    print(model.summary())
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5
        ),
        tf.keras.callbacks.ModelCheckpoint(
            args.checkpoint_dir + '/best_model.h5',
            save_best_only=True,
            monitor='val_loss'
        )
    ]
    
    # Train
    history = model.fit(
        [X_sat_train, X_sensor_train, X_static_train],
        [y_forecast_train, y_risk_train],
        validation_data=(
            [X_sat_val, X_sensor_val, X_static_val],
            [y_forecast_val, y_risk_val]
        ),
        epochs=args.epochs,
        batch_size=args.batch_size,
        callbacks=callbacks,
        verbose=1
    )
    
    # Export to TFLite
    print("Exporting to TensorFlow Lite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Dynamic range quantization (reduces size by ~4x)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    tflite_model = converter.convert()
    
    # Save
    output_path = args.output_path or 'climapredict_v1.tflite'
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    size_mb = len(tflite_model) / (1024 * 1024)
    print(f"✓ Model exported to {output_path}")
    print(f"  Size: {size_mb:.2f} MB")
    
    if size_mb > 50:
        print("⚠ Warning: Model size exceeds 50MB target!")
    
    return model, history


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train ClimaPredict model')
    parser.add_argument('--data-path', type=str, default='data/training_data.csv',
                        help='Path to training data CSV')
    parser.add_argument('--epochs', type=int, default=100,
                        help='Number of training epochs')
    parser.add_argument('--batch-size', type=int, default=32,
                        help='Batch size')
    parser.add_argument('--checkpoint-dir', type=str, default='checkpoints',
                        help='Directory to save checkpoints')
    parser.add_argument('--output-path', type=str, default='models/climapredict_v1.tflite',
                        help='Output path for TFLite model')
    
    args = parser.parse_args()
    
    # Create directories
    os.makedirs(args.checkpoint_dir, exist_ok=True)
    os.makedirs(os.path.dirname(args.output_path), exist_ok=True)
    
    train(args)

