'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ViewGrid,
  Bell,
  User,
  StatsUpSquare,
  Plus
} from 'iconoir-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: ViewGrid, label: 'Home' },
    { href: '/forecast', icon: StatsUpSquare, label: 'Forecast' },
    { href: '/crop-health', icon: Plus, label: 'Crops' },
    { href: '/alerts', icon: Bell, label: 'Alerts' },
    { href: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 md:hidden safe-bottom">
      <div className="bg-[#0D0D0D]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] px-3 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D09C]/5 via-transparent to-[#4D9FFF]/5 opacity-30" />
        <div className="flex items-center justify-between relative z-10 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 flex-1 transition-all duration-500 min-w-[44px] min-h-[44px] justify-center ${isActive ? 'text-[#00D09C]' : 'text-white/20 hover:text-white/40 active:scale-95'}`}
              >
                <div className={`p-3 rounded-2xl transition-all duration-500 relative ${isActive ? 'bg-white/5 border border-white/10 shadow-2xl shadow-[#00D09C]/20 scale-100' : 'scale-90'}`}>
                  {isActive && (
                    <div className="absolute inset-0 bg-[#00D09C]/10 rounded-2xl animate-pulse" />
                  )}
                  <item.icon
                    width={24}
                    height={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-all duration-500 relative z-10 ${isActive ? 'scale-110' : ''}`}
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
