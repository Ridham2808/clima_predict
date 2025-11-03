import 'package:hive/hive.dart';

part 'forecast_cache.g.dart';

@HiveType(typeId: 1)
class DailyForecast extends HiveObject {
  @HiveField(0)
  String date; // YYYY-MM-DD

  @HiveField(1)
  double tempMin;

  @HiveField(2)
  double tempMax;

  @HiveField(3)
  double precipProb; // 0.0 to 1.0

  @HiveField(4)
  double windKmh;

  @HiveField(5)
  int humidity; // 0-100

  @HiveField(6)
  double riskScore; // 0.0 to 1.0

  @HiveField(7)
  String explanations;

  DailyForecast({
    required this.date,
    required this.tempMin,
    required this.tempMax,
    required this.precipProb,
    required this.windKmh,
    required this.humidity,
    required this.riskScore,
    required this.explanations,
  });

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'temp_min': tempMin,
      'temp_max': tempMax,
      'precip_prob': precipProb,
      'wind_kmh': windKmh,
      'humidity': humidity,
      'risk_score': riskScore,
      'explanations': explanations,
    };
  }

  factory DailyForecast.fromJson(Map<String, dynamic> json) {
    return DailyForecast(
      date: json['date'],
      tempMin: json['temp_min'].toDouble(),
      tempMax: json['temp_max'].toDouble(),
      precipProb: json['precip_prob'].toDouble(),
      windKmh: json['wind_kmh'].toDouble(),
      humidity: json['humidity'],
      riskScore: json['risk_score'].toDouble(),
      explanations: json['explanations'] ?? '',
    );
  }
}

@HiveType(typeId: 2)
class ForecastCache extends HiveObject {
  @HiveField(0)
  String id; // village + date hash

  @HiveField(1)
  String village;

  @HiveField(2)
  double lat;

  @HiveField(3)
  double lon;

  @HiveField(4)
  String source; // "ondevice" or "cloud"

  @HiveField(5)
  DateTime generatedAt;

  @HiveField(6)
  DateTime validFrom;

  @HiveField(7)
  DateTime validUntil;

  @HiveField(8)
  List<DailyForecast> dailyForecasts;

  @HiveField(9)
  String modelVersion;

  @HiveField(10)
  String? signature; // sha256

  ForecastCache({
    required this.id,
    required this.village,
    required this.lat,
    required this.lon,
    required this.source,
    required this.generatedAt,
    required this.validFrom,
    required this.validUntil,
    required this.dailyForecasts,
    required this.modelVersion,
    this.signature,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'village': village,
      'lat': lat,
      'lon': lon,
      'source': source,
      'generated_at': generatedAt.toIso8601String(),
      'valid_from': validFrom.toIso8601String(),
      'valid_until': validUntil.toIso8601String(),
      'daily_forecasts': dailyForecasts.map((f) => f.toJson()).toList(),
      'model_version': modelVersion,
      'signature': signature,
    };
  }

  factory ForecastCache.fromJson(Map<String, dynamic> json) {
    return ForecastCache(
      id: json['id'],
      village: json['village'],
      lat: json['lat'].toDouble(),
      lon: json['lon'].toDouble(),
      source: json['source'],
      generatedAt: DateTime.parse(json['generated_at']),
      validFrom: DateTime.parse(json['valid_from']),
      validUntil: DateTime.parse(json['valid_until']),
      dailyForecasts: (json['daily_forecasts'] as List)
          .map((f) => DailyForecast.fromJson(f))
          .toList(),
      modelVersion: json['model_version'],
      signature: json['signature'],
    );
  }
}

