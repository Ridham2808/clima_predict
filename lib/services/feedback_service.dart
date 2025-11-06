class FeedbackService {
  static final FeedbackService _instance = FeedbackService._internal();
  factory FeedbackService() => _instance;
  FeedbackService._internal();

  Future<void> saveLocalRating({required String village, required int stars}) async {
    // TODO: persist via Hive and trigger adaptive tuning queue when <3
  }
}


