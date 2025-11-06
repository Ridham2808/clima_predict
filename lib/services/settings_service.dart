import 'package:hive/hive.dart';

class SettingsService {
  static const String _boxName = 'app_settings';

  static Future<void> init() async {
    if (!Hive.isBoxOpen(_boxName)) {
      await Hive.openBox(_boxName);
    }
  }

  static Box get _box => Hive.box(_boxName);

  static bool get offlineMode => _box.get('offline_mode', defaultValue: false) as bool;
  static set offlineMode(bool v) => _box.put('offline_mode', v);

  static String get language => _box.get('language', defaultValue: 'en') as String; // 'en' | 'hi'
  static set language(String v) => _box.put('language', v);

  static bool get notifications => _box.get('notifications', defaultValue: true) as bool;
  static set notifications(bool v) => _box.put('notifications', v);

  static String get voice => _box.get('voice', defaultValue: 'hi') as String; // 'hi' | 'en'
  static set voice(String v) => _box.put('voice', v);
}


