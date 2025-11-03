import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/forecast_cache.dart';

class MiniChart extends StatelessWidget {
  final List<DailyForecast> forecasts;

  const MiniChart({super.key, required this.forecasts});

  @override
  Widget build(BuildContext context) {
    if (forecasts.isEmpty) {
      return const Center(child: Text('No data'));
    }

    return LineChart(
      LineChartData(
        gridData: const FlGridData(show: false),
        titlesData: const FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: forecasts.asMap().entries.map((entry) {
              final day = entry.key;
              final forecast = entry.value;
              return FlSpot(day.toDouble(), forecast.tempMax);
            }).toList(),
            isCurved: true,
            color: const Color(0xFF2E7D32),
            barWidth: 3,
            dotData: const FlDotData(show: true),
          ),
        ],
        minX: 0,
        maxX: (forecasts.length - 1).toDouble(),
        minY: forecasts.map((f) => f.tempMin).reduce((a, b) => a < b ? a : b) - 5,
        maxY: forecasts.map((f) => f.tempMax).reduce((a, b) => a > b ? a : b) + 5,
      ),
    );
  }
}

