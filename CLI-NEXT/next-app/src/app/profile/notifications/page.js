'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  NavArrowRight,
  Bell,
  WarningTriangle,
  MediaPlaylist,
  GraphUp,
  Journal,
  Shield,
  User,
  OrganicFood,
  Pin,
  Database
} from 'iconoir-react';

function Notifications() {
  const [settings, setSettings] = useState({
    weatherAlerts: true,
    sensorAlerts: true,
    marketPrices: false,
    communityUpdates: true,
    newsUpdates: false,
    insuranceReminders: true,
    cropHealthAlerts: true,
    aiRecommendations: false,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const notificationCategories = [
    {
      title: 'Atmospheric Events',
      items: [
        {
          key: 'weatherAlerts',
          label: 'Weather Alerts',
          description: 'Severe weather warnings and forecasts',
          icon: WarningTriangle,
          color: '#FF6B35',
        },
        {
          key: 'sensorAlerts',
          label: 'Sensor Thresholds',
          description: 'IoT sensor threshold notifications',
          icon: Pin,
          color: '#9D4EDD',
        },
      ],
    },
    {
      title: 'Agronomic Insights',
      items: [
        {
          key: 'cropHealthAlerts',
          label: 'Health Anomaly',
          description: 'Crop health status updates',
          icon: OrganicFood,
          color: '#00D09C',
        },
        {
          key: 'aiRecommendations',
          label: 'AI Insights',
          description: 'Personalized farming recommendations',
          icon: GraphUp,
          color: '#4D9FFF',
        },
      ],
    },
    {
      title: 'Operational Assets',
      items: [
        {
          key: 'marketPrices',
          label: 'Market Liquidity',
          description: 'Daily crop price updates',
          icon: GraphUp,
          color: '#FFC857',
        },
        {
          key: 'insuranceReminders',
          label: 'Indemnity Renewal',
          description: 'Policy renewals and claims',
          icon: Shield,
          color: '#4D9FFF',
        },
      ],
    },
    {
      title: 'Intelligence Stream',
      items: [
        {
          key: 'communityUpdates',
          label: 'Social Dispatch',
          description: 'New posts and discussions',
          icon: User,
          color: '#00D09C',
        },
        {
          key: 'newsUpdates',
          label: 'Editorial News',
          description: 'Agriculture news and articles',
          icon: Journal,
          color: '#FF6B35',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen text-white pb-12 uppercase">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/profile" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Alert Matrix</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Notification vectors and communication protocols</p>
          </div>
        </header>

        <div className="mb-12">
          <div className="bg-gradient-to-br from-[#9D4EDD] to-[#4D9FFF] rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
            <div className="relative z-10 flex items-center gap-10">
              <div className="p-8 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30">
                <Bell width={48} height={48} className="text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black text-[#0D0D0D]/40 tracking-[0.4em] mb-2">Operational Channels</div>
                <div className="text-4xl md:text-6xl font-black text-[#0D0D0D] tracking-tighter">
                  {Object.values(settings).filter(Boolean).length} / {Object.keys(settings).length}
                </div>
                <div className="text-xs font-black text-[#0D0D0D]/60 tracking-widest mt-1">Active Synchronization Streams</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {notificationCategories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-[10px] font-black text-white/30 tracking-[0.4em] ml-2 uppercase">{category.title}</h2>
              <div className="space-y-4">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleSetting(item.key)}
                      className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className="rounded-2xl p-4 md:p-5 bg-white/5 border border-white/5 group-hover:scale-105 transition-transform"
                          style={{ color: item.color }}
                        >
                          <Icon width={24} height={24} />
                        </div>
                        <div>
                          <div className="text-lg font-black text-white mb-1 uppercase tracking-tight">
                            {item.label}
                          </div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{item.description}</div>
                        </div>
                      </div>

                      <button
                        className={`relative w-14 h-8 rounded-full transition-all duration-500 p-1 border ${settings[item.key] ? 'bg-[#00D09C] border-[#00D09C]' : 'bg-white/5 border-white/10'
                          }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg bg-white shadow-xl transition-all duration-500 transform ${settings[item.key] ? 'translate-x-6 rotate-90 scale-100' : 'translate-x-0 scale-75 opacity-20'
                            }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-[2rem] py-5 text-[#0D0D0D] font-black tracking-[0.2em] text-xs hover:opacity-90 shadow-2xl active:scale-95 transition-all uppercase">
            Execute Synchronization
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
