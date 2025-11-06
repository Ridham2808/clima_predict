class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  Future<Map<String, dynamic>> getUserLocationOfflineFirst() async {
    // TODO: use GPS + offline reverse geocode tiles; for now return Anand
    return {
      'lat': 22.5645,
      'lon': 72.9289,
      'village': 'Anand',
      'district': 'Anand',
      'state': 'Gujarat',
      'accuracy_m': 10,
    };
  }
}


