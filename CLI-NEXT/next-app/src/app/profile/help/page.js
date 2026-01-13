'use client';

import Link from 'next/link';
import {
    NavArrowRight,
    QuestionMark,
    Rocket,
    CloudSunny,
    Mail,
    ChatBubble,
    Journal,
    Flash,
    Settings,
    Pin
} from 'iconoir-react';

export default function HelpSupport() {
    return (
        <div className="min-h-screen text-white pb-12 uppercase">
            <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
                <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
                    <Link href="/profile" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
                        <NavArrowRight className="rotate-180" width={20} height={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Support Terminal</h1>
                        <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Resolution protocols and operational guidance</p>
                    </div>
                </header>

                <div className="mb-12">
                    <div className="bg-gradient-to-br from-[#4D9FFF] to-[#9D4EDD] rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="p-8 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30 mb-8">
                                <QuestionMark width={48} height={48} className="text-white" />
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-[#0D0D0D] tracking-tighter mb-2">Technical Assistance</h2>
                            <p className="text-[#0D0D0D]/40 text-xs font-black tracking-widest uppercase">Query the knowledge matrix or initiate support dispatch</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Getting Started */}
                    <div>
                        <div className="flex items-center gap-4 mb-8 ml-2">
                            <div className="p-3 bg-[#00D09C]/10 rounded-2xl border border-[#00D09C]/10 text-[#00D09C]">
                                <Flash width={24} height={24} />
                            </div>
                            <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Initial Onboarding</h2>
                        </div>
                        <div className="space-y-4">
                            <FAQItem
                                question="How do I add my farm location?"
                                answer="Go to Settings and add a new location"
                                icon={Pin}
                            />
                            <FAQItem
                                question="How to connect IoT sensors?"
                                answer="Navigate to Sensors page and click Add Sensor"
                                icon={Settings}
                            />
                        </div>
                    </div>

                    {/* Weather & Forecasts */}
                    <div>
                        <div className="flex items-center gap-4 mb-8 ml-2">
                            <div className="p-3 bg-[#4D9FFF]/10 rounded-2xl border border-[#4D9FFF]/10 text-[#4D9FFF]">
                                <CloudSunny width={24} height={24} />
                            </div>
                            <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Climatic Analytics</h2>
                        </div>
                        <div className="space-y-4">
                            <FAQItem
                                question="How accurate are the forecasts?"
                                answer="We use multiple sources with 85-90% accuracy"
                                icon={Flash}
                            />
                            <FAQItem
                                question="Can I see historical weather data?"
                                answer="Yes, go to Weather Statistics for historical data"
                                icon={Journal}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <button className="w-full max-w-sm bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-[2rem] py-5 text-[#0D0D0D] font-black tracking-[0.2em] text-xs hover:opacity-90 shadow-2xl active:scale-95 transition-all uppercase">
                        Dispatch Support
                    </button>
                    <button className="w-full max-w-sm bg-white/5 border border-white/5 rounded-[2rem] py-5 text-white/40 font-black tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all uppercase">
                        support@climapredict.com
                    </button>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer, icon: Icon }) {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 group hover:bg-white/[0.08] transition-all">
            <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-white/20 group-hover:text-white transition-colors">
                    <Icon width={24} height={24} />
                </div>
                <div>
                    <h3 className="text-base font-black text-white mb-2 uppercase tracking-tight leading-tight">{question}</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{answer}</p>
                </div>
            </div>
        </div>
    );
}
