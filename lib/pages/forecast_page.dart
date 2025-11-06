import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/forecast_controller.dart';
import '../services/recommendation_service.dart';
import '../services/settings_service.dart';
import '../utils/share_helper.dart';

class ForecastPage extends StatelessWidget {
  const ForecastPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ForecastController()..refresh(onWifi: !SettingsService.offlineMode),
      child: Consumer<ForecastController>(
        builder: (context, ctrl, _) {
          final theme = Theme.of(context);
          return Scaffold(
            backgroundColor: Colors.black,
            appBar: AppBar(
              backgroundColor: Colors.black,
              elevation: 0,
              title: Text(
                ctrl.current?.village ?? 'ClimaPredict',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: () => ctrl.refresh(onWifi: false),
                ),
              ],
            ),
            body: ctrl.loading && ctrl.current == null
                ? const Center(child: CircularProgressIndicator())
                : Column(
                    children: [
                      if (ctrl.showOfflineBanner)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                          color: Colors.amber.shade800,
                          child: const Text(
                            'Using Cached Forecast Data',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                          ),
                        ),
                      const SizedBox(height: 8),
                      if (ctrl.current != null)
                        _TodaySummaryTile(forecast: ctrl.current!),
                      const SizedBox(height: 8),
                      if (ctrl.current != null)
                        Expanded(
                          child: ListView.builder(
                            itemCount: ctrl.current!.days.length,
                            itemBuilder: (context, index) {
                              final d = ctrl.current!.days[index];
                              return _DayCard(
                                d: d,
                                onShare: () {
                                  final text = ShareHelper.buildShareText(ctrl.current!);
                                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Share: $text')));
                                },
                                onRate: (stars) async {
                                  await ctrl.rateForecast(stars: stars);
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Thanks for rating!')));
                                },
                              );
                            },
                          ),
                        ),
                      if (ctrl.current != null) _TipsSection(forecast: ctrl.current!),
                      const SizedBox(height: 8),
                      if (ctrl.current != null)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12.0),
                          child: Text(
                            'Powered by NASA MODIS & Local Sensors',
                            style: const TextStyle(color: Colors.white38, fontSize: 12),
                          ),
                        ),
                    ],
                  ),
          );
        },
      ),
    );
  }
}

class _TodaySummaryTile extends StatelessWidget {
  final ForecastOutput forecast;
  const _TodaySummaryTile({required this.forecast});

  @override
  Widget build(BuildContext context) {
    final d = forecast.days.first;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF1F1F1F), Color(0xFF0E0E0E)], begin: Alignment.topLeft, end: Alignment.bottomRight),
          borderRadius: BorderRadius.circular(16),
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.wb_sunny, color: Colors.white, size: 36),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${d.tempC.toStringAsFixed(1)}°C', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Rain ${d.rainPct}% · Wind ${d.windKmh.toStringAsFixed(0)} km/h · Humidity ${d.humidityPct}%', style: const TextStyle(color: Colors.white70)),
                ],
              ),
            ),
            _ConfidencePill(value: d.confidencePct),
          ],
        ),
      ),
    );
  }
}

class _DayCard extends StatelessWidget {
  final DailyForecastOutput d;
  final VoidCallback onShare;
  final ValueChanged<int> onRate;
  const _DayCard({required this.d, required this.onShare, required this.onRate});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF121212),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF1E1E1E)),
        ),
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${d.date.year}-${d.date.month.toString().padLeft(2, '0')}-${d.date.day.toString().padLeft(2, '0')}', style: const TextStyle(color: Colors.white70)),
                  const SizedBox(height: 6),
                  Text('${d.tempC.toStringAsFixed(1)}°C', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 2),
                  Text('Rain ${d.rainPct}% · Wind ${d.windKmh.toStringAsFixed(0)} km/h · Humidity ${d.humidityPct}%', style: const TextStyle(color: Colors.white60)),
                ],
              ),
            ),
            Column(
              children: [
                _RiskBadge(label: 'Flood', value: d.floodRiskPct),
                const SizedBox(height: 6),
                _RiskBadge(label: 'Drought', value: d.droughtRiskPct),
                const SizedBox(height: 6),
                Row(
                  children: [
                    IconButton(onPressed: onShare, icon: const Icon(Icons.share, color: Colors.white70)),
                    _RateStars(onRate: onRate),
                  ],
                )
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _RateStars extends StatefulWidget {
  final ValueChanged<int> onRate;
  const _RateStars({required this.onRate});
  @override
  State<_RateStars> createState() => _RateStarsState();
}

class _RateStarsState extends State<_RateStars> {
  int _hover = 0;
  @override
  Widget build(BuildContext context) {
    return Row(children: List.generate(5, (i) {
      final idx = i + 1;
      return IconButton(
        onPressed: () => widget.onRate(idx),
        icon: Icon(idx <= _hover ? Icons.star : Icons.star_border, color: Colors.amberAccent, size: 20),
        onHover: (h) => setState(() => _hover = h ? idx : 0),
      );
    }));
  }
}

class _TipsSection extends StatelessWidget {
  final ForecastOutput forecast;
  const _TipsSection({required this.forecast});
  @override
  Widget build(BuildContext context) {
    final tips = RecommendationService().buildTips(forecast: forecast, crop: 'Wheat', language: 'hi');
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('सुझाव', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          for (final t in tips)
            Padding(
              padding: const EdgeInsets.only(bottom: 6.0),
              child: Row(children: [
                const Icon(Icons.tips_and_updates, color: Colors.white70, size: 16),
                const SizedBox(width: 6),
                Expanded(child: Text(t, style: const TextStyle(color: Colors.white70))),
              ]),
            ),
        ],
      ),
    );
  }
}

class _ConfidencePill extends StatelessWidget {
  final int value;
  const _ConfidencePill({required this.value});
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(999)),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      child: Text('Conf ${value}%', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
    );
  }
}

class _RiskBadge extends StatelessWidget {
  final String label;
  final int value;
  const _RiskBadge({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    Color color;
    if (value > 70) {
      color = Colors.redAccent;
    } else if (value >= 30) {
      color = Colors.amberAccent;
    } else {
      color = Colors.greenAccent;
    }
    return Container(
      decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(8), border: Border.all(color: color.withOpacity(0.4))),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      child: Text('$label ${value}%', style: TextStyle(color: color, fontWeight: FontWeight.w700)),
    );
  }
}


