'use client';

import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { 
    path: '/', 
    icon: (isActive) => (
      <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-[#00D09C]' : 'text-[#707070]'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Home' 
  },
  { 
    path: '/forecast', 
    icon: (isActive) => (
      <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-[#00D09C]' : 'text-[#707070]'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    label: 'Forecast' 
  },
  { 
    path: '/community', 
    icon: (isActive) => (
      <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-[#00D09C]' : 'text-[#707070]'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    label: 'Community' 
  },
  { 
    path: '/insights', 
    icon: (isActive) => (
      <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-[#00D09C]' : 'text-[#707070]'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: 'Insights' 
  },
  { 
    path: '/profile', 
    icon: (isActive) => (
      <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-[#00D09C]' : 'text-[#707070]'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: 'Profile' 
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-white/5 z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                  isActive ? 'bg-[#00D09C]/15' : 'hover:bg-white/5'
                }`}
              >
                <div className="mb-1">
                  {item.icon(isActive)}
                </div>
                <span className={`text-[11px] font-medium ${
                  isActive ? 'text-[#00D09C]' : 'text-[#6B6B6B]'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

