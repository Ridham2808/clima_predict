import 'package:flutter/material.dart';
import '../services/settings_service.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});
  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _formKey = GlobalKey<FormState>();
  String _village = 'Anand';
  String _crop = 'Wheat';
  String _language = SettingsService.language;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Welcome to ClimaPredict', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _village,
                  dropdownColor: const Color(0xFF121212),
                  items: const [
                    DropdownMenuItem(value: 'Anand', child: Text('Anand')),
                    DropdownMenuItem(value: 'Umreth', child: Text('Umreth')),
                    DropdownMenuItem(value: 'Petlad', child: Text('Petlad')),
                  ],
                  onChanged: (v) => setState(() => _village = v ?? 'Anand'),
                  decoration: const InputDecoration(labelText: 'Village', labelStyle: TextStyle(color: Colors.white70)),
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _crop,
                  dropdownColor: const Color(0xFF121212),
                  items: const [
                    DropdownMenuItem(value: 'Wheat', child: Text('Wheat')),
                    DropdownMenuItem(value: 'Paddy', child: Text('Paddy')),
                    DropdownMenuItem(value: 'Cotton', child: Text('Cotton')),
                  ],
                  onChanged: (v) => setState(() => _crop = v ?? 'Wheat'),
                  decoration: const InputDecoration(labelText: 'Crop', labelStyle: TextStyle(color: Colors.white70)),
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _language,
                  dropdownColor: const Color(0xFF121212),
                  items: const [
                    DropdownMenuItem(value: 'en', child: Text('English')),
                    DropdownMenuItem(value: 'hi', child: Text('हिंदी')),
                  ],
                  onChanged: (v) => setState(() => _language = v ?? 'en'),
                  decoration: const InputDecoration(labelText: 'Language', labelStyle: TextStyle(color: Colors.white70)),
                  style: const TextStyle(color: Colors.white),
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: () {
                    SettingsService.language = _language;
                    // village/crop can be stored where needed; keep lightweight here
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  child: const Text('Continue'),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}


