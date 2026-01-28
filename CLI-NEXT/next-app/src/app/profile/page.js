'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  User,
  Shield,
  Bell,
  LightBulb,
  Journal,
  QuestionMark,
  Settings,
  Globe,
  InfoCircle,
  NavArrowRight,
  LogOut,
  Settings as SettingsIcon,
  Pin
} from 'iconoir-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ acres: '0', crops: 0, accuracy: '85%' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
          setStats({
            acres: data.data.farmSize || '0',
            crops: data.data.cropsCount || 0,
            accuracy: '85%'
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const menuItems = [
    { title: 'Edit Profile', subtitle: 'Update your information', icon: User, href: '/profile/edit', color: '#00D09C' },
    { title: 'Insurance', subtitle: 'Crop insurance details', icon: Shield, href: '/profile/insurance', color: '#4D9FFF' },
    { title: 'Notifications', subtitle: 'Manage preferences', icon: Bell, href: '/profile/notifications', color: '#9D4EDD' },
  ];

  const resourceItems = [
    { title: 'Community', subtitle: 'Global farm network', icon: Journal, href: '/community', color: '#FF6B35' },
    { title: 'Help & Support', subtitle: 'Technical assistance', icon: QuestionMark, href: '/profile/help', color: '#00D09C' },
  ];

  const settingItems = [
    { title: 'App Settings', subtitle: 'Configure preferences', icon: Settings, href: '/settings', color: '#4D9FFF' },
    { title: 'Language', subtitle: 'English', icon: Globe, href: '/profile/language', color: '#9D4EDD' },
    { title: 'About', subtitle: 'Version 1.0.0', icon: InfoCircle, href: '/profile/about', color: '#707070' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white pb-28">
        {/* Profile Header */}
        <div className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/20 to-[#4D9FFF]/20 -z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-6 border border-white/10 relative z-10">
                <User width={48} height={48} className="text-[#00D09C] md:hidden" />
                <User width={64} height={64} className="text-[#00D09C] hidden md:block" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase">{user?.name || 'Farmer Name'}</h1>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-10">
              <Pin width={14} height={14} className="text-[#00D09C]" />
              {userData?.location || user?.email || 'Location'}
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-12 w-full max-w-2xl px-4">
              {[
                { label: 'Farm size', value: `${userData?.farmSize || '0'} ha` },
                { label: 'Bio-Assets', value: userData?.cropsCount || '0' },
                { label: 'Fidelity', value: '85%' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-4 md:p-8 hover:bg-white/10 transition-all">
                  <div className="text-xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-6 -mt-10 md:-mt-16 space-y-12">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MenuSection title="Account" items={menuItems} />
            <MenuSection title="Intelligence" items={resourceItems} />
            <MenuSection title="Configuration" items={settingItems} />
          </section>

          <section className="w-full mx-auto">
            <button
              onClick={logout}
              className="w-full bg-white/5 backdrop-blur-md border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 rounded-3xl p-6 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <LogOut width={24} height={24} />
                </div>
                <div className="text-left text-sm font-black text-white/40 group-hover:text-red-500 uppercase tracking-widest transition-all">Terminate Session</div>
              </div>
              <NavArrowRight width={20} height={20} className="text-white/20 group-hover:text-red-500 transition-all" />
            </button>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function MenuSection({ title, items }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em] ml-1">{title}</h2>
      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} href={item.href} className="group flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/5 rounded-[2rem] p-5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98]">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/20 group-hover:text-white transition-colors" style={{ color: item.color }}>
                <Icon width={24} height={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white uppercase tracking-tight mb-0.5">{item.title}</div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-tighter truncate">{item.subtitle}</div>
              </div>
              <NavArrowRight width={18} height={18} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
