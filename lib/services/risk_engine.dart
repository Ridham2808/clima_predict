class RiskEngine {
  const RiskEngine();

  int computeDroughtRisk({
    required double tempAnomalyNorm,
    required double soilMoistureNorm,
    required double sevenDayRainSumNorm,
    required double ndviDeclineNorm,
    double a1 = 25,
    double a2 = 35,
    double a3 = 25,
    double a4 = 15,
  }) {
    final score = (a1 * tempAnomalyNorm) +
        (a2 * (1 - soilMoistureNorm)) +
        (a3 * (1 - sevenDayRainSumNorm)) +
        (a4 * ndviDeclineNorm);
    return score.clamp(0, 100).toInt();
  }

  int computeFloodRisk({
    required double rainPct,
    required double windKmhNorm,
    required double riverProximityFactor,
    required double soilSaturationNorm,
    double b1 = 50,
    double b2 = 10,
    double b3 = 20,
    double b4 = 20,
  }) {
    final score = (b1 * (rainPct / 100.0)) +
        (b2 * windKmhNorm) +
        (b3 * riverProximityFactor) +
        (b4 * soilSaturationNorm);
    return score.clamp(0, 100).toInt();
  }
}


