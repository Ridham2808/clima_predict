import 'package:flutter/material.dart';
import 'services/database_service.dart';
import 'services/settings_service.dart';
import 'theme/app_theme.dart';
import 'screens/main_navigation.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await DatabaseService.init();
  await SettingsService.init();
  runApp(const ClimaPredictApp());
}

class ClimaPredictApp extends StatelessWidget {
  const ClimaPredictApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ClimaPredict',
      theme: AppTheme.darkTheme,
      debugShowCheckedModeBanner: false,
      home: const MainNavigation(),
    );
  }
}
