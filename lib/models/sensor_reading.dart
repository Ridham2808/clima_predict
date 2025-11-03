import 'package:hive/hive.dart';

part 'sensor_reading.g.dart';

@HiveType(typeId: 3)
class SensorReading extends HiveObject {
  @HiveField(0)
  String sensorId; // MAC or UUID

  @HiveField(1)
  String village;

  @HiveField(2)
  DateTime timestamp;

  @HiveField(3)
  String type; // "temp", "humidity", "soil_moisture"

  @HiveField(4)
  double value;

  @HiveField(5)
  String units; // "C", "%", "m3"

  @HiveField(6)
  int battery; // 0-100

  SensorReading({
    required this.sensorId,
    required this.village,
    required this.timestamp,
    required this.type,
    required this.value,
    required this.units,
    required this.battery,
  });

  Map<String, dynamic> toJson() {
    return {
      'sensor_id': sensorId,
      'village': village,
      'timestamp': timestamp.toIso8601String(),
      'type': type,
      'value': value,
      'units': units,
      'battery': battery,
    };
  }

  factory SensorReading.fromJson(Map<String, dynamic> json) {
    return SensorReading(
      sensorId: json['sensor_id'],
      village: json['village'],
      timestamp: DateTime.parse(json['timestamp']),
      type: json['type'],
      value: json['value'].toDouble(),
      units: json['units'],
      battery: json['battery'],
    );
  }
}

