import 'dart:async';

class OpenWeatherService {
  static final OpenWeatherService _instance = OpenWeatherService._internal();
  factory OpenWeatherService() => _instance;
  OpenWeatherService._internal();

  // Placeholder cache; real impl should persist via Hive/SQLite
  DateTime? _lastFetch;
  DateTime? _lastDataTs;

  Future<void> init() async {}

  Future<void> fetchIfDue({required double lat, required double lon, required bool onWifi}) async {
    final now = DateTime.now();
    final threshold = onWifi ? const Duration(hours: 1) : const Duration(hours: 6);
    if (_lastFetch == null || now.difference(_lastFetch!) > threshold) {
      // TODO: call OpenWeather API using API key from env, store hourly for last 7 days
      _lastFetch = now;
      _lastDataTs = now;
    }
  }

  // Return daily aggregates needed by fusion/model; null values allowed
  List<Map<String, double?>> getDailySeriesNext7({required double lat, required double lon}) {
    // Fallback-friendly series so UI never breaks
    if (_lastDataTs == null) {
      return List.generate(7, (i) => {
            'temp_C': 28 + i * 0.2,
            'wind_kmh': 10 + i.toDouble(),
            'humidity_pct': 55 + (i % 3) * 3,
            'pressure_hPa': 1012.0,
            'precipitation_mm': (i % 4 == 0) ? 2.0 : 0.0,
          });
    }
    return List.generate(7, (i) => {
          'temp_C': null,
          'wind_kmh': null,
          'humidity_pct': null,
          'pressure_hPa': null,
          'precipitation_mm': null,
        });
  }

  DateTime? get lastDataTimestamp => _lastDataTs;
}


