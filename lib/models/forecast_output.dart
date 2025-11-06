import 'package:hive/hive.dart';

@HiveType(typeId: 10)
class ForecastOutput extends HiveObject {
  @HiveField(0)
  final String village;
  @HiveField(1)
  final DateTime generatedAt;
  @HiveField(2)
  final List<DailyForecastOutput> days; // 7 items
  @HiveField(3)
  final String modelVersion;

  ForecastOutput({
    required this.village,
    required this.generatedAt,
    required this.days,
    required this.modelVersion,
  });
}

@HiveType(typeId: 11)
class DailyForecastOutput extends HiveObject {
  @HiveField(0)
  final DateTime date;
  @HiveField(1)
  final double tempC;
  @HiveField(2)
  final int rainPct;
  @HiveField(3)
  final double windKmh;
  @HiveField(4)
  final int humidityPct;
  @HiveField(5)
  final int droughtRiskPct;
  @HiveField(6)
  final int floodRiskPct;
  @HiveField(7)
  final int confidencePct;
  @HiveField(8)
  final List<String> dataSources;
  @HiveField(9)
  final Map<String, double> dataFreshness; // source -> freshness [0,1]
  @HiveField(10)
  final Map<String, double> fusionWeights; // source -> weight

  DailyForecastOutput({
    required this.date,
    required this.tempC,
    required this.rainPct,
    required this.windKmh,
    required this.humidityPct,
    required this.droughtRiskPct,
    required this.floodRiskPct,
    required this.confidencePct,
    required this.dataSources,
    required this.dataFreshness,
    required this.fusionWeights,
  });
}
// Manual Hive TypeAdapters to avoid build_runner dependency
class ForecastOutputAdapter extends TypeAdapter<ForecastOutput> {
  @override
  final int typeId = 10;

  @override
  ForecastOutput read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{};
    for (int i = 0; i < numOfFields; i++) {
      fields[reader.readByte()] = reader.read();
    }
    return ForecastOutput(
      village: fields[0] as String,
      generatedAt: fields[1] as DateTime,
      days: (fields[2] as List).cast<DailyForecastOutput>(),
      modelVersion: fields[3] as String,
    );
  }

  @override
  void write(BinaryWriter writer, ForecastOutput obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.village)
      ..writeByte(1)
      ..write(obj.generatedAt)
      ..writeByte(2)
      ..write(obj.days)
      ..writeByte(3)
      ..write(obj.modelVersion);
  }
}

class DailyForecastOutputAdapter extends TypeAdapter<DailyForecastOutput> {
  @override
  final int typeId = 11;

  @override
  DailyForecastOutput read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{};
    for (int i = 0; i < numOfFields; i++) {
      fields[reader.readByte()] = reader.read();
    }
    return DailyForecastOutput(
      date: fields[0] as DateTime,
      tempC: (fields[1] as num).toDouble(),
      rainPct: fields[2] as int,
      windKmh: (fields[3] as num).toDouble(),
      humidityPct: fields[4] as int,
      droughtRiskPct: fields[5] as int,
      floodRiskPct: fields[6] as int,
      confidencePct: fields[7] as int,
      dataSources: (fields[8] as List).cast<String>(),
      dataFreshness: (fields[9] as Map).cast<String, double>(),
      fusionWeights: (fields[10] as Map).cast<String, double>(),
    );
  }

  @override
  void write(BinaryWriter writer, DailyForecastOutput obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.date)
      ..writeByte(1)
      ..write(obj.tempC)
      ..writeByte(2)
      ..write(obj.rainPct)
      ..writeByte(3)
      ..write(obj.windKmh)
      ..writeByte(4)
      ..write(obj.humidityPct)
      ..writeByte(5)
      ..write(obj.droughtRiskPct)
      ..writeByte(6)
      ..write(obj.floodRiskPct)
      ..writeByte(7)
      ..write(obj.confidencePct)
      ..writeByte(8)
      ..write(obj.dataSources)
      ..writeByte(9)
      ..write(obj.dataFreshness)
      ..writeByte(10)
      ..write(obj.fusionWeights);
  }
}

