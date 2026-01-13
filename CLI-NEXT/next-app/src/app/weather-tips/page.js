'use client';

import Link from 'next/link';
import { weatherTips } from '@/data/staticData';
import {
  NavArrowRight,
  LightBulb,
  CloudSunny,
  OrganicFood,
  Pin
} from 'iconoir-react';

export default function WeatherTips() {
  return (
    <div className="min-h-screen text-white pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Meteorological Intelligence</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Strategic insights for climate-resilient agriculture</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherTips.map((tip, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D09C]/10 blur-3xl rounded-full -mr-10 -mt-10" />

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">
                  {tip.icon}
                </div>

                <h3 className="text-xl font-black text-white uppercase mb-3 leading-tight group-hover:text-[#00D09C] transition-colors">{tip.title}</h3>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">{tip.category}</div>

                <p className="text-sm text-white/40 font-medium leading-relaxed mb-8">{tip.description}</p>

                <div className="w-full pt-8 border-t border-white/5">
                  <button className="flex items-center justify-center gap-2 w-full text-[10px] font-black uppercase tracking-widest text-[#00D09C] group-hover:text-white transition-colors">
                    <LightBulb width={16} height={16} />
                    Detailed Analysis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
