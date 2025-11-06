class ModelMetadata {
  final String modelVersion;
  final List<String> featureOrder; // length 10
  final Map<String, double> normalizationMeans;
  final Map<String, double> normalizationStds;
  final String trainingDataCutoff;

  const ModelMetadata({
    required this.modelVersion,
    required this.featureOrder,
    required this.normalizationMeans,
    required this.normalizationStds,
    required this.trainingDataCutoff,
  });
}


