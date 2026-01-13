'use client';

import Link from 'next/link';
import { farmingRecommendations } from '@/data/staticData';
import {
  NavArrowRight,
  OrganicFood,
  Leaf,
  WarningTriangle,
  CloudSunny,
  Pin,
  CheckCircle
} from 'iconoir-react';

export default function FarmingRecommendations() {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF6B35';
      case 'Medium': return '#FFC857';
      case 'Low': return '#4D9FFF';
      default: return '#B0B0B0';
    }
  };

  return (
    <div className="min-h-screen text-white pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Agronomic Strategies</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Contextual recommendations based on current climatic vectors</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farmingRecommendations.map((rec, index) => {
            const priorityColor = getPriorityColor(rec.priority);
            return (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full -mr-10 -mt-10`} style={{ backgroundColor: priorityColor }} />

                <div className="flex items-start gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    {rec.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{rec.category}</span>
                      <div className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5 shadow-lg" style={{ color: priorityColor, backgroundColor: `${priorityColor}11` }}>
                        {rec.priority} Priority
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-white uppercase mb-3 leading-tight group-hover:text-[#00D09C] transition-colors">{rec.title}</h3>
                    <p className="text-sm text-white/40 font-medium leading-relaxed mb-6">{rec.description}</p>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#00D09C] uppercase tracking-widest">
                        <CheckCircle width={14} height={14} />
                        Verified Strategy
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Implementation Guide</button>
                    </div>
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
