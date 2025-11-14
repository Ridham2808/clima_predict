'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-6">
      <div className="max-w-md mx-auto">
        <header className="px-5 pt-5 pb-4 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-2xl font-bold text-white flex-1">Language</h1>
        </header>

        <div className="px-5 mb-6">
          <div className="bg-gradient-to-br from-[#9D4EDD] to-[#4D9FFF] rounded-2xl p-5 text-center">
            <span className="text-5xl mb-3 block">🌐</span>
            <h2 className="text-xl font-bold text-white mb-2">Choose Your Language</h2>
            <p className="text-sm text-white/80">Select your preferred language</p>
          </div>
        </div>

        <div className="px-5 space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full rounded-2xl p-4 border transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] border-transparent'
                  : 'bg-[#252525] border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{lang.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-base font-semibold text-white">{lang.name}</div>
                  <div className="text-sm text-white/70">{lang.nativeName}</div>
                </div>
                {selectedLanguage === lang.code && (
                  <span className="text-2xl">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 mt-6">
          <button className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-xl py-3 text-white font-semibold">
            Save Language
          </button>
        </div>
      </div>
    </div>
  );
}
