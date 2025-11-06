class FusionWeightsConfig {
  final double nasa;
  final double openWeather;
  final double iot;
  final double farmer;

  const FusionWeightsConfig({
    this.nasa = 0.40,
    this.openWeather = 0.30,
    this.iot = 0.20,
    this.farmer = 0.10,
  });

  Map<String, double> toMap() => {
        'NASA': nasa,
        'OpenWeather': openWeather,
        'IoT': iot,
        'Farmer': farmer,
      };
}

class SourceScores {
  final Map<String, double> freshness; // [0,1]
  final Map<String, double> trust; // [0,1]

  const SourceScores({required this.freshness, required this.trust});
}


