import 'package:flutter/foundation.dart';
import '../services/forecast_engine.dart';
import '../models/forecast_output.dart';
import '../services/notification_service.dart';
import '../services/tts_service.dart';

class ForecastController extends ChangeNotifier {
  final ForecastEngine engine;
  final NotificationService notif;
  final TtsService tts;

  ForecastController({
    ForecastEngine? engine,
    NotificationService? notif,
    TtsService? tts,
  })  : engine = engine ?? ForecastEngine(),
        notif = notif ?? NotificationService(),
        tts = tts ?? TtsService();

  ForecastOutput? _current;
  ForecastOutput? get current => _current;
  bool _usingDemo = false;
  bool get usingDemo => _usingDemo;
  bool get showOfflineBanner {
    if (_current == null) return false;
    final f = _current!.days.first.dataFreshness;
    return f.values.any((v) => v < 1.0);
  }

  bool _loading = false;
  bool get loading => _loading;

  Future<void> refresh({required bool onWifi}) async {
    _loading = true;
    notifyListeners();
    try {
      final forecast = await engine.generateOfflineFirst(onWifi: onWifi);
      await _postGenerateAlerts(prev: _current, next: forecast);
      _current = forecast;
      _usingDemo = false;
    } catch (_) {
      // fallback to demo scenario
      _current = DemoScenarios.scenarioAnandClearSkies();
      _usingDemo = true;
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> rateForecast({required int stars}) async {
    // TODO: Save locally and enqueue fine-tuning if <3
  }

  Future<void> _postGenerateAlerts({ForecastOutput? prev, required ForecastOutput next}) async {
    for (int i = 0; i < next.days.length; i++) {
      final d = next.days[i];
      final prevRain = prev?.days.length == next.days.length ? prev!.days[i].rainPct : null;
      final sudden = prevRain != null && (d.rainPct - prevRain).abs() > 30;
      if (d.floodRiskPct > 70 || d.droughtRiskPct > 70 || sudden) {
        final type = d.floodRiskPct > d.droughtRiskPct ? 'Flood' : 'Drought';
        await notif.pushRiskAlert(
          village: next.village,
          type: type,
          pct: type == 'Flood' ? d.floodRiskPct : d.droughtRiskPct,
          date: d.date,
          suggestion: type == 'Flood' ? 'Move livestock to higher ground.' : 'Schedule irrigation as feasible.',
        );
        await tts.speakAlert(
          languageCode: 'hi',
          text: type == 'Flood'
              ? 'चेतावनी: ${next.village} में बाढ़ का जोखिम ${type == 'Flood' ? d.floodRiskPct : d.droughtRiskPct} प्रतिशत है.'
              : 'चेतावनी: सूखे का जोखिम ${type == 'Flood' ? d.floodRiskPct : d.droughtRiskPct} प्रतिशत है.',
        );
      }
    }
  }
}

class DemoScenarios {
  static ForecastOutput scenarioAnandClearSkies() {
    final now = DateTime.now();
    final days = List<DailyForecastOutput>.generate(7, (i) {
      final date = DateTime(now.year, now.month, now.day).add(Duration(days: i));
      return DailyForecastOutput(
        date: date,
        tempC: 29 + i * 0.2,
        rainPct: 5,
        windKmh: 8,
        humidityPct: 50,
        droughtRiskPct: 10,
        floodRiskPct: 2,
        confidencePct: 90,
        dataSources: const ['NASA_MODIS', 'OpenWeather', 'IoT'],
        dataFreshness: const {'NASA': 1.0, 'OpenWeather': 1.0, 'IoT': 1.0},
        fusionWeights: const {'NASA': 0.4, 'OpenWeather': 0.3, 'IoT': 0.2, 'Farmer': 0.1},
      );
    });
    return ForecastOutput(village: 'Anand', generatedAt: now, days: days, modelVersion: 'v-demo');
  }

  static List<ForecastOutput> tenShowcaseScenarios() {
    return [
      scenarioAnandClearSkies(),
      _variant('Anand', rainPct: 80, flood: 75, temp: 27, hum: 85),
      _variant('Umreth', rainPct: 60, flood: 55, temp: 25, hum: 78),
      _variant('Petlad', rainPct: 20, drought: 65, temp: 34, hum: 35),
      _variant('Sojitra', rainPct: 10, drought: 72, temp: 36, hum: 30),
      _variant('Tarapur', rainPct: 45, temp: 30, wind: 22),
      _variant('Khambhat', rainPct: 70, flood: 80, temp: 28, wind: 30),
      _variant('Borsad', rainPct: 15, drought: 40, temp: 33),
      _variant('Anklav', rainPct: 5, drought: 30, temp: 35),
      _variant('Vallabh Vidyanagar', rainPct: 50, temp: 29, hum: 65),
    ];
  }

  static ForecastOutput _variant(String village, {int rainPct = 20, int flood = 10, int drought = 10, double temp = 30, int hum = 60, double wind = 12}) {
    final now = DateTime.now();
    final days = List<DailyForecastOutput>.generate(7, (i) {
      final date = DateTime(now.year, now.month, now.day).add(Duration(days: i));
      final rp = (rainPct + (i % 3) * 5).clamp(0, 100);
      final fr = (flood + (i % 2) * 5).clamp(0, 100);
      final dr = (drought + ((i + 1) % 2) * 5).clamp(0, 100);
      final conf = (90 - i).clamp(60, 95);
      return DailyForecastOutput(
        date: date,
        tempC: temp + i * 0.3,
        rainPct: rp,
        windKmh: wind + i,
        humidityPct: hum,
        droughtRiskPct: dr,
        floodRiskPct: fr,
        confidencePct: conf,
        dataSources: const ['NASA_MODIS', 'OpenWeather', 'IoT'],
        dataFreshness: const {'NASA': 0.9, 'OpenWeather': 0.8, 'IoT': 0.7},
        fusionWeights: const {'NASA': 0.42, 'OpenWeather': 0.29, 'IoT': 0.19, 'Farmer': 0.10},
      );
    });
    return ForecastOutput(village: village, generatedAt: now, days: days, modelVersion: 'v-demo');
  }
}


