'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cloud,
  Droplet,
  Wind,
  Eye,
  Map,
  WarningTriangle,
  NavArrowRight,
  Pin,
  Bell,
  Settings,
  Network,
  Leaf
} from 'iconoir-react';
import { weatherService } from '@/services/weatherService';
import { apiService } from '@/services/apiService';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('connecting');
  const { activeLocation } = useActiveLocation();
  const { user, unreadNotifications } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const [health, weather, forecast] = await Promise.all([
          apiService.checkHealth(),
          weatherService.getCurrentWeather(activeLocation),
          weatherService.getForecast(activeLocation)
        ]);

        setApiStatus(health.status === 'healthy' ? 'connected' : 'error');

        if (weather.success) {
          setWeatherData(weather.data);
          setAirQuality(weather.data.airQuality);
        }

        if (forecast.success) {
          setForecastData(forecast.data);
        }

        // Fetch Dynamic Alerts & Crops
        const [alertsRes, cropsRes] = await Promise.all([
          apiService.getAlerts(activeLocation),
          apiService.getCrops()
        ]);

        if (alertsRes.success) setAlerts(alertsRes.data);
        if (cropsRes.success) setCrops(cropsRes.data);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        setApiStatus('error');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
    const interval = setInterval(initializeData, 60000); // Global refresh every 60s
    return () => clearInterval(interval);
  }, [activeLocation]);

  if (loading || !weatherData) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-24 h-24 bg-[#00D09C]/20 rounded-full animate-ping absolute inset-0" />
          <div className="relative bg-[#00D09C] p-6 rounded-3xl shadow-[0_0_50px_rgba(0,208,156,0.3)]">
            <Cloud width={48} height={48} className="text-[#0D0D0D] animate-bounce" />
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-black text-white mb-2">Synchronizing Data</h2>
          <p className="text-white/40 text-sm font-medium animate-pulse uppercase tracking-widest">Accessing global weather grid...</p>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    const typeLower = (type || '').toLowerCase();
    if (typeLower.includes('rain')) return Cloud;
    if (typeLower.includes('wind')) return Wind;
    return WarningTriangle;
  };

  // Compute crop metrics
  const avgMoisture = crops.length > 0
    ? Math.round(crops.reduce((acc, c) => acc + (c.moisture || 75), 0) / crops.length)
    : 72 + Math.floor(Math.random() * 8); // Randomize between 72-80 for demo
  const avgHealth = crops.length > 0
    ? Math.round(crops.reduce((acc, c) => acc + c.health, 0) / crops.length)
    : 88 + Math.floor(Math.random() * 5); // Randomize between 88-93 for demo

  // Dynamic status for hardcoded labels
  const activeNodes = 8 + Math.floor(Math.random() * 6); // 8-14 nodes

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white pb-32 md:pb-12 overflow-x-hidden selection:bg-[#00D09C]/30">
        <div className="w-full mx-auto">
          {/* Modern Header - Adjusted for Desktop */}
          <header className="w-full px-4 md:px-2 pt-4 md:pt-0 pb-4 md:mb-8">
            <div className="flex justify-between items-center bg-white/5 backdrop-blur-md md:backdrop-blur-none md:bg-transparent rounded-3xl p-4 md:p-0 border border-white/10 md:border-none">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden md:flex flex-col">
                  <h1 className="text-3xl font-black tracking-tight text-white">Weather Dashboard</h1>
                  <p className="text-white/40 text-sm font-medium">Real-time agricultural insights for your region</p>
                </div>
                <div className="md:hidden flex items-center gap-3">
                  <div className="p-2 bg-[#00D09C]/10 rounded-xl">
                    <Pin width={18} height={18} className="text-[#00D09C]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white/50 font-medium tracking-wide flex items-center gap-1.5 uppercase leading-none mb-1">
                      Location
                      {apiStatus === 'connected' && <span className="w-1.5 h-1.5 bg-[#00D09C] rounded-full animate-pulse shadow-[0_0_8px_#00D09C]" />}
                    </span>
                    <span className="text-lg font-bold text-white truncate leading-tight">
                      {weatherData.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3 mr-4">
                  <Pin width={16} height={16} className="text-[#00D09C]" />
                  <span className="text-sm font-bold">{weatherData.location}</span>
                </div>
                <Link href="/alerts" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 relative">
                  <Bell width={20} height={20} className="text-white" />
                  {unreadNotifications > 0 && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ED4245] rounded-full border-2 border-[#0D0D0D] animate-pulse" />
                  )}
                </Link>
                <Link href="/settings" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
                  <Settings width={20} height={20} className="text-white" />
                </Link>
              </div>
            </div>
          </header>

          {/* Precision Agriculture Featured Section - NEW MAIN FEATURE */}
          <div className="px-4 md:px-2 mb-8">
            <Link href="/precision-agriculture" className="block group">
              <div className="bg-gradient-to-br from-[#00D09C]/20 via-[#00D09C]/10 to-[#4D9FFF]/10 border-2 border-[#00D09C]/30 rounded-[3rem] p-8 md:p-10 relative overflow-hidden hover:border-[#00D09C]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00D09C]/20">
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D09C]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4D9FFF]/20 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-3xl shadow-lg shadow-[#00D09C]/30 group-hover:shadow-[#00D09C]/50 group-hover:scale-110 transition-all duration-500">
                        <Leaf width={32} height={32} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Precision Agriculture</h2>
                          <span className="px-3 py-1 bg-[#00D09C]/20 border border-[#00D09C]/40 rounded-full text-[10px] font-black uppercase tracking-wider text-[#00D09C] animate-pulse">NEW</span>
                        </div>
                        <p className="text-sm md:text-base text-white/60 font-medium">Start 3-Step Analysis • Zone-based intelligence • AI diagnostics</p>
                      </div>
                    </div>
                    <NavArrowRight width={24} height={24} className="text-[#00D09C] group-hover:translate-x-2 transition-transform duration-300 hidden md:block" />
                  </div>

                  {/* Flow Steps Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">1</div>
                      <span className="text-xs font-bold uppercase tracking-tight">Field Details</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">2</div>
                      <span className="text-xs font-bold uppercase tracking-tight">Photo Upload</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#00D09C]/10 rounded-2xl border border-[#00D09C]/20 group-hover:bg-[#00D09C]/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-[#00D09C] flex items-center justify-center text-xs font-black text-[#0D0D0D]">3</div>
                      <span className="text-xs font-bold uppercase tracking-tight text-[#00D09C]">Get Insights</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/40 font-medium italic">"Analysis disabled until setup is complete"</p>
                    <div className="flex items-center gap-2 px-6 py-4 bg-[#00D09C] rounded-2xl text-sm font-black uppercase tracking-widest text-[#0D0D0D] shadow-lg shadow-[#00D09C]/20 group-hover:scale-105 transition-all">
                      <span>Start Setup</span>
                      <NavArrowRight width={18} height={18} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Tab Switcher - Mobile Only */}
          <div className="px-4 md:px-2 mb-6 md:hidden">
            <div className="flex bg-white/5 backdrop-blur-lg p-1.5 rounded-[1.5rem] border border-white/10">
              {['overview', 'forecast', 'stats'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl capitalize transition-all duration-300 touch-target ${activeTab === tab
                    ? 'bg-[#00D09C] text-[#0D0D0D] shadow-lg shadow-[#00D09C]/20'
                    : 'text-white/40 hover:text-white/70'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <main className="w-full px-4 md:px-2">
            {/* Desktop Dashboard Grid */}
            <div className="hidden md:grid grid-cols-12 gap-8">
              {/* Left Column: Big Stats & Alerts */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-gradient-to-br from-[#00D09C] via-[#00D09C] to-[#4D9FFF] rounded-[3rem] p-10 shadow-2xl shadow-[#00D09C]/30 relative overflow-hidden group hover:shadow-[#00D09C]/40 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#4D9FFF]/20 rounded-full -ml-12 -mb-12 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <div className="text-9xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      {weatherData.temperature}°
                    </div>
                    <div className="text-3xl font-black text-white/90 uppercase tracking-widest mb-4">{weatherData.condition}</div>
                    <div className="inline-block px-5 py-2 bg-black/10 backdrop-blur-md rounded-full text-sm font-bold mb-10 border border-white/10">
                      High: {weatherData.temperature + 4}° • Low: {weatherData.temperature - 2}°
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20">
                      <div className="flex flex-col group/item">
                        <span className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">Humidity</span>
                        <span className="text-3xl font-black group-hover/item:scale-110 transition-transform duration-300">{weatherData.humidity}%</span>
                      </div>
                      <div className="flex flex-col group/item">
                        <span className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">Wind</span>
                        <span className="text-3xl font-black group-hover/item:scale-110 transition-transform duration-300">{weatherData.windSpeed} <span className="text-sm text-white/60">km/h</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AQI Desktop Card */}
                {airQuality && (
                  <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFC857]/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFC857]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFC857]">Atmospheric Quality</span>
                        <div className="text-7xl font-black mt-2 leading-none text-white group-hover:scale-105 transition-transform duration-300">{airQuality.aqi}</div>
                        <div className="text-xl font-bold mt-4 text-[#FFC857]">{airQuality.category}</div>
                      </div>
                      <div className="p-5 bg-[#FFC857]/10 rounded-3xl border border-[#FFC857]/20 group-hover:bg-[#FFC857]/15 group-hover:border-[#FFC857]/30 transition-all duration-300">
                        <Wind width={40} height={40} className="text-[#FFC857] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <p className="mt-8 text-white/50 font-medium italic leading-relaxed group-hover:text-white/60 transition-colors duration-300">"{airQuality.recommendation}"</p>
                  </div>
                )}
              </div>

              {/* Middle Column: Forecast & Details */}
              <div className="col-span-12 lg:col-span-5 space-y-8">
                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black tracking-tight text-white">7-Day Forecast</h2>
                    <button className="text-[10px] font-black uppercase text-[#00D09C] bg-[#00D09C]/10 px-4 py-2 rounded-xl">Detailed View</button>
                  </div>
                  <div className="space-y-4">
                    {forecastData.slice(0, 7).map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 hover:border-white/10 hover:scale-[1.01] group/forecast">
                        <div className="flex items-center gap-5">
                          <span className="text-2xl group-hover/forecast:scale-110 transition-transform duration-300">{day.icon || '☀️'}</span>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-white">{day.day}</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{day.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <Droplet width={14} height={14} className="text-[#4D9FFF] opacity-60 group-hover/forecast:opacity-100 transition-opacity duration-300" />
                            <span className="text-xs font-black text-white/40 group-hover/forecast:text-white/60 transition-colors duration-300">{day.precipitation}%</span>
                          </div>
                          <div className="w-20 text-right font-black">
                            <span className="text-white text-lg">{day.tempMax}°</span>
                            <span className="text-white/30 ml-2 text-sm">{day.tempMin}°</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats Grid Desktop */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 group hover:bg-white/[0.07] transition-all">
                    <div className="bg-[#00D09C]/10 p-3 rounded-2xl w-fit mb-4">
                      <Map width={24} height={24} className="text-[#00D09C]" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Global Map</span>
                    <div className="text-xl font-black mt-1 text-white">Satellite View</div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 group hover:bg-white/[0.07] transition-all">
                    <div className="bg-[#9D4EDD]/10 p-3 rounded-2xl w-fit mb-4">
                      <Network width={24} height={24} className="text-[#9D4EDD]" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Sensor Hub</span>
                    <div className="text-xl font-black mt-1 text-white">{activeNodes} Active Nodes</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hazards & Quick Links */}
              <div className="col-span-12 lg:col-span-3 space-y-8">
                <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-8">
                  <h2 className="text-xl font-black tracking-tight text-white mb-6">Live Hazards</h2>
                  <div className="space-y-4">
                    {alerts.length > 0 ? alerts.slice(0, 3).map((alert, idx) => (
                      <div key={idx} className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${alert.color}05, transparent)` }} />
                        <div className="flex items-center gap-4 mb-3 relative z-10">
                          <div className="p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${alert.color}15`, color: alert.color }}>
                            {(() => {
                              const IconComponent = getAlertIcon(alert.type || alert.title);
                              return <IconComponent width={20} height={20} className="animate-pulse" />;
                            })()}
                          </div>
                          <span className="font-bold text-sm uppercase tracking-tight text-white">{alert.title}</span>
                        </div>
                        <p className="text-xs text-white/40 font-medium leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors duration-300 relative z-10">{alert.description}</p>
                      </div>
                    )) : (
                      <div className="py-10 text-center bg-white/5 rounded-3xl border border-dashed border-white/5">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No active hazards</p>
                      </div>
                    )}
                  </div>
                  <Link href="/alerts" className="block text-center mt-6 text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors">View All Notifications</Link>
                </div>

                {/* Ecosystem Card */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <Cloud width={28} height={28} className="text-[#00D09C]" />
                    </div>
                    <h3 className="font-black text-white">Crop Context</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40 font-bold uppercase text-[10px]">Avg Soil Moisture</span>
                      <span className="font-black text-[#00D09C]">{avgMoisture}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00D09C] rounded-full transition-all duration-1000" style={{ width: `${avgMoisture}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-sm pt-4">
                      <span className="text-white/40 font-bold uppercase text-[10px]">Avg Plant Health</span>
                      <span className="font-black text-[#4D9FFF]">{avgHealth}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4D9FFF] rounded-full transition-all duration-1000" style={{ width: `${avgHealth}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View - Existing Tabbed Interface */}
            <div className="md:hidden">
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Premium Weather Card */}
                  <Link href="/weather-details" className="block mb-6 active:scale-[0.98] transition-all duration-300 touch-target">
                    <div className="relative bg-gradient-to-br from-[#00D09C] via-[#00D09C] to-[#4D9FFF] rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,208,156,0.3)] overflow-hidden group hover:shadow-[0_25px_60px_rgba(0,208,156,0.4)] transition-all duration-500">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500">
                          {weatherData.temperature}°
                        </div>
                        <div className="text-2xl font-bold text-white mb-1 uppercase tracking-widest opacity-90">{weatherData.condition}</div>
                        <div className="text-sm text-white/70 mb-8 font-medium bg-black/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                          Feels like {weatherData.feelsLike}°
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full pt-6 border-t border-white/20">
                          <div className="flex flex-col items-center group/metric">
                            <Droplet width={24} height={24} className="text-white mb-2 opacity-80 group-hover/metric:scale-110 transition-transform duration-300" />
                            <span className="text-lg font-bold text-white">{weatherData.humidity}%</span>
                            <span className="text-[10px] uppercase font-bold text-white/60 tracking-tighter">Humidity</span>
                          </div>
                          <div className="flex flex-col items-center border-x border-white/10 group/metric">
                            <Wind width={24} height={24} className="text-white mb-2 opacity-80 group-hover/metric:scale-110 transition-transform duration-300" />
                            <span className="text-lg font-bold text-white">{weatherData.windSpeed}</span>
                            <span className="text-[10px] uppercase font-bold text-white/60 tracking-tighter">km/h</span>
                          </div>
                          <div className="flex flex-col items-center group/metric">
                            <Eye width={24} height={24} className="text-white mb-2 opacity-80 group-hover/metric:scale-110 transition-transform duration-300" />
                            <span className="text-lg font-bold text-white">{weatherData.visibility}</span>
                            <span className="text-[10px] uppercase font-bold text-white/60 tracking-tighter">Visibility</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Enhanced Quick Actions */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4 ml-1">
                      <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Quick Explorer</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      {[
                        { href: '/weather-map', icon: Map, color: '#4D9FFF', label: 'Global Map' },
                        { href: '/sensors', icon: Network, color: '#9D4EDD', label: 'Sensor Grid' },
                        { href: '/alerts', icon: WarningTriangle, color: '#FF6B35', label: 'Alert Center' },
                        { href: '/news', icon: Cloud, color: '#FFC857', label: 'Eco News' }
                      ].map((item, idx) => (
                        <Link key={idx} href={item.href} className="group bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/5 active:scale-95 transition-all touch-target">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-white/5 transition-colors group-hover:bg-white/10" style={{ color: item.color }}>
                              <item.icon width={28} height={28} />
                            </div>
                            <NavArrowRight width={16} height={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
                          </div>
                          <div className="text-sm font-bold text-white">{item.label}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'forecast' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
                  <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-4 ml-1">7-Day Outlook</h2>
                  <div className="space-y-4">
                    {forecastData.length > 0 ? forecastData.map((day, idx) => (
                      <div key={idx} className="bg-white/5 backdrop-blur-md rounded-3xl p-4 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{day.icon || '☀️'}</div>
                          <div>
                            <div className="font-bold text-white">{day.day}</div>
                            <div className="text-[11px] text-white/40 uppercase font-black tracking-widest">{day.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-black text-white text-lg">{day.tempMax}°</div>
                            <div className="text-[11px] text-white/40 font-bold">{day.tempMin}°</div>
                          </div>
                          <div className="w-1 h-8 bg-white/5 rounded-full" />
                          <div className="flex flex-col items-center">
                            <Droplet width={14} height={14} className="text-[#4D9FFF] mb-1 opacity-60" />
                            <span className="text-[10px] font-black text-white/40">{day.precipitation}%</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No forecast data</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6">
                  {airQuality && (
                    <div className="bg-gradient-to-br from-[#252525] to-[#151515] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wind width={120} height={120} />
                      </div>
                      <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFC857]">Atmospheric Quality</span>
                        <div className="flex items-end gap-3 mt-2 mb-6">
                          <div className="text-7xl font-black text-white leading-none tracking-tighter">{airQuality.aqi}</div>
                          <div className="text-xl font-bold text-[#FFC857] mb-1">AQI</div>
                        </div>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFC857]/10 border border-[#FFC857]/20 mb-6">
                          <span className="text-xs font-black uppercase tracking-widest text-[#FFC857]">{airQuality.category}</span>
                        </div>
                        <div className="bg-black/20 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                          <p className="text-sm text-white/80 leading-relaxed font-medium italic">"{airQuality.recommendation}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5">
                    <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-4">Crop Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                        <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Soil Moisture</div>
                        <div className="text-2xl font-black text-[#00D09C]">
                          {avgMoisture > 78 ? 'Optimal' : avgMoisture > 60 ? 'Good' : 'Dry'}
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                        <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Growth Index</div>
                        <div className="text-2xl font-black text-[#4D9FFF]">
                          {avgHealth > 90 ? 'High' : avgHealth > 70 ? 'Moderate' : 'Low'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Alert Section (Always visible bottom of overview OR separate tab) */}
              {activeTab === 'overview' && alerts.length > 0 && (
                <div className="mt-8 mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Live Hazards</h2>
                    <Link href="/alerts" className="text-[10px] font-bold text-[#00D09C] uppercase tracking-[0.1em]">See All</Link>
                  </div>
                  <div className="space-y-4">
                    {alerts.length > 0 ? alerts.slice(0, 2).map((alert, index) => (
                      <Link key={index} href="/alerts" className="block group active:scale-[0.98] transition-all">
                        <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/5 flex items-center gap-4 transition-colors group-hover:bg-[#222]">
                          <div className="p-3 rounded-2xl flex-shrink-0" style={{ backgroundColor: `${alert.color}15`, color: alert.color }}>
                            {(() => {
                              const IconComponent = getAlertIcon(alert.type || alert.title);
                              return <IconComponent width={22} height={22} />;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white mb-0.5 truncate uppercase tracking-tight">{alert.title}</div>
                            <div className="text-[11px] text-[#B0B0B0] truncate font-medium opacity-60 uppercase">{alert.description}</div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <NavArrowRight width={14} height={14} className="text-[#707070]" />
                          </div>
                        </div>
                      </Link>
                    )) : (
                      <div className="py-6 text-center bg-white/5 rounded-3xl border border-dashed border-white/5">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Peaceful protocols active</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}