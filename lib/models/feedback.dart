import 'package:hive/hive.dart';

part 'feedback.g.dart';

@HiveType(typeId: 4)
class Feedback extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String village;

  @HiveField(2)
  String userId;

  @HiveField(3)
  int rating; // 1-5

  @HiveField(4)
  String? comment;

  @HiveField(5)
  DateTime timestamp;

  @HiveField(6)
  String? attachedPhoto; // base64 or S3 URL

  @HiveField(7)
  String? signedClaim; // optional hash for blockchain

  Feedback({
    required this.id,
    required this.village,
    required this.userId,
    required this.rating,
    this.comment,
    required this.timestamp,
    this.attachedPhoto,
    this.signedClaim,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'village': village,
      'user_id': userId,
      'rating': rating,
      'comment': comment,
      'timestamp': timestamp.toIso8601String(),
      'attached_photo': attachedPhoto,
      'signed_claim': signedClaim,
    };
  }

  factory Feedback.fromJson(Map<String, dynamic> json) {
    return Feedback(
      id: json['id'],
      village: json['village'],
      userId: json['user_id'],
      rating: json['rating'],
      comment: json['comment'],
      timestamp: DateTime.parse(json['timestamp']),
      attachedPhoto: json['attached_photo'],
      signedClaim: json['signed_claim'],
    );
  }
}

