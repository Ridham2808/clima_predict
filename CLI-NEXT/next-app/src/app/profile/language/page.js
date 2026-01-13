'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  NavArrowRight,
  Globe,
  CheckCircle,
  Pin
} from 'iconoir-react';

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', icon: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', icon: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', icon: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', icon: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', icon: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', icon: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', icon: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', icon: '🇮🇳' },
  ];

  return (
    <div className="min-h-screen text-white pb-12 uppercase">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/profile" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Linguistic Protocol</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Multi-regional syntax localization</p>
          </div>
        </header>

        <div className="mb-12">
          <div className="bg-gradient-to-br from-[#9D4EDD] to-[#4D9FFF] rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-8 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30 mb-8">
                <Globe width={48} height={48} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-[#0D0D0D] tracking-tighter mb-2">Select Regional Dialect</h2>
              <p className="text-[#0D0D0D]/40 text-xs font-black tracking-widest uppercase">System-wide semantic localization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`relative overflow-hidden group rounded-[2.5rem] p-8 border transition-all duration-500 text-left ${selectedLanguage === lang.code
                ? 'bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] border-transparent shadow-2xl scale-[1.02]'
                : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{lang.icon}</span>
                <div className={`text-lg font-black uppercase tracking-tight mb-1 ${selectedLanguage === lang.code ? 'text-[#0D0D0D]' : 'text-white'}`}>
                  {lang.name}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedLanguage === lang.code ? 'text-[#0D0D0D]/40' : 'text-white/20'}`}>
                  {lang.nativeName}
                </div>

                {selectedLanguage === lang.code && (
                  <div className="absolute top-4 right-4 text-[#0D0D0D]">
                    <CheckCircle width={20} height={20} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-[2rem] py-5 text-[#0D0D0D] font-black tracking-[0.2em] text-xs hover:opacity-90 shadow-2xl active:scale-95 transition-all uppercase">
            Initialize Localization
          </button>
        </div>
      </div>
    </div>
  );
}
