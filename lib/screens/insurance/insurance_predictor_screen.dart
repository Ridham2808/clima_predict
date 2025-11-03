import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import '../../models/farmer_profile.dart';
import '../../models/insurance_claim.dart';
import '../../models/forecast_cache.dart';
import '../../services/database_service.dart';
import '../../services/api_service.dart';

class InsurancePredictorScreen extends StatefulWidget {
  const InsurancePredictorScreen({super.key});

  @override
  State<InsurancePredictorScreen> createState() => _InsurancePredictorScreenState();
}

class _InsurancePredictorScreenState extends State<InsurancePredictorScreen> {
  FarmerProfile? _profile;
  ForecastCache? _forecast;
  InsuranceClaimEstimate? _claimEstimate;
  double _areaHectares = 1.0;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final profile = DatabaseService.getFarmerProfile();
    setState(() {
      _profile = profile;
    });

    if (profile != null) {
      final forecast = DatabaseService.getLatestForecastForVillage(profile.village);
      setState(() {
        _forecast = forecast;
      });

      await _calculateClaimEstimate();
    }
  }

  Future<void> _calculateClaimEstimate() async {
    if (_profile == null || _forecast == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Calculate average risk score
      final avgRisk = _forecast!.dailyForecasts
              .map((f) => f.riskScore)
              .reduce((a, b) => a + b) /
          _forecast!.dailyForecasts.length;

      // Estimate loss probability
      final lossProbability = avgRisk.clamp(0.0, 1.0);

      // Calculate estimated loss value (simplified)
      // In production, use crop price per hectare
      const cropPricePerHectare = 50000.0; // Default for wheat/rice
      final estimatedLoss = lossProbability * cropPricePerHectare * _areaHectares;

      // Get from API if available
      InsuranceClaimEstimate? apiEstimate;
      try {
        final apiService = ApiService();
        apiEstimate = await apiService.getClaimEstimate(
          village: _profile!.village,
          crop: _profile!.crops.first,
          forecastWindow: 7,
          areaHectares: _areaHectares,
        );
      } catch (e) {
        print('API error: $e');
      }

      final estimate = apiEstimate ??
          InsuranceClaimEstimate(
            recordId: DateTime.now().millisecondsSinceEpoch.toString(),
            village: _profile!.village,
            crop: _profile!.crops.first,
            forecastedLossProbability: lossProbability,
            estimatedLossValue: estimatedLoss,
            recommendedAction: 'file_pm-fby_claim',
            timestamp: DateTime.now(),
          );

      setState(() {
        _claimEstimate = estimate;
        _isLoading = false;
      });

      await DatabaseService.saveInsuranceClaim(estimate);
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _downloadClaimEvidence() async {
    if (_claimEstimate == null || _forecast == null) return;

    try {
      // Generate PDF content (simplified - in production use pdf package)
      final pdfContent = '''
ClimaPredict Insurance Claim Evidence
====================================

Village: ${_claimEstimate!.village}
Crop: ${_claimEstimate!.crop}
Date: ${_claimEstimate!.timestamp.toIso8601String()}

Forecasted Loss Probability: ${(_claimEstimate!.forecastedLossProbability * 100).toStringAsFixed(1)}%
Estimated Loss Value: ₹${_claimEstimate!.estimatedLossValue.toStringAsFixed(2)}
Area: $_areaHectares hectares

Recommended Action: ${_claimEstimate!.recommendedAction}

Forecast Data:
${_forecast!.dailyForecasts.map((f) => 
  '${f.date}: Temp ${f.tempMin.round()}-${f.tempMax.round()}°C, '
  'Rain ${(f.precipProb * 100).round()}%, Risk ${(f.riskScore * 100).round()}%'
).join('\n')}

Model Version: ${_forecast!.modelVersion}
Generated At: ${_forecast!.generatedAt.toIso8601String()}
''';

      // Save to file
      final directory = await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/claim_evidence_${_claimEstimate!.recordId}.txt');
      await file.writeAsString(pdfContent);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Claim evidence saved to ${file.path}'),
            action: SnackBarAction(
              label: 'OK',
              onPressed: () {},
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating evidence: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Crop Insurance Predictor'),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                // Area input
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Farm Area (Hectares)',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Slider(
                          value: _areaHectares,
                          min: 0.1,
                          max: 10.0,
                          divisions: 99,
                          label: '$_areaHectares hectares',
                          onChanged: (value) {
                            setState(() {
                              _areaHectares = value;
                            });
                            _calculateClaimEstimate();
                          },
                        ),
                        Text(
                          '${_areaHectares.toStringAsFixed(2)} hectares',
                          style: const TextStyle(fontSize: 18),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Claim estimate
                if (_claimEstimate != null) ...[
                  Card(
                    color: _claimEstimate!.forecastedLossProbability > 0.5
                        ? Colors.red.shade50
                        : Colors.orange.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Estimated Loss',
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                          const SizedBox(height: 16),
                          _buildStatRow(
                            'Loss Probability',
                            '${(_claimEstimate!.forecastedLossProbability * 100).toStringAsFixed(1)}%',
                          ),
                          const Divider(),
                          _buildStatRow(
                            'Estimated Loss Value',
                            '₹${_claimEstimate!.estimatedLossValue.toStringAsFixed(2)}',
                          ),
                          const Divider(),
                          _buildStatRow(
                            'Recommended Action',
                            _claimEstimate!.recommendedAction.replaceAll('_', ' ').toUpperCase(),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _downloadClaimEvidence,
                    icon: const Icon(Icons.download),
                    label: const Text('Download Claim Evidence PDF'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E7D32),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 48),
                    ),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton.icon(
                    onPressed: () {
                      // Mock file claim flow
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('File Claim flow (mock) - Would open PMFBY portal'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.description),
                    label: const Text('File Claim (PMFBY)'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 48),
                    ),
                  ),
                ] else
                  const Card(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Center(child: Text('No estimate available')),
                    ),
                  ),
              ],
            ),
    );
  }

  Widget _buildStatRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

