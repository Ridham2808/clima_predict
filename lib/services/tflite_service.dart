import 'package:flutter/services.dart';

class TFLiteService {
  static final TFLiteService _instance = TFLiteService._internal();
  factory TFLiteService() => _instance;
  TFLiteService._internal();

  bool _initialized = false;
  String _modelVersion = 'v1.0.0';

  Future<void> init({String assetPath = 'assets/model/model.tflite', String version = 'v1.0.0'}) async {
    if (_initialized) return;
    // In a real implementation, load via tflite_flutter package and create Interpreter with delegates.
    // Here we ensure asset exists to catch packaging issues early.
    await rootBundle.load(assetPath);
    _modelVersion = version;
    _initialized = true;
  }

  String get modelVersion => _modelVersion;

  // input shape: [1,7,10] float32; output: [1,7,5]
  Future<List<List<double>>> runInference(List<List<double>> input) async {
    if (!_initialized) {
      throw StateError('TFLiteService not initialized');
    }
    // Placeholder: echo a simple deterministic transform to keep app functional until real model is integrated
    final List<List<double>> output = List.generate(7, (i) {
      final day = input[i];
      final temp = day[0];
      final humidity = day[1];
      final wind = day[2];
      final rainMm = day[3];
      // Map to [temp_C, rain_pct, wind_kmh, humidity_pct, risk_score]
      final rainPct = (rainMm * 10).clamp(0.0, 100.0);
      final risk = (0.4 * rainPct + 0.2 * wind + 0.2 * (100 - humidity) + 0.2 * (temp - 20).abs()).clamp(0.0, 100.0);
      return [temp, rainPct, wind, humidity, risk];
    });
    return output;
  }
}


