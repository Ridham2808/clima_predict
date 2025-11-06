import 'dart:math';
import '../models/fusion_metadata.dart';

class FusionEngine {
  final FusionWeightsConfig defaultWeights;
  const FusionEngine({this.defaultWeights = const FusionWeightsConfig()});

  Map<String, double> effectiveWeights(SourceScores scores) {
    final raw = <String, double>{
      'NASA': defaultWeights.nasa * (scores.freshness['NASA'] ?? 0) * (scores.trust['NASA'] ?? 1),
      'OpenWeather': defaultWeights.openWeather * (scores.freshness['OpenWeather'] ?? 0) * (scores.trust['OpenWeather'] ?? 1),
      'IoT': defaultWeights.iot * (scores.freshness['IoT'] ?? 0) * (scores.trust['IoT'] ?? 1),
      'Farmer': defaultWeights.farmer * (scores.freshness['Farmer'] ?? 0) * (scores.trust['Farmer'] ?? 1),
    };
    final sum = raw.values.fold<double>(0, (a, b) => a + b);
    if (sum <= 0) {
      // fallback equal weights
      return {'NASA': .25, 'OpenWeather': .25, 'IoT': .25, 'Farmer': .25};
    }
    return raw.map((k, v) => MapEntry(k, v / sum));
  }

  // Given per-source values for a variable, fuse with effective weights
  double fuseValue({
    required Map<String, double?> sourceValues,
    required Map<String, double> weights,
  }) {
    double sum = 0;
    double wsum = 0;
    sourceValues.forEach((source, value) {
      final w = weights[source] ?? 0;
      if (value != null) {
        sum += w * value;
        wsum += w;
      }
    });
    if (wsum == 0) return 0;
    return sum / wsum;
  }

  // freshness functions from spec
  double freshnessDaysAgo(double days, {double freshDays = 7, double maxDays = 30}) {
    if (days <= freshDays) return 1.0;
    final t = (days - freshDays) / (maxDays - freshDays);
    return max(0.0, 1.0 - t);
  }

  double freshnessHoursAgo(double hours, {double freshHours = 6, double maxHours = 48}) {
    if (hours <= freshHours) return 1.0;
    final t = (hours - freshHours) / (maxHours - freshHours);
    return max(0.0, 1.0 - t);
  }
}


