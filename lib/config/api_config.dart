import 'package:flutter_dotenv/flutter_dotenv';

class ApiConfig {
  // Get API base URL from .env file
  // Default fallback for development
  static String get baseUrl {
    return dotenv.env['API_BASE_URL'] ?? 
           'https://climapredict-api.onrender.com';
  }

  // API endpoints
  static String get forecastEndpoint => '$baseUrl/api/v1/forecast';
  static String get feedbackEndpoint => '$baseUrl/api/v1/feedback';
  static String get sensorEndpoint => '$baseUrl/api/v1/sensor';
  static String get syncEndpoint => '$baseUrl/api/v1/sync';
  static String get modelEndpoint => '$baseUrl/api/v1/model/latest';
  static String get claimEstimateEndpoint => '$baseUrl/api/v1/claim_estimate';
  static String get metricsEndpoint => '$baseUrl/api/v1/metrics';

  // Health check
  static String get healthEndpoint => '$baseUrl/health';
}

