'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ViewGrid,
  Map,
  Network,
  Bell,
  Settings,
  StatsUpSquare
} from 'iconoir-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: ViewGrid, label: 'Control' },
    { href: '/weather-map', icon: Map, label: 'Spectral' },
    { href: '/sensors', icon: Network, label: 'Sensors' },
    { href: '/alerts', icon: Bell, label: 'Alerts' },
    { href: '/settings', icon: Settings, label: 'Config' }
  ];

  return (
    <nav className="fixed bottom-8 left-4 right-4 z-50 md:hidden">
      <div className="bg-[#0D0D0D]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50" />
        <div className="flex items-center justify-between relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 flex-1 transition-all duration-500 ${isActive ? 'text-[#00D09C]' : 'text-white/20 hover:text-white/40'}`}
              >
                <div className={`p-3 rounded-2xl transition-all duration-500 scale-90 ${isActive ? 'bg-white/5 border border-white/5 shadow-2xl scale-100' : 'group-active:scale-95'}`}>
                  <item.icon
                    width={22}
                    height={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-500"
                  />
                </div>
                {isActive && (
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
