'use client';

import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white pb-6">
            <div className="max-w-md mx-auto">
                <header className="px-5 pt-5 pb-4 flex items-center gap-4">
                    <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span className="text-xl">←</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white flex-1">About</h1>
                </header>

                <div className="px-5 mb-6">
                    <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-2xl p-8 text-center">
                        <span className="text-6xl mb-4 block">🌾</span>
                        <h2 className="text-2xl font-bold text-white mb-2">ClimaPredict</h2>
                        <p className="text-sm text-white/80 mb-4">Smart Farming Intelligence Platform</p>
                        <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                            Version 1.0.0
                        </div>
                    </div>
                </div>

                <div className="px-5 space-y-4">
                    <div className="bg-[#252525] rounded-2xl p-5 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">About ClimaPredict</h3>
                        <p className="text-sm text-[#B0B0B0] leading-relaxed mb-3">
                            ClimaPredict is a comprehensive agricultural intelligence platform designed to empower farmers with data-driven insights for better decision-making.
                        </p>
                        <p className="text-sm text-[#B0B0B0] leading-relaxed">
                            We combine weather forecasting, IoT sensors, AI recommendations, and community features to help farmers optimize yields and reduce risks.
                        </p>
                    </div>

                    <div className="bg-[#252525] rounded-2xl p-5 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                        <div className="space-y-2">
                            {['Weather Forecasting', 'IoT Sensor Monitoring', 'AI-Powered Advice', 'Market Prices', 'Community Platform', 'Crop Health Tracking'].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="text-[#00D09C]">✓</span>
                                    <span className="text-sm text-[#B0B0B0]">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#252525] rounded-2xl p-5 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
                        <div className="space-y-2 text-sm text-[#B0B0B0]">
                            <div>📧 Email: support@climapredict.com</div>
                            <div>🌐 Website: www.climapredict.com</div>
                            <div>📱 Phone: +91 1800-XXX-XXXX</div>
                        </div>
                    </div>

                    <div className="bg-[#252525] rounded-2xl p-5 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">Legal</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left text-sm text-[#4D9FFF] hover:underline">Terms of Service</button>
                            <button className="w-full text-left text-sm text-[#4D9FFF] hover:underline">Privacy Policy</button>
                            <button className="w-full text-left text-sm text-[#4D9FFF] hover:underline">Licenses</button>
                        </div>
                    </div>

                    <div className="text-center text-sm text-[#707070] py-4">
                        © 2025 ClimaPredict. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
