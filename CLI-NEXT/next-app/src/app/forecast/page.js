'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';

// Mock forecast data
const mockForecastData = [
  { day: 'Today', date: 'Nov 12', icon: '⛅', tempMax: 28, tempMin: 22, precipitation: 20, windSpeed: 12, humidity: 65 },
  { day: 'Tomorrow', date: 'Nov 13', icon: '🌤️', tempMax: 30, tempMin: 23, precipitation: 10, windSpeed: 15, humidity: 60 },
  { day: 'Wednesday', date: 'Nov 14', icon: '☀️', tempMax: 32, tempMin: 24, precipitation: 5, windSpeed: 10, humidity: 55 },
  { day: 'Thursday', date: 'Nov 15', icon: '🌧️', tempMax: 26, tempMin: 21, precipitation: 80, windSpeed: 20, humidity: 75 },
  { day: 'Friday', date: 'Nov 16', icon: '⛈️', tempMax: 25, tempMin: 20, precipitation: 90, windSpeed: 25, humidity: 80 },
  { day: 'Saturday', date: 'Nov 17', icon: '🌤️', tempMax: 29, tempMin: 22, precipitation: 15, windSpeed: 12, humidity: 62 },
  { day: 'Sunday', date: 'Nov 18', icon: '☀️', tempMax: 31, tempMin: 23, precipitation: 5, windSpeed: 10, humidity: 58 },
];

export default function Forecast() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [forecastData, setForecastData] = useState(mockForecastData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4 animate-pulse">📅</div>
          <div className="text-xl font-semibold mb-3">Loading forecast...</div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">7-Day Forecast</h1>
              <p className="text-xs sm:text-sm text-white/60 mt-0.5">Weather predictions</p>
            </div>
            <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors active:scale-95">
              <span className="text-xl sm:text-2xl">🕐</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-3 sm:space-y-4">
          {forecastData.map((forecast, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedDayIndex(index)}
                className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-transparent shadow-2xl shadow-purple-500/20'
                    : 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-lg sm:text-xl font-bold mb-1">
                      {forecast.day}
                    </div>
                    <div className={`text-xs sm:text-sm ${isSelected ? 'text-white/80' : 'text-white/60'}`}>
                      {forecast.date}
                    </div>
                  </div>
                  <span className="text-4xl sm:text-5xl mx-4">{forecast.icon}</span>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {forecast.tempMax}°
                    </div>
                    <div className={`text-base sm:text-lg ${isSelected ? 'text-white/70' : 'text-white/60'}`}>
                      {forecast.tempMin}°
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <>
                    <div className="border-t border-white/20 my-4"></div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">💧</div>
                        <div className="text-base sm:text-lg font-semibold">{forecast.precipitation}%</div>
                        <div className="text-xs text-white/70">Rain</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">💨</div>
                        <div className="text-base sm:text-lg font-semibold">{forecast.windSpeed}</div>
                        <div className="text-xs text-white/70">km/h</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-2xl mb-2">💦</div>
                        <div className="text-base sm:text-lg font-semibold">{forecast.humidity}%</div>
                        <div className="text-xs text-white/70">Humidity</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
