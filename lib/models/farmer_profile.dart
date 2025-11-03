import 'package:hive/hive.dart';

part 'farmer_profile.g.dart';

@HiveType(typeId: 0)
class FarmerProfile extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String name;

  @HiveField(2)
  String village;

  @HiveField(3)
  String block;

  @HiveField(4)
  String district;

  @HiveField(5)
  String state;

  @HiveField(6)
  List<String> crops; // ["wheat", "rice"]

  @HiveField(7)
  String language; // "en" or "hi"

  @HiveField(8)
  DateTime createdAt;

  @HiveField(9)
  DateTime? lastSyncAt;

  FarmerProfile({
    required this.id,
    required this.name,
    required this.village,
    required this.block,
    required this.district,
    required this.state,
    required this.crops,
    required this.language,
    required this.createdAt,
    this.lastSyncAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'village': village,
      'block': block,
      'district': district,
      'state': state,
      'crops': crops,
      'language': language,
      'created_at': createdAt.toIso8601String(),
      'last_sync_at': lastSyncAt?.toIso8601String(),
    };
  }

  factory FarmerProfile.fromJson(Map<String, dynamic> json) {
    return FarmerProfile(
      id: json['id'],
      name: json['name'],
      village: json['village'],
      block: json['block'],
      district: json['district'],
      state: json['state'],
      crops: List<String>.from(json['crops']),
      language: json['language'],
      createdAt: DateTime.parse(json['created_at']),
      lastSyncAt: json['last_sync_at'] != null
          ? DateTime.parse(json['last_sync_at'])
          : null,
    );
  }
}

