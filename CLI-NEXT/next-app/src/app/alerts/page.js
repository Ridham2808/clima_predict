'use client';

import Link from 'next/link';
import {
  WarningTriangle,
  NavArrowRight,
  Rain,
  Wind,
  SunLight,
  Flash,
  InfoCircle
} from 'iconoir-react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await apiService.getAlerts();
      if (res.success) {
        setAlerts(res.data);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  const getAlertIcon = (iconStr) => {
    switch (iconStr) {
      case '🌧️': return Rain;
      case '💨': return Wind;
      case '☀️': return SunLight;
      case '⚡': return Flash;
      case '⚠️': return WarningTriangle;
      default: return InfoCircle;
    }
  };

  return (
    <div className="min-h-screen text-white pb-32 md:pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        {/* Header */}
        <header className="pt-8 pb-4 flex items-center justify-between gap-4 md:mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
              <NavArrowRight className="rotate-180" width={20} height={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Alert Center</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Active meteorological hazards and advisories</p>
            </div>
          </div>
        </header>

        {/* Alert Count Banner */}
        <div className="mb-8">
          <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-[2rem] p-6 md:p-8 flex items-center gap-6 relative overflow-hidden group hover:bg-[#FF6B35]/15 hover:border-[#FF6B35]/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-4 bg-[#FF6B35]/20 rounded-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">
              <WarningTriangle width={32} height={32} className="text-[#FF6B35] animate-pulse" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl md:text-3xl font-black text-white leading-tight">
                {loading ? 'Scanning...' : `${alerts.length} Critical Alerts`}
              </div>
              <p className="text-[#FF6B35] font-bold text-sm uppercase tracking-widest mt-1">
                {loading ? 'Synchronising hazmat data' : 'Precautionary measures advised'}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Cards Grid */}
        <div>
          <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-6 ml-1">Current Active Hazards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin text-4xl mb-4">🔄</div>
                <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Decoding spectral hazards…</p>
              </div>
            ) : alerts.length > 0 ? (
              alerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.icon);
                return (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden group hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 hover:shadow-lg relative"
                    style={{ boxShadow: `0 0 0 0 ${alert.color}00` }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 10px 30px 0 ${alert.color}20`}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 0 ${alert.color}00`}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${alert.color}08, transparent)` }} />
                    <div className="p-8 relative z-10" style={{ backgroundColor: `${alert.color}11` }}>
                      <div className="flex items-center gap-5">
                        <div
                          className="rounded-[1.5rem] p-5 bg-white/5 group-hover:scale-110 transition-transform duration-300"
                          style={{ color: alert.color, backgroundColor: `${alert.color}22` }}
                        >
                          <Icon width={36} height={36} strokeWidth={2.5} className="animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xl font-black text-white mb-1 leading-tight">{alert.title}</div>
                          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{alert.severity} • {alert.type}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-6 relative z-10">
                      <p className="text-white/60 font-medium leading-relaxed group-hover:text-white/70 transition-colors duration-300">{alert.description}</p>

                      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Schedule</div>
                          <div className="text-xs font-bold text-white/40">
                            {new Date(alert.startTime).toLocaleString()} — {new Date(alert.endTime).toLocaleString()}
                          </div>
                        </div>
                        <Link
                          href={`/alerts/${alert.id || index}`}
                          className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#0D0D0D] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
                          style={{ backgroundColor: alert.color, boxShadow: `0 4px 12px ${alert.color}40` }}
                        >
                          Action Required
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <SunLight width={48} height={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Clear sky protocol active • No hazards detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

