'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Notifications() {
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
      title: 'Weather & Alerts',
      items: [
        {
          key: 'weatherAlerts',
          label: 'Weather Alerts',
          description: 'Severe weather warnings and forecasts',
          icon: '⚠️',
          color: '#FF6B35',
        },
        {
          key: 'sensorAlerts',
          label: 'Sensor Alerts',
          description: 'IoT sensor threshold notifications',
          icon: '📡',
          color: '#9D4EDD',
        },
      ],
    },
    {
      title: 'Crop & Farm',
      items: [
        {
          key: 'cropHealthAlerts',
          label: 'Crop Health Alerts',
          description: 'Crop health status updates',
          icon: '🌾',
          color: '#00D09C',
        },
        {
          key: 'aiRecommendations',
          label: 'AI Recommendations',
          description: 'Smart farming suggestions',
          icon: '🤖',
          color: '#4D9FFF',
        },
      ],
    },
    {
      title: 'Market & Finance',
      items: [
        {
          key: 'marketPrices',
          label: 'Market Prices',
          description: 'Daily crop price updates',
          icon: '💰',
          color: '#FFC857',
        },
        {
          key: 'insuranceReminders',
          label: 'Insurance Reminders',
          description: 'Policy renewals and claims',
          icon: '🛡️',
          color: '#4D9FFF',
        },
      ],
    },
    {
      title: 'Community & News',
      items: [
        {
          key: 'communityUpdates',
          label: 'Community Updates',
          description: 'New posts and discussions',
          icon: '👥',
          color: '#00D09C',
        },
        {
          key: 'newsUpdates',
          label: 'News Updates',
          description: 'Agriculture news and articles',
          icon: '📰',
          color: '#FF6B35',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="px-5 pt-5 pb-4 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-2xl font-bold text-white flex-1">Notifications</h1>
        </header>

        {/* Summary */}
        <div className="px-5 mb-6">
          <div className="bg-gradient-to-br from-[#9D4EDD] to-[#4D9FFF] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <span className="text-3xl">🔔</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/80">Active Notifications</div>
                <div className="text-3xl font-bold text-white">
                  {Object.values(settings).filter(Boolean).length} / {Object.keys(settings).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="px-5 space-y-6">
          {notificationCategories.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-semibold text-white mb-3">{category.title}</h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div
                    key={item.key}
                    className="bg-[#252525] rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-xl p-3"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-white mb-1">
                          {item.label}
                        </div>
                        <div className="text-sm text-[#B0B0B0]">{item.description}</div>
                      </div>
                      <button
                        onClick={() => toggleSetting(item.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings[item.key] ? 'bg-[#00D09C]' : 'bg-[#1A1A1A]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings[item.key] ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="px-5 mt-6">
          <button className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-xl py-3 text-white font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
