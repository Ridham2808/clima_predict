'use client';

import Link from 'next/link';
import { weatherStats } from '@/data/staticData';
import {
  NavArrowRight,
  GraphUp,
  HalfMoon,
  SunLight,
  Cloud,
  Droplet,
  Wind,
  Rain,
  Pin
} from 'iconoir-react';

export default function WeatherStatistics() {
  const stats = [
    { label: 'Average Temperature', value: `${weatherStats.avgTemp}°C`, icon: SunLight, color: '#FF6B35' },
    { label: 'Maximum Temperature', value: `${weatherStats.maxTemp}°C`, icon: SunLight, color: '#FF6B35' },
    { label: 'Minimum Temperature', value: `${weatherStats.minTemp}°C`, icon: HalfMoon, color: '#4D9FFF' },
    { label: 'Total Rainfall', value: `${weatherStats.totalRainfall} mm`, icon: Rain, color: '#4D9FFF' },
    { label: 'Rainy Days', value: `${weatherStats.rainyDays}`, icon: Rain, color: '#4D9FFF' },
    { label: 'Sunny Days', value: `${weatherStats.sunnyDays}`, icon: SunLight, color: '#FFC857' },
    { label: 'Cloudy Days', value: `${weatherStats.cloudyDays}`, icon: Cloud, color: '#9D4EDD' },
    { label: 'Average Humidity', value: `${weatherStats.avgHumidity}%`, icon: Droplet, color: '#00D09C' },
    { label: 'Average Wind Speed', value: `${weatherStats.avgWindSpeed} km/h`, icon: Wind, color: '#9D4EDD' },
  ];

  return (
    <div className="min-h-screen text-white pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Atmospheric Analytics</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Aggregated historical metrics and long-term climatic trends</p>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 blur-2xl rounded-full -mr-8 -mt-8" style={{ backgroundColor: stat.color }} />

                <div className="flex flex-col items-center text-center">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>
                    <Icon width={32} height={32} />
                  </div>

                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 leading-tight min-h-[2.5em] flex items-center justify-center">
                    {stat.label}
                  </div>

                  <div className="text-3xl font-black tracking-tighter" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
