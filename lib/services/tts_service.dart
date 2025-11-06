class TtsService {
  static final TtsService _instance = TtsService._internal();
  factory TtsService() => _instance;
  TtsService._internal();

  Future<void> init() async {
    // TODO: initialize TTS engines; preload Hindi/English voices if supported
  }

  Future<void> speakAlert({
    required String languageCode, // 'hi' or 'en'
    required String text,
  }) async {
    // TODO: call TTS plugin
  }
}


