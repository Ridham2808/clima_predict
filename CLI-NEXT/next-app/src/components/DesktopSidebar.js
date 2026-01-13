'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ViewGrid,
    Map,
    Network,
    Bell,
    Settings,
    Cloud,
    Pin,
    ModernTv,
    Journal,
    StatsUpSquare
} from 'iconoir-react';

const sidebarItems = [
    { href: '/', icon: ViewGrid, label: 'Control Center' },
    { href: '/weather-map', icon: Map, label: 'Spectral Analytics' },
    { href: '/forecast', icon: StatsUpSquare, label: 'Weekly Outlook' },
    { href: '/insights', icon: ModernTv, label: 'Climate Intelligence' },
    { href: '/community', icon: Journal, label: 'Feed & Insights' },
    { href: '/sensors', icon: Network, label: 'Sensor Grid' },
    { href: '/alerts', icon: Bell, label: 'Hazard Alerts' },
    { href: '/settings', icon: Settings, label: 'Configuration' },
];

export default function DesktopSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-72 bg-[#0D0D0D] border-r border-white/5 py-8 px-6 z-50">
            <div className="flex items-center gap-4 mb-14 px-2">
                <div className="relative group">
                    <div className="absolute inset-0 bg-[#00D09C] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-white/5 p-3 rounded-2xl border border-white/10 shadow-2xl">
                        <Cloud width={28} height={28} className="text-[#00D09C]" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">ClimaPredict</span>
                    <span className="text-[9px] font-black text-[#00D09C] tracking-[0.4em] uppercase mt-1 opacity-80">Neural Dynamics</span>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar pb-8">
                <div className="text-[10px] font-black text-white/20 tracking-[0.4em] mb-4 ml-4 uppercase">Navigation</div>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${isActive
                                ? 'bg-white/5 text-white border border-white/10 shadow-2xl'
                                : 'text-white/30 hover:bg-white/[0.03] hover:text-white'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00D09C]/5 via-transparent to-transparent animate-[shimmer_2s_infinite]" />
                            )}
                            <item.icon
                                width={20}
                                height={20}
                                className={`transition-all duration-500 ${isActive ? 'text-[#00D09C] scale-110' : 'group-hover:text-white group-hover:scale-110'}`}
                            />
                            <span className="text-[11px] font-black tracking-widest uppercase transition-all duration-500">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1 h-1 bg-[#00D09C] rounded-full shadow-[0_0_10px_#00D09C]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[#00D09C]">
                            <Pin width={18} height={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] uppercase font-black text-white/20 tracking-widest">Selected Region</span>
                            <span className="text-xs font-black truncate text-white/80">Mumbai Central, IN</span>
                        </div>
                    </div>
                    <button className="relative z-10 w-full py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-[#00D09C]">
                        Switch Location
                    </button>
                </div>
            </div>
        </aside>
    );
}
