'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo } from 'react';

import {
  Map as MapIcon,
  NavArrowRight,
  Compass,
  Pin
} from 'iconoir-react';


const DynamicWeatherMap = dynamic(
  () => import('@/components/WeatherMap/WeatherMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 h-[400px] md:h-[600px] flex items-center justify-center border border-white/5 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="animate-spin text-5xl">🌍</div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest">Initialising global tiles…</p>
        </div>
      </div>
    ),
  }
);

export default function WeatherMap() {
  const infoCards = useMemo(
    () => [
      {
        title: 'How to use',
        description:
          'Toggle between multiple OpenWeatherMap layers, adjust opacity, or search for any city to inspect real-time conditions.',
        icon: Compass,
        color: '#00D09C'
      },
      {
        title: 'Interaction',
        description:
          'Click anywhere on the map to sample live weather data or enable “Use my location” for a personalised view.',
        icon: Pin,
        color: '#4D9FFF'
      },
    ],
    []
  );

  return (
    <div className="min-h-screen text-white pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        {/* Header */}
        <header className="pt-8 pb-4 flex items-center justify-between gap-4 md:mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
              <NavArrowRight className="rotate-180" width={20} height={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Visual Intelligence</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Satellite observation and multi-layer meteorological data</p>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00D09C]/10 to-[#4D9FFF]/10 rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <DynamicWeatherMap />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 flex gap-6 hover:bg-white/[0.08] transition-all"
              >
                <div className="p-4 bg-white/5 rounded-2xl h-fit" style={{ color: card.color }}>
                  <card.icon width={32} height={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-2 leading-none">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/40 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}


