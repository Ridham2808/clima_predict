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
    // Fallback-friendly values if not populated
    if (lastTileTs == null) {
      return List.generate(7, (i) => {
            'cloud_cover_pct': 20 + (i % 3) * 5,
            'soil_moisture_mm': 35 - i.toDouble(),
            'NDVI': 0.5 - i * 0.01,
            'land_cover_type': 1,
          });
    }
    return List.generate(7, (i) => {
          'cloud_cover_pct': null,
          'soil_moisture_mm': null,
          'NDVI': null,
          'land_cover_type': null,
        });
  }

  DateTime? get lastDataTimestamp => lastTileTs;
}


