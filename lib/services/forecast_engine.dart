import 'dart:math';
import '../services/fusion_engine.dart';
import '../services/tflite_service.dart';
import '../services/risk_engine.dart';
import '../services/openweather_service.dart';
import '../services/nasa_cache_service.dart';
import '../services/iot_ble_service.dart';
import '../services/location_service.dart';
import '../models/forecast_output.dart';
import '../models/fusion_metadata.dart';

class ForecastEngine {
  final FusionEngine fusion;
  final TFLiteService tflite;
  final RiskEngine riskEngine;
  final OpenWeatherService owm;
  final NasaCacheService nasa;
  final IotBleService iot;
  final LocationService locationService;

  ForecastEngine({
    FusionEngine? fusion,
    TFLiteService? tflite,
    RiskEngine? riskEngine,
    OpenWeatherService? owm,
    NasaCacheService? nasa,
    IotBleService? iot,
    LocationService? locationService,
  })  : fusion = fusion ?? const FusionEngine(),
        tflite = tflite ?? TFLiteService(),
        riskEngine = riskEngine ?? const RiskEngine(),
        owm = owm ?? OpenWeatherService(),
        nasa = nasa ?? NasaCacheService(),
        iot = iot ?? IotBleService(),
        locationService = locationService ?? LocationService();

  Future<ForecastOutput> generateOfflineFirst({required bool onWifi}) async {
    final loc = await locationService.getUserLocationOfflineFirst();
    final village = loc['village'] as String;
    final lat = (loc['lat'] as num).toDouble();
    final lon = (loc['lon'] as num).toDouble();

    await owm.fetchIfDue(lat: lat, lon: lon, onWifi: onWifi);

    final owmSeries = owm.getDailySeriesNext7(lat: lat, lon: lon);
    final nasaSeries = nasa.getDerivedSeriesNext7(village: village);
    final iotSeries = iot.getLocalSeriesNext7(village: village);

    final now = DateTime.now();
    final freshness = {
      'NASA': _freshnessFromDate(nasa.lastTileTs),
      'OpenWeather': 1.0, // assume recent after fetchIfDue; refine with timestamps
      'IoT': _freshnessFromDate(iot.lastHeartbeat, hoursMode: true),
      'Farmer': 1.0, // placeholder until feedback integration
    };
    final trust = {
      'NASA': 1.0,
      'OpenWeather': 1.0,
      'IoT': iot.trust.clamp(0.0, 1.0),
      'Farmer': 0.8,
    };

    final weights = fusion.effectiveWeights(SourceScores(freshness: freshness, trust: trust));

    // Build 7x10 input features
    final input = List<List<double>>.generate(7, (i) {
      final o = owmSeries[i];
      final n = nasaSeries[i];
      final s = iotSeries[i];
      double fuse(String key) => fusion.fuseValue(sourceValues: {
            'OpenWeather': o[key],
            'NASA': n[key],
            'IoT': s[key],
            'Farmer': null,
          }, weights: weights);

      final temp = fuse('temp_C');
      final humidity = fuse('humidity_pct');
      final wind = fuse('wind_kmh');
      final rainMm = fuse('precipitation_mm') + (s['rain_mm'] ?? 0);
      final soil = (s['soil_moisture'] ?? n['soil_moisture_mm'])?.toDouble() ?? 0.0;
      final ndvi = (n['NDVI'] ?? 0.0).toDouble();
      final cloud = (n['cloud_cover_pct'] ?? 0.0).toDouble();
      final pressure = (o['pressure_hPa'] ?? 1013.25).toDouble();
      final river = (s['river_level_cm'] ?? 0.0).toDouble();
      final dayOfYear = _dayOfYear(now.add(Duration(days: i)));
      final sinDay = sin(2 * pi * dayOfYear / 365.0);
      final cosDay = cos(2 * pi * dayOfYear / 365.0);

      return [
        temp,
        humidity,
        wind,
        rainMm,
        soil,
        ndvi,
        cloud,
        pressure,
        river,
        sinDay + cosDay, // compressed to keep 10 dims in placeholder
      ].map((e) => e.isFinite ? e : 0.0).toList();
    });

    final modelOut = await tflite.runInference(input);

    // Post-process and compute risks, confidence
    final days = List<DailyForecastOutput>.generate(7, (i) {
      final o = modelOut[i];
      final tempC = o[0];
      final rainPct = o[1].clamp(0, 100).toInt();
      final windKmh = o[2];
      final humidityPct = o[3].clamp(0, 100).toInt();

      final drought = riskEngine.computeDroughtRisk(
        tempAnomalyNorm: ((tempC - 28).abs() / 15).clamp(0, 1),
        soilMoistureNorm: (input[i][4] / 100.0).clamp(0, 1),
        sevenDayRainSumNorm: (input.take(i + 1).map((d) => d[3]).fold<double>(0, (a, b) => a + b) / 70).clamp(0, 1),
        ndviDeclineNorm: (max(0.0, 0.5 - input[i][5])).clamp(0, 1),
      );
      final flood = riskEngine.computeFloodRisk(
        rainPct: rainPct.toDouble(),
        windKmhNorm: (windKmh / 60).clamp(0, 1),
        riverProximityFactor: (input[i][8] / 300).clamp(0, 1),
        soilSaturationNorm: (min(1.0, input[i][4] / 80)).clamp(0, 1),
      );

      final conf = _confidencePct(freshness: freshness, sensorCount: 1, recentRatingsAvg: 4.0);

      return DailyForecastOutput(
        date: DateTime(now.year, now.month, now.day).add(Duration(days: i)),
        tempC: double.parse(tempC.toStringAsFixed(1)),
        rainPct: rainPct,
        windKmh: double.parse(windKmh.toStringAsFixed(1)),
        humidityPct: humidityPct,
        droughtRiskPct: drought,
        floodRiskPct: flood,
        confidencePct: conf,
        dataSources: const ['NASA_MODIS', 'OpenWeather', 'IoT'],
        dataFreshness: {
          'NASA': freshness['NASA'] ?? 0,
          'OpenWeather': freshness['OpenWeather'] ?? 0,
          'IoT': freshness['IoT'] ?? 0,
        },
        fusionWeights: weights,
      );
    });

    return ForecastOutput(
      village: village,
      generatedAt: now,
      days: days,
      modelVersion: tflite.modelVersion,
    );
  }

  int _confidencePct({
    required Map<String, double> freshness,
    required int sensorCount,
    required double recentRatingsAvg,
  }) {
    final freshnessAvg = freshness.values.fold<double>(0, (a, b) => a + b) / max(1, freshness.length);
    final sensorFactor = (sensorCount >= 2 ? 1.0 : 0.8);
    final ratingFactor = (recentRatingsAvg / 5.0).clamp(0.5, 1.0);
    final conf = (0.6 * freshnessAvg + 0.2 * sensorFactor + 0.2 * ratingFactor) * 100.0;
    return conf.clamp(0, 100).toInt();
  }

  double _freshnessFromDate(DateTime? ts, {bool hoursMode = false}) {
    if (ts == null) return 0.0;
    final diff = DateTime.now().difference(ts);
    if (hoursMode) {
      final hours = diff.inMinutes / 60.0;
      return FusionEngine().freshnessHoursAgo(hours);
    } else {
      final days = diff.inHours / 24.0;
      return FusionEngine().freshnessDaysAgo(days);
    }
  }

  int _dayOfYear(DateTime date) {
    final start = DateTime(date.year, 1, 1);
    return date.difference(start).inDays + 1;
  }
}


