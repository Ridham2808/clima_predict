// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'farmer_profile.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class FarmerProfileAdapter extends TypeAdapter<FarmerProfile> {
  @override
  final int typeId = 0;

  @override
  FarmerProfile read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return FarmerProfile(
      id: fields[0] as String,
      name: fields[1] as String,
      village: fields[2] as String,
      block: fields[3] as String,
      district: fields[4] as String,
      state: fields[5] as String,
      crops: (fields[6] as List).cast<String>(),
      language: fields[7] as String,
      createdAt: fields[8] as DateTime,
      lastSyncAt: fields[9] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, FarmerProfile obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.village)
      ..writeByte(3)
      ..write(obj.block)
      ..writeByte(4)
      ..write(obj.district)
      ..writeByte(5)
      ..write(obj.state)
      ..writeByte(6)
      ..write(obj.crops)
      ..writeByte(7)
      ..write(obj.language)
      ..writeByte(8)
      ..write(obj.createdAt)
      ..writeByte(9)
      ..write(obj.lastSyncAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FarmerProfileAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
