'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ViewGrid,
  Bell,
  User,
  StatsUpSquare,
  Plus,
  Menu,
  Xmark,
  Cloud,
  Map,
  Network,
  Journal,
  ModernTv,
  NavArrowRight,
  Settings,
  Eye
} from 'iconoir-react';

import { useAuth } from '@/contexts/AuthContext';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { unreadNotifications } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    { href: '/', icon: ViewGrid, label: 'Home' },
    { href: '/forecast', icon: StatsUpSquare, label: 'Forecast' },
    { href: '/crop-health', icon: Plus, label: 'Crops' },
    {
      href: '/alerts',
      icon: Bell,
      label: 'Alerts',
      badge: unreadNotifications > 0 ? unreadNotifications : null
    },
  ];

  const moreItems = [
    { href: '/weather-map', icon: Map, label: 'Field Map', category: 'Weather' },
    { href: '/precision-agriculture', icon: Network, label: 'Precision Ag', category: 'Agriculture' },
    { href: '/market-prices', icon: NavArrowRight, label: 'Market Prices', category: 'Social' },
    { href: '/community', icon: Journal, label: 'Community', category: 'Social' },
    { href: '/profile', icon: User, label: 'Profile', category: 'Account' },
    { href: '/settings', icon: Settings, label: 'Settings', category: 'Account' },
  ];

  const isMoreActive = moreItems.some(item => item.href === pathname);

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 md:hidden safe-bottom">
        <div className="bg-[#0D0D0D]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] px-3 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D09C]/5 via-transparent to-[#4D9FFF]/5 opacity-30" />
          <div className="flex items-center justify-between relative z-10 gap-1">
            {mainNavItems.map((item) => {
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
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ED4245] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0D0D0D] z-20 animate-in zoom-in duration-300">
                        {item.badge > 9 ? '9+' : item.badge}
                      </div>
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

            {/* More Button */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center gap-1.5 flex-1 transition-all duration-500 min-w-[44px] min-h-[44px] justify-center ${isMoreActive || showMore ? 'text-[#00D09C]' : 'text-white/20 hover:text-white/40 active:scale-95'}`}
            >
              <div className={`p-3 rounded-2xl transition-all duration-500 relative ${isMoreActive || showMore ? 'bg-white/5 border border-white/10 shadow-2xl shadow-[#00D09C]/20 scale-100' : 'scale-90'}`}>
                {(isMoreActive || showMore) && (
                  <div className="absolute inset-0 bg-[#00D09C]/10 rounded-2xl animate-pulse" />
                )}
                {showMore ? (
                  <Xmark width={24} height={24} strokeWidth={2.5} className="transition-all duration-500 relative z-10 scale-110" />
                ) : (
                  <Menu width={24} height={24} strokeWidth={isMoreActive ? 2.5 : 2} className={`transition-all duration-500 relative z-10 ${isMoreActive ? 'scale-110' : ''}`} />
                )}
              </div>
              {(isMoreActive || showMore) && (
                <span className="text-[8px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-500">
                  More
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setShowMore(false)}
        >
          <div
            className="fixed bottom-32 left-4 right-4 bg-gradient-to-br from-[#0D0D0D] to-black border border-white/10 rounded-[2.5rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 duration-500 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">All Features</h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              >
                <Xmark width={24} height={24} />
              </button>
            </div>

            {/* Group by category */}
            {['Weather', 'Agriculture', 'Data', 'Social', 'Account'].map((category) => {
              const categoryItems = moreItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">{category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowMore(false)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 touch-target ${isActive
                            ? 'bg-[#00D09C]/10 border-[#00D09C]/30 text-[#00D09C]'
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10 hover:text-white active:scale-95'
                            }`}
                        >
                          <div className={`p-2 rounded-xl ${isActive ? 'bg-[#00D09C]/20' : 'bg-white/5'}`}>
                            <item.icon width={20} height={20} strokeWidth={2} />
                          </div>
                          <span className="text-sm font-bold uppercase tracking-tight flex-1">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
