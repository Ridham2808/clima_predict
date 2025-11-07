import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../data/static_data.dart';
import '../hourly/hourly_forecast_screen.dart';

class ForecastScreenNew extends StatefulWidget {
  const ForecastScreenNew({super.key});

  @override
  State<ForecastScreenNew> createState() => _ForecastScreenNewState();
}

class _ForecastScreenNewState extends State<ForecastScreenNew> {
  int _selectedDayIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '7-Day Forecast',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    IconButton(
                      icon: const Icon(Icons.access_time),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const HourlyForecastScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            // Weekly Forecast Cards
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final forecast = StaticData.weeklyForecast[index];
                  final isSelected = _selectedDayIndex == index;

                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedDayIndex = index;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 8,
                      ),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: isSelected
                            ? AppTheme.primaryGradient
                            : null,
                        color: isSelected ? null : AppTheme.cardBlack,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSelected
                              ? Colors.transparent
                              : AppTheme.divider,
                          width: 1,
                        ),
                        boxShadow: isSelected ? AppTheme.glowShadow : null,
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      forecast['day'],
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: isSelected
                                            ? Colors.white
                                            : AppTheme.textPrimary,
                                      ),
                                    ),
                                    Text(
                                      forecast['date'],
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isSelected
                                            ? Colors.white.withValues(alpha: 0.8)
                                            : AppTheme.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                forecast['icon'],
                                style: const TextStyle(fontSize: 48),
                              ),
                              const SizedBox(width: 16),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    '${forecast['tempMax']}°',
                                    style: TextStyle(
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                      color: isSelected
                                          ? Colors.white
                                          : AppTheme.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    '${forecast['tempMin']}°',
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: isSelected
                                          ? Colors.white.withValues(alpha: 0.7)
                                          : AppTheme.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          if (isSelected) ...[
                            const SizedBox(height: 20),
                            const Divider(color: Colors.white24),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildDetailItem(
                                  '💧',
                                  '${forecast['precipitation']}%',
                                  'Rain',
                                  isSelected,
                                ),
                                _buildDetailItem(
                                  '💨',
                                  '${forecast['windSpeed']} km/h',
                                  'Wind',
                                  isSelected,
                                ),
                                _buildDetailItem(
                                  '💦',
                                  '${forecast['humidity']}%',
                                  'Humidity',
                                  isSelected,
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),
                    ),
                  );
                },
                childCount: StaticData.weeklyForecast.length,
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(
    String emoji,
    String value,
    String label,
    bool isSelected,
  ) {
    return Column(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 24)),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : AppTheme.textPrimary,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isSelected
                ? Colors.white.withValues(alpha: 0.7)
                : AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }
}
