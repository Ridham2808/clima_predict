// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'forecast_cache.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class DailyForecastAdapter extends TypeAdapter<DailyForecast> {
  @override
  final int typeId = 1;

  @override
  DailyForecast read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return DailyForecast(
      date: fields[0] as String,
      tempMin: fields[1] as double,
      tempMax: fields[2] as double,
      precipProb: fields[3] as double,
      windKmh: fields[4] as double,
      humidity: fields[5] as int,
      riskScore: fields[6] as double,
      explanations: fields[7] as String,
    );
  }

  @override
  void write(BinaryWriter writer, DailyForecast obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.date)
      ..writeByte(1)
      ..write(obj.tempMin)
      ..writeByte(2)
      ..write(obj.tempMax)
      ..writeByte(3)
      ..write(obj.precipProb)
      ..writeByte(4)
      ..write(obj.windKmh)
      ..writeByte(5)
      ..write(obj.humidity)
      ..writeByte(6)
      ..write(obj.riskScore)
      ..writeByte(7)
      ..write(obj.explanations);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DailyForecastAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class ForecastCacheAdapter extends TypeAdapter<ForecastCache> {
  @override
  final int typeId = 2;

  @override
  ForecastCache read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ForecastCache(
      id: fields[0] as String,
      village: fields[1] as String,
      lat: fields[2] as double,
      lon: fields[3] as double,
      source: fields[4] as String,
      generatedAt: fields[5] as DateTime,
      validFrom: fields[6] as DateTime,
      validUntil: fields[7] as DateTime,
      dailyForecasts: (fields[8] as List).cast<DailyForecast>(),
      modelVersion: fields[9] as String,
      signature: fields[10] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, ForecastCache obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.village)
      ..writeByte(2)
      ..write(obj.lat)
      ..writeByte(3)
      ..write(obj.lon)
      ..writeByte(4)
      ..write(obj.source)
      ..writeByte(5)
      ..write(obj.generatedAt)
      ..writeByte(6)
      ..write(obj.validFrom)
      ..writeByte(7)
      ..write(obj.validUntil)
      ..writeByte(8)
      ..write(obj.dailyForecasts)
      ..writeByte(9)
      ..write(obj.modelVersion)
      ..writeByte(10)
      ..write(obj.signature);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ForecastCacheAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
