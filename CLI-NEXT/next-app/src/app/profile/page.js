'use client';

import BottomNavigation from '@/components/BottomNavigation';

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-4 border-4 border-white/20">
              <span className="text-4xl sm:text-5xl">👤</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Farmer Name</h1>
            <p className="text-sm sm:text-base text-white/70 mb-6">Surat, Gujarat</p>
            <div className="grid grid-cols-3 gap-6 sm:gap-8 w-full max-w-md">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">15.5</div>
                <div className="text-xs sm:text-sm text-white/70">Acres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">4</div>
                <div className="text-xs sm:text-sm text-white/70">Crops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">85%</div>
                <div className="text-xs sm:text-sm text-white/70">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Account Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Account</h2>
          <div className="space-y-3">
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-green-500/20 rounded-xl p-3">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">Edit Profile</div>
                <div className="text-xs sm:text-sm text-white/60">Update your information</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-blue-500/20 rounded-xl p-3">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">Insurance</div>
                <div className="text-xs sm:text-sm text-white/60">Crop insurance details</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-purple-500/20 rounded-xl p-3">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">Notifications</div>
                <div className="text-xs sm:text-sm text-white/60">Manage preferences</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Resources Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Resources</h2>
          <div className="space-y-3">
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-yellow-500/20 rounded-xl p-3">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">Weather Tips</div>
                <div className="text-xs sm:text-sm text-white/60">Learn patterns</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-orange-500/20 rounded-xl p-3">
                <span className="text-2xl">📰</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">News & Updates</div>
                <div className="text-xs sm:text-sm text-white/60">Latest agriculture news</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-blue-500/20 rounded-xl p-3">
                <span className="text-2xl">❓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">Help & Support</div>
                <div className="text-xs sm:text-sm text-white/60">Get help</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Settings Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Settings</h2>
          <div className="space-y-3">
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-green-500/20 rounded-xl p-3">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">App Settings</div>
                <div className="text-xs sm:text-sm text-white/60">Configure preferences</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-purple-500/20 rounded-xl p-3">
                <span className="text-2xl">🌐</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">Language</div>
                <div className="text-xs sm:text-sm text-white/60">English</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99] flex items-center gap-4">
              <div className="bg-white/10 rounded-xl p-3">
                <span className="text-2xl">ℹ️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold">About</div>
                <div className="text-xs sm:text-sm text-white/60">Version 1.0.0</div>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Logout Button */}
        <section className="mb-6">
          <button className="w-full bg-gradient-to-r from-red-600 to-red-500 rounded-xl sm:rounded-2xl p-4 text-white font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 active:scale-[0.98]">
            Logout
          </button>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

