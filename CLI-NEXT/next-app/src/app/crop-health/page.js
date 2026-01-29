'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import {
  NavArrowRight,
  OrganicFood,
  WarningTriangle,
  StatsUpSquare,
  Pin
} from 'iconoir-react';

export default function CropHealth() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCrops = async () => {
      const res = await apiService.getCrops();
      if (res.success) {
        setCrops(res.data);
      }
      setLoading(false);
    };
    fetchCrops();
  }, []);

  const getHealthColor = (health) => {
    if (health >= 85) return '#00D09C';
    if (health >= 70) return '#FFC857';
    return '#FF6B35';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white pb-32 md:pb-12">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
          <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
              <NavArrowRight className="rotate-180" width={20} height={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Biosphere Diagnostics</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Real-time health monitoring and physiological tracking</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin text-4xl mb-4">🌿</div>
                <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Decoding biosphere telemetry…</p>
              </div>
            ) : crops.length > 0 ? (
              crops.map((crop, index) => {
                const healthColor = getHealthColor(crop.health);
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <OrganicFood width={48} height={48} style={{ color: healthColor }} />
                        <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: healthColor }} />
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase mb-1">{crop.crop || crop.type}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                              <Pin width={12} height={12} />
                              {crop.area} • {crop.stage}
                            </div>
                          </div>
                          <div className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5" style={{ color: healthColor, backgroundColor: `${healthColor}11` }}>
                            {crop.status}
                          </div>
                        </div>

                        <div className="mb-8">
                          <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Vitality Index</span>
                            <span className="text-3xl font-black" style={{ color: healthColor }}>{crop.health}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 p-[1px]">
                            <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ width: `${crop.health}%`, backgroundColor: healthColor }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Expected Yield</div>
                            <div className="text-sm font-black text-white uppercase">{crop.expectedYield}</div>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Status</div>
                            <div className="text-sm font-black text-white uppercase">{crop.status}</div>
                          </div>
                        </div>

                        {crop.issues?.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-[#FF6B35] uppercase tracking-widest mb-3">
                              <WarningTriangle width={14} height={14} />
                              Anomalies Detected
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {crop.issues.map((issue, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white/40 uppercase tracking-tighter border border-white/5">
                                  {issue}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <OrganicFood width={40} height={40} className="text-white/10" />
                </div>
                <h3 className="text-xl font-black text-white/40 uppercase tracking-tighter mb-2">No Bio-Assets Detected</h3>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Initialize field observation protocol to begin tracking.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
