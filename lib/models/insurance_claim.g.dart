// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'insurance_claim.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class InsuranceClaimEstimateAdapter
    extends TypeAdapter<InsuranceClaimEstimate> {
  @override
  final int typeId = 5;

  @override
  InsuranceClaimEstimate read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return InsuranceClaimEstimate(
      recordId: fields[0] as String,
      village: fields[1] as String,
      crop: fields[2] as String,
      forecastedLossProbability: fields[3] as double,
      estimatedLossValue: fields[4] as double,
      recommendedAction: fields[5] as String,
      timestamp: fields[6] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, InsuranceClaimEstimate obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.recordId)
      ..writeByte(1)
      ..write(obj.village)
      ..writeByte(2)
      ..write(obj.crop)
      ..writeByte(3)
      ..write(obj.forecastedLossProbability)
      ..writeByte(4)
      ..write(obj.estimatedLossValue)
      ..writeByte(5)
      ..write(obj.recommendedAction)
      ..writeByte(6)
      ..write(obj.timestamp);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is InsuranceClaimEstimateAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
