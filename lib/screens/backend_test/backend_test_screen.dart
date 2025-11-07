import 'package:flutter/material.dart';
import 'dart:async';
import '../../theme/app_theme.dart';
import '../../data/static_data.dart';
import 'package:http/http.dart' as http;

class BackendTestScreen extends StatefulWidget {
  const BackendTestScreen({super.key});

  @override
  State<BackendTestScreen> createState() => _BackendTestScreenState();
}

class _BackendTestScreenState extends State<BackendTestScreen> {
  bool _isTesting = false;
  String _overallStatus = 'Not Tested';
  List<Map<String, dynamic>> _endpointResults = [];
  int _totalResponseTime = 0;

  @override
  void initState() {
    super.initState();
    _initializeEndpoints();
  }

  void _initializeEndpoints() {
    _endpointResults = List.from(StaticData.backendTestData['endpoints']);
  }

  Future<void> _runTests() async {
    setState(() {
      _isTesting = true;
      _overallStatus = 'Testing...';
      _totalResponseTime = 0;
    });

    final baseUrl = StaticData.backendTestData['apiEndpoint'];
    int successCount = 0;

    for (int i = 0; i < _endpointResults.length; i++) {
      final endpoint = _endpointResults[i];
      final startTime = DateTime.now();

      try {
        // Simulate API call with timeout
        final response = await http
            .get(Uri.parse('$baseUrl${endpoint['url']}'))
            .timeout(const Duration(seconds: 5));

        final responseTime =
            DateTime.now().difference(startTime).inMilliseconds;
        _totalResponseTime += responseTime;

        setState(() {
          _endpointResults[i]['status'] =
              response.statusCode == 200 ? 'Success' : 'Failed';
          _endpointResults[i]['responseTime'] = responseTime;
          _endpointResults[i]['statusCode'] = response.statusCode;
        });

        if (response.statusCode == 200) successCount++;
      } catch (e) {
        setState(() {
          _endpointResults[i]['status'] = 'Failed';
          _endpointResults[i]['error'] = e.toString();
          _endpointResults[i]['responseTime'] = 0;
        });
      }

      // Add delay between requests
      await Future.delayed(const Duration(milliseconds: 500));
    }

    setState(() {
      _isTesting = false;
      if (successCount == _endpointResults.length) {
        _overallStatus = 'All Tests Passed ✅';
      } else if (successCount > 0) {
        _overallStatus = 'Partial Success ⚠️';
      } else {
        _overallStatus = 'All Tests Failed ❌';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Backend Connectivity Test'),
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Header Card
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: _overallStatus.contains('Passed')
                        ? AppTheme.primaryGradient
                        : _overallStatus.contains('Failed')
                            ? AppTheme.warningGradient
                            : AppTheme.secondaryGradient,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: AppTheme.cardShadow,
                  ),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.cloud_sync_rounded,
                        size: 64,
                        color: Colors.white,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _overallStatus,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      if (_totalResponseTime > 0) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Avg Response Time: ${(_totalResponseTime / _endpointResults.length).round()}ms',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white.withValues(alpha: 0.8),
                          ),
                        ),
                      ],
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isTesting ? null : _runTests,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppTheme.primaryBlack,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: _isTesting
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      AppTheme.primaryBlack,
                                    ),
                                  ),
                                )
                              : const Text(
                                  'Run Tests',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // API Endpoint
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'API Endpoint',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.cardBlack,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.link,
                            color: AppTheme.accentBlue,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              StaticData.backendTestData['apiEndpoint'],
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 24)),

            // Test Results
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Endpoint Tests',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 12)),

            // Endpoint Results
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final endpoint = _endpointResults[index];
                  final status = endpoint['status'] ?? 'Unknown';
                  Color statusColor;
                  IconData statusIcon;

                  if (status == 'Success') {
                    statusColor = AppTheme.accentGreen;
                    statusIcon = Icons.check_circle;
                  } else if (status == 'Failed') {
                    statusColor = AppTheme.accentOrange;
                    statusIcon = Icons.error;
                  } else {
                    statusColor = AppTheme.textTertiary;
                    statusIcon = Icons.help_outline;
                  }

                  return Container(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 6,
                    ),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.cardBlack,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: statusColor.withValues(alpha: 0.3),
                        width: 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(statusIcon, color: statusColor, size: 24),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    endpoint['name'],
                                    style:
                                        Theme.of(context).textTheme.titleMedium,
                                  ),
                                  Text(
                                    endpoint['url'],
                                    style:
                                        Theme.of(context).textTheme.bodySmall,
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: statusColor.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                status,
                                style: TextStyle(
                                  color: statusColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (endpoint['responseTime'] != null) ...[
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              const Icon(
                                Icons.timer,
                                size: 16,
                                color: AppTheme.textSecondary,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Response Time: ${endpoint['responseTime']}ms',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                              if (endpoint['statusCode'] != null) ...[
                                const SizedBox(width: 16),
                                Text(
                                  'Status: ${endpoint['statusCode']}',
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ],
                          ),
                        ],
                        if (endpoint['error'] != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            'Error: ${endpoint['error']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.accentOrange,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ],
                    ),
                  );
                },
                childCount: _endpointResults.length,
              ),
            ),

            // Info Section
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.accentBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.accentBlue.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.info_outline,
                        color: AppTheme.accentBlue,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'About Backend Testing',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppTheme.accentBlue,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'This feature tests connectivity to the backend API. If tests fail, the app will continue to work with static data. Backend integration is required for real-time weather updates and data synchronization.',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }
}
