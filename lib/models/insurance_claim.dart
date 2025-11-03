import 'package:hive/hive.dart';

part 'insurance_claim.g.dart';

@HiveType(typeId: 5)
class InsuranceClaimEstimate extends HiveObject {
  @HiveField(0)
  String recordId;

  @HiveField(1)
  String village;

  @HiveField(2)
  String crop;

  @HiveField(3)
  double forecastedLossProbability; // 0.0 to 1.0

  @HiveField(4)
  double estimatedLossValue; // in currency units

  @HiveField(5)
  String recommendedAction; // "file_pm-fby_claim"

  @HiveField(6)
  DateTime timestamp;

  InsuranceClaimEstimate({
    required this.recordId,
    required this.village,
    required this.crop,
    required this.forecastedLossProbability,
    required this.estimatedLossValue,
    required this.recommendedAction,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'record_id': recordId,
      'village': village,
      'crop': crop,
      'forecasted_loss_probability': forecastedLossProbability,
      'estimated_loss_value': estimatedLossValue,
      'recommended_action': recommendedAction,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory InsuranceClaimEstimate.fromJson(Map<String, dynamic> json) {
    return InsuranceClaimEstimate(
      recordId: json['record_id'],
      village: json['village'],
      crop: json['crop'],
      forecastedLossProbability: json['forecasted_loss_probability'].toDouble(),
      estimatedLossValue: json['estimated_loss_value'].toDouble(),
      recommendedAction: json['recommended_action'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}

