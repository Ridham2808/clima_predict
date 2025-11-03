// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sensor_reading.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class SensorReadingAdapter extends TypeAdapter<SensorReading> {
  @override
  final int typeId = 3;

  @override
  SensorReading read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return SensorReading(
      sensorId: fields[0] as String,
      village: fields[1] as String,
      timestamp: fields[2] as DateTime,
      type: fields[3] as String,
      value: fields[4] as double,
      units: fields[5] as String,
      battery: fields[6] as int,
    );
  }

  @override
  void write(BinaryWriter writer, SensorReading obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.sensorId)
      ..writeByte(1)
      ..write(obj.village)
      ..writeByte(2)
      ..write(obj.timestamp)
      ..writeByte(3)
      ..write(obj.type)
      ..writeByte(4)
      ..write(obj.value)
      ..writeByte(5)
      ..write(obj.units)
      ..writeByte(6)
      ..write(obj.battery);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SensorReadingAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
