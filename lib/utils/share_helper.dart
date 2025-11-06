import '../models/forecast_output.dart';

class ShareHelper {
  static String buildShareText(ForecastOutput fo) {
    final d = fo.days.first;
    return '🌦 ClimaPredict Forecast\n'
        '📍 ${fo.village}\n'
        '🌡 Temp: ${d.tempC.toStringAsFixed(1)}°C | 🌧 Rain: ${d.rainPct}%\n'
        '💨 Wind: ${d.windKmh.toStringAsFixed(0)} km/h | 💧 Humidity: ${d.humidityPct}%\n'
        '🌾 Drought Risk: ${_riskLabel(d.droughtRiskPct)} (Confidence ${d.confidencePct}%)';
  }

  static String _riskLabel(int v) {
    if (v > 70) return 'High';
    if (v >= 30) return 'Medium';
    return 'Low';
  }
}


