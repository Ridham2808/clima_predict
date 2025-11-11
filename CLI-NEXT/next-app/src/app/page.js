'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import { weatherAlerts } from '@/data/staticData';
import { apiService } from '@/services/apiService';
import { weatherService } from '@/services/weatherService';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [airQuality, setAirQuality] = useState(null);

  useEffect(() => {
    // Check API health and fetch weather data
    const initializeData = async () => {
      setLoading(true);
      
      // Check backend API health
      const health = await apiService.checkHealth();
      setApiStatus(health.success ? 'connected' : 'disconnected');
      
      // Fetch real weather data
      const weather = await weatherService.getCurrentWeather();
      if (weather.success) {
        setWeatherData(weather.data);
        if (weather.data.airQuality) {
          setAirQuality({
            aqi: weather.data.airQuality.aqi * 20, // Convert 1-5 to 0-100 scale
            category: weather.data.airQuality.category,
            pm25: weather.data.airQuality.pm25,
            pm10: weather.data.airQuality.pm10,
            recommendation: getAQIRecommendation(weather.data.airQuality.aqi),
          });
        }
      }
      
      setLoading(false);
    };

    initializeData();
    
    // Refresh every 10 minutes
    const interval = setInterval(initializeData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getAQIRecommendation = (aqi) => {
    const recommendations = {
      1: 'Air quality is good. Enjoy outdoor activities.',
      2: 'Air quality is acceptable for most people.',
      3: 'Sensitive groups should limit outdoor activities',
      4: 'Everyone should limit outdoor activities',
      5: 'Avoid outdoor activities if possible',
    };
    return recommendations[aqi] || 'Check air quality before going outside';
  };

  const visibleAlerts = useMemo(() => weatherAlerts.slice(0, 2), []);

  if (loading) {
    return (
      <div className="min-h-screen text-white pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Premium Background */}
        <div className="fixed inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#141414] -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,208,156,0.1),transparent_70%)] -z-10 animate-pulse" />
        
        <div className="text-center relative z-10 px-6">
          <div className="relative inline-block mb-6">
            <div className="text-6xl animate-bounce">⛅</div>
            <div className="absolute inset-0 blur-2xl bg-[#00D09C]/30 animate-pulse" />
          </div>
          <div className="text-xl font-semibold text-white mb-2 tracking-tight">Loading weather data</div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-[#00D09C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-[#00D09C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-[#00D09C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen text-white pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Premium Background */}
        <div className="fixed inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#141414] -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.08),transparent_70%)] -z-10" />
        
        <div className="max-w-md mx-auto px-6">
          <div className="glass-card rounded-3xl p-8 text-center shadow-premium">
            <div className="relative inline-block mb-6">
              <div className="text-6xl">⚠️</div>
              <div className="absolute inset-0 blur-2xl bg-[#FF6B35]/20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Unable to load data</h2>
            <p className="text-base text-[#ABABAB] mb-6 leading-relaxed">Please check your internet connection and try again</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-[#00D09C] to-[#00B88A] text-white px-6 py-3.5 rounded-2xl font-semibold tracking-tight transition-all duration-300 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] touch-manipulation"
            >
              Retry
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20 sm:pb-24">
      <div className="w-full max-w-md mx-auto px-4 sm:px-5">
        {/* Header */}
        <header className="pt-5 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">ClimaPredict</h1>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#00D09C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[#ABABAB]">{weatherData.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/alerts" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>
              <Link href="/settings" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Weather Card */}
        <div className="mt-6 mb-6">
          <Link href="/weather-details" className="block">
            <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,208,156,0.3)] hover:shadow-[0_12px_48px_rgba(0,208,156,0.4)] transition-all duration-300">
              <div className="text-center">
                <div className="text-7xl font-bold text-white mb-2">
                  {weatherData.temperature}°
                </div>
                <div className="text-2xl text-white mb-2">{weatherData.condition}</div>
                <div className="text-base text-white/80 mb-6">
                  Feels like {weatherData.feelsLike}°
                </div>
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="text-2xl mb-2">💧</div>
                    <div className="text-base font-semibold text-white">{weatherData.humidity}%</div>
                    <div className="text-xs text-white/70">Humidity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💨</div>
                    <div className="text-base font-semibold text-white">{weatherData.windSpeed} km/h</div>
                    <div className="text-xs text-white/70">Wind</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">👁️</div>
                    <div className="text-base font-semibold text-white">{weatherData.visibility} km</div>
                    <div className="text-xs text-white/70">Visibility</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/weather-map" className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#4D9FFF]/20 hover:border-[#4D9FFF]/40 transition-all">
              <div className="bg-[#4D9FFF]/10 rounded-xl p-3 w-fit mb-3">
                <span className="text-3xl">🗺️</span>
              </div>
              <div className="text-base font-semibold text-white">Weather Map</div>
            </Link>
            <Link href="/sensors" className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/40 transition-all">
              <div className="bg-[#9D4EDD]/10 rounded-xl p-3 w-fit mb-3">
                <span className="text-3xl">📡</span>
              </div>
              <div className="text-base font-semibold text-white">Sensors</div>
            </Link>
            <Link href="/alerts" className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all">
              <div className="bg-[#FF6B35]/10 rounded-xl p-3 w-fit mb-3">
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="text-base font-semibold text-white">Alerts</div>
            </Link>
            <Link href="/backend-test" className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#FFC857]/20 hover:border-[#FFC857]/40 transition-all">
              <div className="bg-[#FFC857]/10 rounded-xl p-3 w-fit mb-3">
                <span className="text-3xl">🔌</span>
              </div>
              <div className="text-base font-semibold text-white">Backend</div>
            </Link>
          </div>
        </div>

        {/* Active Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {visibleAlerts.map((alert, index) => (
                <Link key={index} href="/alerts" className="block bg-[#1C1C1E] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl p-3" style={{ backgroundColor: `${alert.color}20` }}>
                      <span className="text-2xl">{alert.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white mb-1">{alert.title}</div>
                      <div className="text-sm text-[#ABABAB] line-clamp-2">{alert.description}</div>
                    </div>
                    <svg className="w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Air Quality */}
        {airQuality && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Air Quality</h2>
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-xs text-[#ABABAB] mb-1">AQI</div>
                  <div className="text-5xl font-bold text-[#FFC857]">{airQuality.aqi}</div>
                  <div className="text-sm text-white font-medium mt-1">{airQuality.category}</div>
                </div>
                <div className="bg-[#FFC857]/10 rounded-full p-4">
                  <svg className="w-12 h-12 text-[#FFC857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-[#ABABAB]">{airQuality.recommendation}</div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
