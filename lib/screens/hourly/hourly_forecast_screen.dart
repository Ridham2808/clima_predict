import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../data/static_data.dart';

class HourlyForecastScreen extends StatelessWidget {
  const HourlyForecastScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hourlyData = StaticData.hourlyForecast;

    return Scaffold(
      appBar: AppBar(
        title: const Text('24-Hour Forecast'),
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.access_time,
                        color: Colors.white,
                        size: 32,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Hourly Breakdown',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Next 24 hours weather forecast',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white70,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Hourly Cards
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final hour = hourlyData[index];
                  final isNow = index == 0;

                  return Container(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 6,
                    ),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isNow ? AppTheme.accentGreen.withValues(alpha: 0.1) : AppTheme.cardBlack,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isNow ? AppTheme.accentGreen : AppTheme.divider,
                        width: isNow ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        // Time
                        SizedBox(
                          width: 60,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                hour['hour'],
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: isNow ? AppTheme.accentGreen : AppTheme.textPrimary,
                                ),
                              ),
                              if (isNow)
                                const Text(
                                  'Now',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.accentGreen,
                                  ),
                                ),
                            ],
                          ),
                        ),

                        // Icon
                        Text(
                          hour['icon'],
                          style: const TextStyle(fontSize: 32),
                        ),

                        const SizedBox(width: 16),

                        // Temperature
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${hour['temp']}°C',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                hour['condition'],
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),

                        // Details
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Row(
                              children: [
                                const Icon(
                                  Icons.water_drop,
                                  size: 16,
                                  color: AppTheme.accentBlue,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${hour['precipitation']}%',
                                  style: const TextStyle(
                                    color: AppTheme.accentBlue,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(
                                  Icons.air,
                                  size: 16,
                                  color: AppTheme.textSecondary,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${hour['windSpeed']} km/h',
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
                childCount: hourlyData.length,
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }
}
