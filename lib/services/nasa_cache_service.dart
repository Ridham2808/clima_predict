class NasaCacheService {
  static final NasaCacheService _instance = NasaCacheService._internal();
  factory NasaCacheService() => _instance;
  NasaCacheService._internal();

  // For each village or bbox, maintain latest tile metadata and derived layers
  // Real implementation should store in Hive/SQLite and manage 4 weeks retention

  DateTime? lastTileTs;

  Future<void> init() async {}

  // Return derived layers for next 7 days (extrapolated or last-observed)
  List<Map<String, double?>> getDerivedSeriesNext7({required String village}) {
    // Placeholder values
    return List.generate(7, (i) => {
          'cloud_cover_pct': null,
          'soil_moisture_mm': null,
          'NDVI': null,
          'land_cover_type': null, // encoded numeric if needed
        });
  }

  DateTime? get lastDataTimestamp => lastTileTs;
}


