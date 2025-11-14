'use client';

import Link from 'next/link';

export default function HelpSupport() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white pb-6">
            <div className="max-w-md mx-auto">
                <header className="px-5 pt-5 pb-4 flex items-center gap-4">
                    <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span className="text-xl">←</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white flex-1">Help and Support</h1>
                </header>

                <div className="px-5 mb-6">
                    <div className="bg-gradient-to-br from-[#4D9FFF] to-[#9D4EDD] rounded-2xl p-5 text-center">
                        <span className="text-5xl mb-3 block">❓</span>
                        <h2 className="text-xl font-bold text-white mb-2">How can we help?</h2>
                        <p className="text-sm text-white/80">Find answers or contact support</p>
                    </div>
                </div>

                <div className="px-5 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">🚀</span>
                            <h3 className="text-lg font-semibold text-white">Getting Started</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-[#252525] rounded-2xl p-4 border border-white/10">
                                <div className="text-base font-semibold text-white mb-2">How do I add my farm location?</div>
                                <div className="text-sm text-[#B0B0B0]">Go to Settings and add a new location</div>
                            </div>
                            <div className="bg-[#252525] rounded-2xl p-4 border border-white/10">
                                <div className="text-base font-semibold text-white mb-2">How to connect IoT sensors?</div>
                                <div className="text-sm text-[#B0B0B0]">Navigate to Sensors page and click Add Sensor</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">🌤️</span>
                            <h3 className="text-lg font-semibold text-white">Weather and Forecasts</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-[#252525] rounded-2xl p-4 border border-white/10">
                                <div className="text-base font-semibold text-white mb-2">How accurate are the forecasts?</div>
                                <div className="text-sm text-[#B0B0B0]">We use multiple sources with 85-90% accuracy</div>
                            </div>
                            <div className="bg-[#252525] rounded-2xl p-4 border border-white/10">
                                <div className="text-base font-semibold text-white mb-2">Can I see historical weather data?</div>
                                <div className="text-sm text-[#B0B0B0]">Yes, go to Weather Statistics for historical data</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 mt-6 space-y-3">
                    <button className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-xl py-3 text-white font-semibold">
                        Contact Support
                    </button>
                    <button className="w-full bg-[#252525] border border-white/10 rounded-xl py-3 text-white font-semibold">
                        Email: support@climapredict.com
                    </button>
                </div>
            </div>
        </div>
    );
}

