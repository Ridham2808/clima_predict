import Link from 'next/link';
import {
  Network,
  NavArrowRight,
  Plus,
  Droplet,
  TransitionLeft,
  SunLight,
  TemperatureHigh
} from 'iconoir-react';
import { sensorData } from '@/data/staticData';

export default function Sensors() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return '#00D09C';
      case 'Good': return '#4D9FFF';
      case 'High': return '#FFC857';
      default: return '#B0B0B0';
    }
  };

  const getSensorIcon = (iconStr) => {
    switch (iconStr) {
      case '💧': return Droplet;
      case '🌡️': return TemperatureHigh;
      case '☀️': return SunLight;
      default: return Network;
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
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Sensor Network</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Real-time IoT nodes monitoring your region</p>
            </div>
          </div>
          <button className="p-4 bg-[#00D09C] text-[#0D0D0D] rounded-2xl shadow-lg shadow-[#00D09C]/20 active:scale-95 transition-all hover:bg-[#00D09C]/90">
            <Plus width={24} height={24} strokeWidth={3} />
          </button>
        </header>

        {/* Status Banner */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
              <div className="bg-white/20 backdrop-blur-md rounded-[2rem] p-6 shadow-xl">
                <Network width={56} height={56} className="text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-none">4 Sensors Active</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 font-bold uppercase tracking-widest text-sm">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  All systems operational
                </div>
              </div>
              <div className="bg-white/10 px-8 py-4 rounded-3xl border border-white/20 font-black text-white uppercase tracking-widest text-sm">
                Healthy
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Cards Grid */}
        <div>
          <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-6 ml-1">Live Node Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensorData.map((sensor, index) => {
              const statusColor = getStatusColor(sensor.status);
              const Icon = getSensorIcon(sensor.icon);
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div
                        className="rounded-2xl p-4 bg-white/5 group-hover:bg-white/10 transition-colors"
                        style={{ color: statusColor }}
                      >
                        <Icon width={32} height={32} />
                      </div>
                      <div>
                        <div className="text-lg font-black text-white mb-0.5">
                          {sensor.name}
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          Updated {sensor.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div
                      className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/5"
                      style={{ backgroundColor: `${statusColor}22`, color: statusColor }}
                    >
                      {sensor.status}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span
                      className="text-5xl font-black tracking-tighter"
                      style={{ color: statusColor }}
                    >
                      {sensor.value}
                    </span>
                    <span className="text-lg font-bold text-white/20 uppercase">{sensor.unit}</span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min((sensor.value / 100) * 100, 100)}%`,
                        backgroundColor: statusColor,
                        boxShadow: `0 0 15px ${statusColor}44`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

