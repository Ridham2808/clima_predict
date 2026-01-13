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
    <div className="min-h-screen text-white pb-10">
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
          <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-[2rem] p-6 md:p-8 flex items-center gap-6">
            <div className="p-4 bg-[#FF6B35]/20 rounded-2xl">
              <WarningTriangle width={32} height={32} className="text-[#FF6B35]" />
            </div>
            <div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden group hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
                  >
                    <div className="p-8" style={{ backgroundColor: `${alert.color}11` }}>
                      <div className="flex items-center gap-5">
                        <div
                          className="rounded-[1.5rem] p-5 bg-white/5"
                          style={{ color: alert.color, backgroundColor: `${alert.color}22` }}
                        >
                          <Icon width={36} height={36} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xl font-black text-white mb-1 leading-tight">{alert.title}</div>
                          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{alert.severity} • {alert.type}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      <p className="text-white/60 font-medium leading-relaxed">{alert.description}</p>

                      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Schedule</div>
                          <div className="text-xs font-bold text-white/40">
                            {new Date(alert.startTime).toLocaleString()} — {new Date(alert.endTime).toLocaleString()}
                          </div>
                        </div>
                        <Link
                          href={`/alerts/${alert.id || index}`}
                          className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#0D0D0D] transition-all hover:scale-105 active:scale-95"
                          style={{ backgroundColor: alert.color }}
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

