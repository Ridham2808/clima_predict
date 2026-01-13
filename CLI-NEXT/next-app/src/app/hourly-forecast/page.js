'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { weatherService } from '@/services/weatherService';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import {
  NavArrowRight,
  SunLight,
  HalfMoon,
  Cloud,
  Rain,
  Wind,
  Droplet,
  Pin,
  Calendar,
  ModernTv,
  WarningTriangle
} from 'iconoir-react';

export default function HourlyForecast() {
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activeLocation } = useActiveLocation();

  useEffect(() => {
    const fetchHourly = async () => {
      setLoading(true);
      const result = await weatherService.getHourlyForecast(activeLocation);
      if (result.success) {
        setHourlyData(result.data);
      }
      setLoading(false);
    };

    fetchHourly();
    const interval = setInterval(fetchHourly, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-[#4D9FFF] blur-[100px] opacity-20 animate-pulse" />
          <div className="relative bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl">
            <ModernTv width={64} height={64} className="text-[#4D9FFF] animate-bounce" />
          </div>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Polling Spectral Sensors</h2>
        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Downloading high-cadence atmospheric slices…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-12 uppercase">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/forecast" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Chrono Projections</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">24-hour high-cadence meteorological vector analysis</p>
          </div>
        </header>

        {!hourlyData || hourlyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-red-500/10 p-10 rounded-[3rem] border border-red-500/20 mb-8">
              <WarningTriangle width={64} height={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Telemetry Disrupted</h2>
            <p className="text-white/20 text-xs font-bold tracking-widest uppercase">Unable to establish connection with local weather stations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hourlyData.map((hour, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="text-xl font-black text-white/30 w-16">{hour.hour}</div>
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{hour.icon}</div>
                  <div>
                    <div className="text-xl font-black text-white mb-2">{hour.condition}</div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 tracking-widest">
                      <div className="flex items-center gap-1"><Rain width={12} height={12} /> {hour.precipitation}%</div>
                      <div className="flex items-center gap-1"><Wind width={12} height={12} /> {hour.windSpeed}km</div>
                      <div className="flex items-center gap-1"><Droplet width={12} height={12} /> {hour.humidity}%</div>
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-black text-[#00D09C]">{hour.temp}°</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
