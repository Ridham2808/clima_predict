'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  NavArrowRight,
  CloudSunny,
  Rain,
  SunLight,
  Droplet,
  Wind,
  Calendar,
  Pin,
  ModernTv
} from 'iconoir-react';

import { weatherService } from '@/services/weatherService';
import { useActiveLocation } from '@/hooks/useActiveLocation';

export default function Forecast() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeLocation } = useActiveLocation();

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      const res = await weatherService.getForecast(activeLocation);
      if (res.success) {
        setForecastData(res.data);
      }
      setLoading(false);
    };
    fetchForecast();
  }, [activeLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-[#00D09C] blur-[100px] opacity-20 animate-pulse" />
          <div className="relative bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl">
            <Calendar width={64} height={64} className="text-[#00D09C] animate-bounce" />
          </div>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Processing Time-Series</h2>
        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Synchronizing meteorological models…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-32 md:pb-12 uppercase">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center justify-between gap-4 md:mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
              <NavArrowRight className="rotate-180" width={20} height={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Weekly Outlook</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">7-day high-resolution projection matrix</p>
            </div>
          </div>
          <Link href="/hourly-forecast" className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
            <ModernTv width={24} height={24} className="text-[#00D09C] group-hover:scale-110 transition-transform" />
          </Link>
        </header>

        <main className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 ml-1">Timeline</h2>
              <div className="grid grid-cols-1 gap-4">
                {forecastData.map((forecast, index) => {
                  const isSelected = selectedDayIndex === index;
                  // Handle icon which might be a string from API or component from static
                  const Icon = typeof forecast.icon === 'string' ? (forecast.icon.includes('Cloud') ? CloudSunny : forecast.icon.includes('Rain') ? Rain : SunLight) : (forecast.icon || SunLight);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDayIndex(index)}
                      className={`relative flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden text-left group/day ${isSelected
                        ? 'bg-white/10 border-white/20 shadow-2xl shadow-[#00D09C]/10 scale-[1.02] z-10'
                        : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10 opacity-60 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                    >
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D09C]/5 to-transparent animate-[shimmer_2s_infinite]" />
                          <div className="absolute inset-0 bg-[#00D09C]/5 rounded-[2rem]" />
                        </>
                      )}
                      <div className="flex items-center gap-5 relative z-10">
                        <div className={`p-4 rounded-2xl border transition-all duration-300 ${isSelected ? 'bg-white/10 border-white/20 scale-110' : 'bg-white/5 border-white/5 group-hover/day:bg-white/10'}`} style={{ color: forecast.color || '#00D09C' }}>
                          <Icon width={24} height={24} className="group-hover/day:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <div className="text-lg font-black text-white">{forecast.day}</div>
                          <div className="text-[10px] font-bold text-white/30 tracking-widest">{forecast.date}</div>
                        </div>
                      </div>
                      <div className="text-right relative z-10">
                        <div className="text-2xl font-black text-white">{forecast.tempMax}°</div>
                        <div className="text-xs font-bold text-white/20">{forecast.tempMin}°</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 lg:sticky lg:top-8 order-1 lg:order-2">
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 ml-1">Vector Analysis</h2>
              <div className="bg-gradient-to-br from-[#00D09C] via-[#00D09C] to-[#4D9FFF] rounded-[3rem] p-10 shadow-2xl shadow-[#00D09C]/30 relative overflow-hidden group hover:shadow-[#00D09C]/40 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4D9FFF]/20 rounded-full -ml-24 -mb-24 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="text-sm font-black text-[#0D0D0D]/40 uppercase tracking-[0.2em] mb-2">Detailed Outlook</div>
                      <h3 className="text-4xl font-black text-[#0D0D0D] tracking-tighter group-hover:scale-105 transition-transform duration-300">{forecastData[selectedDayIndex]?.day}</h3>
                      <div className="text-xs font-black text-[#0D0D0D]/60 tracking-widest mt-1">{forecastData[selectedDayIndex]?.date}</div>
                    </div>
                    <div className="bg-white/30 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/30 shadow-2xl group-hover:scale-110 group-hover:bg-white/40 transition-all duration-300">
                      {(() => {
                        const forecast = forecastData[selectedDayIndex];
                        const Icon = typeof forecast?.icon === 'string' ? (forecast.icon.includes('Cloud') ? CloudSunny : forecast.icon.includes('Rain') ? Rain : SunLight) : (forecast?.icon || SunLight);
                        return <Icon width={48} height={48} className="text-white" />;
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Rain, label: 'Precip', value: `${forecastData[selectedDayIndex]?.precipitation}%` },
                      { icon: Wind, label: 'Velocity', value: `${forecastData[selectedDayIndex]?.windSpeed}km` },
                      { icon: Droplet, label: 'Saturation', value: `${forecastData[selectedDayIndex]?.humidity}%` }
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="bg-white/20 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center group/metric transition-all duration-300 hover:bg-white/30 hover:scale-105">
                          <Icon width={24} height={24} className="text-white mb-4 group-hover/metric:scale-110 transition-transform duration-300" />
                          <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{item.label}</div>
                          <div className="text-lg font-black text-white">{item.value}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-6 bg-[#0D0D0D] rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#00D09C]/10 rounded-xl flex items-center justify-center">
                        <Pin width={20} height={20} className="text-[#00D09C]" />
                      </div>
                      <div className="text-[10px] font-black text-[#00D09C] uppercase tracking-widest">Optimal Treatment Window</div>
                    </div>
                    <NavArrowRight width={16} height={16} className="text-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
