import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import '../models/forecast_cache.dart';
import '../models/feedback.dart' as appfb;
import '../models/sensor_reading.dart';
import '../models/insurance_claim.dart';

import '../config/api_config.dart';

class ApiService {
  final Dio _dio;
  final String baseUrl;

  ApiService({String? baseUrl})
      : baseUrl = baseUrl ?? ApiConfig.baseUrl,
        _dio = Dio(BaseOptions(
          baseUrl: baseUrl ?? ApiConfig.baseUrl,
          connectTimeout: const Duration(seconds: 30),
          receiveTimeout: const Duration(seconds: 30),
          headers: {'Content-Type': 'application/json'},
        ));

  // GET /api/v1/forecast?lat={lat}&lon={lon}&village={village}
  Future<ForecastCache?> getForecast({
    required double lat,
    required double lon,
    required String village,
  }) async {
    try {
      final response = await _dio.get(
        '/api/v1/forecast',
        queryParameters: {
          'lat': lat,
          'lon': lon,
          'village': village,
        },
      );
      return ForecastCache.fromJson(response.data);
    } catch (e) {
      debugPrint('Error fetching forecast: $e');
      return null;
    }
  }

  // POST /api/v1/feedback
  Future<bool> submitFeedback(appfb.Feedback feedback) async {
    try {
      final response = await _dio.post(
        '/api/v1/feedback',
        data: feedback.toJson(),
      );
      return response.data['status'] == 'ok';
    } catch (e) {
      debugPrint('Error submitting feedback: $e');
      return false;
    }
  }

  // POST /api/v1/sensor
  Future<bool> submitSensorReading(SensorReading reading) async {
    try {
      final response = await _dio.post(
        '/api/v1/sensor',
        data: reading.toJson(),
      );
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error submitting sensor reading: $e');
      return false;
    }
  }

  // GET /api/v1/model/latest
  Future<Map<String, dynamic>?> getLatestModel() async {
    try {
      final response = await _dio.get('/api/v1/model/latest');
      return response.data;
    } catch (e) {
      debugPrint('Error fetching latest model: $e');
      return null;
    }
  }

  // POST /api/v1/sync
  Future<Map<String, dynamic>?> sync({
    required List<Map<String, dynamic>> events,
  }) async {
    try {
      // Compress NDJSON
      final ndjson = events.map((e) => jsonEncode(e)).join('\n');
      final compressed = utf8.encode(ndjson); // In production, use gzip

      final response = await _dio.post(
        '/api/v1/sync',
        data: compressed,
        options: Options(
          headers: {'Content-Type': 'application/x-ndjson'},
          contentType: 'application/x-ndjson',
        ),
      );
      return response.data;
    } catch (e) {
      debugPrint('Error syncing: $e');
      return null;
    }
  }

  // POST /api/v1/claim_estimate
  Future<InsuranceClaimEstimate?> getClaimEstimate({
    required String village,
    required String crop,
    required int forecastWindow,
    required double areaHectares,
  }) async {
    try {
      final response = await _dio.post(
        '/api/v1/claim_estimate',
        data: {
          'village': village,
          'crop': crop,
          'forecast_window': forecastWindow,
          'area_hectares': areaHectares,
        },
      );
      return InsuranceClaimEstimate.fromJson(response.data);
    } catch (e) {
      debugPrint('Error getting claim estimate: $e');
      return null;
    }
  }

  // GET /api/v1/metrics (admin)
  Future<Map<String, dynamic>?> getMetrics() async {
    try {
      final response = await _dio.get('/api/v1/metrics');
      return response.data;
    } catch (e) {
      debugPrint('Error fetching metrics: $e');
      return null;
    }
  }
}

