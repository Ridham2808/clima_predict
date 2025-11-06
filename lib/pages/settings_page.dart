import 'package:flutter/material.dart';
import '../services/settings_service.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});
  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _offline = SettingsService.offlineMode;
  bool _notifs = SettingsService.notifications;
  String _voice = SettingsService.voice;
  String _language = SettingsService.language;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(title: const Text('Settings'), backgroundColor: Colors.black),
      body: ListView(
        children: [
          SwitchListTile(
            value: _offline,
            onChanged: (v) => setState(() => _offline = v),
            title: const Text('Offline Mode', style: TextStyle(color: Colors.white)),
            subtitle: const Text('Force cached forecast loading', style: TextStyle(color: Colors.white54)),
          ),
          SwitchListTile(
            value: _notifs,
            onChanged: (v) => setState(() => _notifs = v),
            title: const Text('Notifications', style: TextStyle(color: Colors.white)),
          ),
          ListTile(
            title: const Text('Language', style: TextStyle(color: Colors.white)),
            trailing: DropdownButton<String>(
              value: _language,
              dropdownColor: const Color(0xFF121212),
              items: const [DropdownMenuItem(value: 'en', child: Text('English')), DropdownMenuItem(value: 'hi', child: Text('हिंदी'))],
              onChanged: (v) => setState(() => _language = v ?? 'en'),
            ),
          ),
          ListTile(
            title: const Text('Voice', style: TextStyle(color: Colors.white)),
            trailing: DropdownButton<String>(
              value: _voice,
              dropdownColor: const Color(0xFF121212),
              items: const [DropdownMenuItem(value: 'en', child: Text('English')), DropdownMenuItem(value: 'hi', child: Text('हिंदी'))],
              onChanged: (v) => setState(() => _voice = v ?? 'hi'),
            ),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton(
              onPressed: () {
                SettingsService.offlineMode = _offline;
                SettingsService.notifications = _notifs;
                SettingsService.language = _language;
                SettingsService.voice = _voice;
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Settings saved')));
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: const Text('Save Changes'),
            ),
          )
        ],
      ),
    );
  }
}


