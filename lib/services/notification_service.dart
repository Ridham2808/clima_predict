class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  Future<void> init() async {
    // TODO: request permissions, configure channels
  }

  Future<void> pushRiskAlert({
    required String village,
    required String type, // Flood/Drought
    required int pct,
    required DateTime date,
    required String suggestion,
  }) async {
    // TODO: show local notification; support DND bypass if allowed
  }
}


