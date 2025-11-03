import 'package:flutter/material.dart';
import '../models/forecast_cache.dart';

class ForecastCard extends StatelessWidget {
  final DailyForecast forecast;

  const ForecastCard({super.key, required this.forecast});

  String _getDayName(String date) {
    final parsed = DateTime.parse(date);
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekdays[parsed.weekday - 1];
  }

  String _getRiskText(double riskScore) {
    if (riskScore < 0.3) return 'Low Risk';
    if (riskScore < 0.6) return 'Moderate Risk';
    return 'High Risk';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${_getDayName(forecast.date)} ${forecast.date}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  _getRiskText(forecast.riskScore),
                  style: TextStyle(
                    color: forecast.riskScore < 0.3
                        ? Colors.green
                        : forecast.riskScore < 0.6
                            ? Colors.orange
                            : Colors.red,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildInfoItem('Temp', '${forecast.tempMin.round()}°/${forecast.tempMax.round()}°C'),
                _buildInfoItem('Wind', '${forecast.windKmh.round()} km/h'),
                _buildInfoItem('Rain', '${(forecast.precipProb * 100).round()}%'),
                _buildInfoItem('Humidity', '${forecast.humidity}%'),
              ],
            ),
            if (forecast.explanations.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                forecast.explanations,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
      ],
    );
  }
}

