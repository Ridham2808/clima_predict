import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:workmanager/workmanager.dart';
import '../models/feedback.dart';
import '../models/sensor_reading.dart';
import '../models/forecast_cache.dart';
import 'database_service.dart';
import 'api_service.dart';
import 'ml_service.dart';
import '../models/farmer_profile.dart';

class SyncService {
  final ApiService _apiService;
  static const String syncTaskName = 'climapredict_sync_task';

  SyncService({ApiService? apiService})
      : _apiService = apiService ?? ApiService();

  static Future<void> initializeBackgroundSync() async {
    await Workmanager().initialize(
      callbackDispatcher,
      isInDebugMode: false,
    );

    // Register periodic sync task (runs every 15 minutes when conditions met)
    await Workmanager().registerPeriodicTask(
      syncTaskName,
      syncTaskName,
      frequency: const Duration(minutes: 15),
      constraints: Constraints(
        networkType: NetworkType.connected,
        requiresBatteryNotLow: true,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresStorageNotLow: true,
      ),
    );
  }

  // Background worker callback
  @pragma('vm:entry-point')
  static void callbackDispatcher() {
    Workmanager().executeTask((task, inputData) async {
      final syncService = SyncService();
      await syncService.performSync();
      return Future.value(true);
    });
  }

  Future<bool> performSync({bool manual = false}) async {
    // Check connectivity
    final connectivityResult = await Connectivity().checkConnectivity();
    if (connectivityResult == ConnectivityResult.none && !manual) {
      return false; // Skip if offline and not manual
    }

    // Check if on Wi-Fi (preferred) or allow mobile data if manual
    final isWifi = connectivityResult == ConnectivityResult.wifi;
    if (!isWifi && !manual) {
      // Only sync on Wi-Fi unless manual
      return false;
    }

    try {
      // 1. Upload pending sensor readings
      final profile = DatabaseService.getFarmerProfile();
      if (profile != null) {
        final pendingReadings = DatabaseService.getSensorReadings(
          profile.village,
          startDate: DateTime.now().subtract(const Duration(days: 30)),
        );

        for (final reading in pendingReadings.take(100)) {
          // Limit batch size
          await _apiService.submitSensorReading(reading);
          await Future.delayed(const Duration(milliseconds: 100));
        }
      }

      // 2. Upload pending feedback
      final pendingFeedbacks = DatabaseService.getPendingFeedbacks();
      for (final feedback in pendingFeedbacks) {
        final success = await _apiService.submitFeedback(feedback);
        if (success) {
          // Mark as synced (in production, add sync status field)
        }
      }

      // 3. Sync events batch
      final events = <Map<String, dynamic>>[];
      events.addAll(pendingReadings.map((r) => r.toJson()));
      events.addAll(pendingFeedbacks.map((f) => f.toJson()));

      if (events.isNotEmpty) {
        final syncResponse = await _apiService.sync(events: events);
        if (syncResponse != null) {
          // Process server response: model updates, forecast updates
          await _processSyncResponse(syncResponse);
        }
      }

      // 4. Fetch latest forecasts if needed
      if (profile != null) {
        final latestForecast = await _apiService.getForecast(
          lat: 23.0, // Default for Anand, Gujarat
          lon: 72.6,
          village: profile.village,
        );

        if (latestForecast != null) {
          await DatabaseService.saveForecastCache(latestForecast);
        }
      }

      // 5. Check for model updates
      final modelInfo = await _apiService.getLatestModel();
      if (modelInfo != null) {
        final serverVersion = modelInfo['model_version'];
        if (serverVersion != MLService.modelVersion) {
          // Download and update model (in production)
          print('New model available: $serverVersion');
        }
      }

      return true;
    } catch (e) {
      print('Sync error: $e');
      return false;
    }
  }

  Future<void> _processSyncResponse(Map<String, dynamic> response) async {
    // Process resources from server (model updates, forecast updates)
    final resources = response['resources'] as List<dynamic>?;
    if (resources == null) return;

    for (final resource in resources) {
      final type = resource['type'] as String;
      final url = resource['url'] as String?;

      if (type == 'forecast' && url != null) {
        // Fetch and cache forecast update
        // Implementation depends on how forecasts are delivered
      } else if (type == 'model' && url != null) {
        // Download and update model
        // Implementation for model download
      }
    }
  }

  static Future<void> triggerManualSync() async {
    final syncService = SyncService();
    await syncService.performSync(manual: true);
  }
}

