import '../models/forecast_output.dart';

class RecommendationService {
  List<String> buildTips({required ForecastOutput forecast, required String crop, String language = 'en'}) {
    final d = forecast.days.first;
    final rain = d.rainPct;
    final wind = d.windKmh;
    final soilProxy = (d.droughtRiskPct < 40) ? 'moist' : 'dry';

    final tipsEn = <String>[
      if (rain > 60) 'Avoid spraying today – high rain chance.' else 'Irrigate ${soilProxy == 'dry' ? '20L' : '10L'} today.',
      if (wind > 20) 'Avoid spraying today – high wind.' else 'Good day for planting in ${rain > 40 ? '3' : '1'} days.',
      'Fertilizer: micro-dose recommended for $crop.',
    ];

    final tipsHi = <String>[
      if (rain > 60) 'आज छिड़काव न करें — बारिश की संभावना अधिक है।' else 'आज ${soilProxy == 'dry' ? '20' : '10'} लीटर सिंचाई करें।',
      if (wind > 20) 'आज छिड़काव न करें — तेज हवा है।' else 'बोआई के लिए ${rain > 40 ? '3' : '1'} दिन में अच्छा समय।',
      'खाद: $crop के लिए माइक्रो-डोज़ की सलाह।',
    ];

    return language == 'hi' ? tipsHi : tipsEn;
  }
}


