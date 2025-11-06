class Env {
  static const String openWeatherApiKey = String.fromEnvironment('OPENWEATHER_API_KEY', defaultValue: '');
  static const String nasaApiKey = String.fromEnvironment('NASA_API_KEY', defaultValue: '');

  static bool get hasOpenWeatherKey => openWeatherApiKey.isNotEmpty;
  static bool get hasNasaKey => nasaApiKey.isNotEmpty;
}


