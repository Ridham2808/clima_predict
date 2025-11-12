'use client';

import BottomNavigation from '@/components/BottomNavigation';

const weatherStats = {
  avgTemp: 28,
  totalRainfall: 145,
  sunnyDays: 22,
  avgWindSpeed: 15
};

const achievements = [
  { icon: '🏆', title: 'Weather Expert', description: 'Checked weather 100 times', unlocked: true },
  { icon: '⚡', title: 'Early Bird', description: 'Check weather before 6 AM', unlocked: true },
  { icon: '🌟', title: 'Week Streak', description: 'Used app for 7 days straight', unlocked: false, progress: 60 },
];

export default function Insights() {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Insights</h1>
              <p className="text-xs sm:text-sm text-white/60 mt-0.5">Your weather analytics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* Quick Stats */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10">
              <div className="text-3xl mb-2">🌡️</div>
              <div className="text-xl sm:text-2xl font-bold text-orange-400 mb-1">{weatherStats.avgTemp}°C</div>
              <div className="text-xs sm:text-sm text-white/60">Avg Temp</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10">
              <div className="text-3xl mb-2">🌧️</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">{weatherStats.totalRainfall}mm</div>
              <div className="text-xs sm:text-sm text-white/60">Total Rain</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10">
              <div className="text-3xl mb-2">☀️</div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">{weatherStats.sunnyDays}</div>
              <div className="text-xs sm:text-sm text-white/60">Sunny Days</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10">
              <div className="text-3xl mb-2">💨</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-1">{weatherStats.avgWindSpeed}</div>
              <div className="text-xs sm:text-sm text-white/60">km/h Wind</div>
            </div>
          </div>
        </section>

        {/* Explore Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Explore</h2>
          <div className="space-y-3">
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 rounded-xl p-3">
                  <span className="text-2xl sm:text-3xl">🌱</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold">Farming Tips</div>
                  <div className="text-xs sm:text-sm text-white/60">AI-powered recommendations</div>
                </div>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 rounded-xl p-3">
                  <span className="text-2xl sm:text-3xl">🌾</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold">Crop Health</div>
                  <div className="text-xs sm:text-sm text-white/60">Monitor your crops</div>
                </div>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/20 rounded-xl p-3">
                  <span className="text-2xl sm:text-3xl">💰</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold">Market Prices</div>
                  <div className="text-xs sm:text-sm text-white/60">Live crop prices</div>
                </div>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            <button className="w-full bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 rounded-xl p-3">
                  <span className="text-2xl sm:text-3xl">📊</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold">Statistics</div>
                  <div className="text-xs sm:text-sm text-white/60">Historical data</div>
                </div>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border ${
                  achievement.unlocked ? 'border-green-500/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-3 ${
                      achievement.unlocked ? 'bg-green-500/20' : 'bg-white/5'
                    }`}
                    style={{ opacity: achievement.unlocked ? 1 : 0.4 }}
                  >
                    <span className="text-2xl sm:text-3xl">{achievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm sm:text-base font-semibold mb-1">{achievement.title}</div>
                    <div className="text-xs sm:text-sm text-white/60 mb-2">{achievement.description}</div>
                    {!achievement.unlocked && achievement.progress && (
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
