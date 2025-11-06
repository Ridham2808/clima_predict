import 'package:flutter/material.dart';
import '../services/database_service.dart';
import '../models/farmer_profile.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _name;
  late TextEditingController _village;
  String _crop = 'Wheat';

  @override
  void initState() {
    super.initState();
    final p = DatabaseService.getFarmerProfile();
    _name = TextEditingController(text: p?.name ?? '');
    _village = TextEditingController(text: p?.village ?? 'Anand');
    _crop = (p?.crops.isNotEmpty == true ? p!.crops.first : 'Wheat');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(title: const Text('Profile'), backgroundColor: Colors.black),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _name,
                decoration: const InputDecoration(labelText: 'Name'),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _village,
                decoration: const InputDecoration(labelText: 'Village'),
                style: const TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                initialValue: _crop,
                dropdownColor: const Color(0xFF121212),
                items: const [
                  DropdownMenuItem(value: 'Wheat', child: Text('Wheat')),
                  DropdownMenuItem(value: 'Paddy', child: Text('Paddy')),
                  DropdownMenuItem(value: 'Cotton', child: Text('Cotton')),
                ],
                onChanged: (v) => setState(() => _crop = v ?? 'Wheat'),
                decoration: const InputDecoration(labelText: 'Crop'),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () async {
                  final profile = FarmerProfile(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    name: _name.text,
                    village: _village.text,
                    block: '',
                    district: 'Anand',
                    state: 'Gujarat',
                    crops: [_crop],
                    language: 'hi',
                    createdAt: DateTime.now(),
                  );
                  await DatabaseService.saveFarmerProfile(profile);
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile Updated Successfully')));
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                child: const Text('Save Changes'),
              )
            ],
          ),
        ),
      ),
    );
  }
}


