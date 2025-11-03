import 'package:flutter/material.dart';
import '../../models/farmer_profile.dart';
import '../../services/database_service.dart';
import '../../services/ml_service.dart';

class RecommendationsScreen extends StatefulWidget {
  const RecommendationsScreen({super.key});

  @override
  State<RecommendationsScreen> createState() => _RecommendationsScreenState();
}

class _RecommendationsScreenState extends State<RecommendationsScreen> {
  FarmerProfile? _profile;
  List<Recommendation> _recommendations = [];

  @override
  void initState() {
    super.initState();
    _loadProfile();
    _generateRecommendations();
  }

  void _loadProfile() {
    final profile = DatabaseService.getFarmerProfile();
    setState(() {
      _profile = profile;
    });
  }

  void _generateRecommendations() {
    // Generate AI recommendations based on forecast and profile
    _recommendations = [
      Recommendation(
        text: 'Irrigate 20L today (Rain forecast)',
        accuracy: 72,
        explanation:
            'Based on low precipitation forecast and current soil moisture levels.',
        voiceText: 'आज 20 लीटर सिंचाई करें। बारिश की संभावना कम है।',
      ),
      Recommendation(
        text: 'Do NOT apply fertilizer in next 24 hrs',
        accuracy: 85,
        explanation: 'High precipitation probability (>60%) expected tomorrow.',
        voiceText: 'अगले 24 घंटों में उर्वरक न डालें।',
      ),
      Recommendation(
        text: 'Plant wheat seeds in next 3 days',
        accuracy: 68,
        explanation: 'Optimal weather conditions for wheat planting.',
        voiceText: 'अगले 3 दिनों में गेहूं के बीज बोएं।',
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Recommendations'),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: _profile == null
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              children: [
                // Farmer profile summary
                Card(
                  margin: const EdgeInsets.all(16),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Farmer profile summary',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text('Name: ${_profile!.name}'),
                        Text('Crops: ${_profile!.crops.join(", ")}'),
                        Text('Location: ${_profile!.village}, ${_profile!.state}'),
                      ],
                    ),
                  ),
                ),
                // AI Tips list
                const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'AI Tips',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                ..._recommendations.map((rec) => RecommendationCard(
                      recommendation: rec,
                      language: _profile!.language,
                    )),
                // Load More button
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ElevatedButton(
                    onPressed: () {
                      // Load more recommendations
                      setState(() {
                        _generateRecommendations();
                      });
                    },
                    child: const Text('Load More'),
                  ),
                ),
              ],
            ),
    );
  }
}

class Recommendation {
  final String text;
  final int accuracy;
  final String explanation;
  final String voiceText;

  Recommendation({
    required this.text,
    required this.accuracy,
    required this.explanation,
    required this.voiceText,
  });
}

class RecommendationCard extends StatelessWidget {
  final Recommendation recommendation;
  final String language;

  const RecommendationCard({
    super.key,
    required this.recommendation,
    required this.language,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              recommendation.text,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Accuracy: ${recommendation.accuracy}%',
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Learn More'),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(recommendation.explanation),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () {
                            // Play voice explanation
                            // Implementation would use flutter_tts
                          },
                          icon: const Icon(Icons.volume_up),
                          label: Text(language == 'hi' 
                              ? 'हिंदी में सुनें'
                              : 'Listen in English'),
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Learn More'),
            ),
          ],
        ),
      ),
    );
  }
}

