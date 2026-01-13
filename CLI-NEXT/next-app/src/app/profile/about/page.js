'use client';

import Link from 'next/link';
import {
    NavArrowRight,
    InfoCircle,
    CheckCircle,
    Mail,
    Globe,
    Phone,
    OrganicFood,
    Db,
    Journal,
    Flash
} from 'iconoir-react';

export default function About() {
    return (
        <div className="min-h-screen text-white pb-12 uppercase">
            <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
                <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
                    <Link href="/profile" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
                        <NavArrowRight className="rotate-180" width={20} height={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">System Manifest</h1>
                        <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Foundational objectives and statutory disclosures</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Brand Banner */}
                    <div className="lg:col-span-12">
                        <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="p-8 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30 mb-8 group-hover:scale-105 transition-transform duration-500">
                                    <OrganicFood width={80} height={80} className="text-white" />
                                </div>
                                <h1 className="text-4xl md:text-7xl font-black text-[#0D0D0D] tracking-tighter mb-4">ClimaPredict</h1>
                                <p className="text-[#0D0D0D]/40 text-xs md:text-base font-black tracking-[0.3em] uppercase mb-10 italic">Smart Farming Intelligence Platform</p>
                                <div className="inline-flex items-center gap-3 bg-[#0D0D0D] text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest shadow-2xl border border-white/5">
                                    <Flash width={16} height={16} className="text-[#00D09C]" />
                                    Version 1.0.0 Stable
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="lg:col-span-12">
                        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 md:p-14 border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 max-w-4xl">
                                <h2 className="text-3xl font-black text-white uppercase mb-8 leading-tight group-hover:text-[#00D09C] transition-colors">Platform Philosophy</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <p className="text-sm md:text-lg text-white/40 font-medium leading-relaxed">
                                        ClimaPredict is a comprehensive agricultural intelligence platform designed to empower farmers with data-driven insights for better decision-making. We combine weather forecasting, IoT sensors, AI recommendations, and community features to help farmers optimize yields and reduce risks.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-[#00D09C] uppercase tracking-[0.4em] mb-4">Core Capacities</div>
                                        {['Weather Forecasting', 'IoT Sensor Monitoring', 'AI-Powered Advice', 'Market Prices', 'Community Platform', 'Crop Health Tracking'].map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-all">
                                                <CheckCircle width={18} height={18} className="text-[#00D09C]" />
                                                <span className="text-xs font-black text-white/60 tracking-widest uppercase">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Communication & Legal */}
                    <div className="lg:col-span-6">
                        <h2 className="text-[10px] font-black text-white/30 tracking-[0.4em] mb-6 ml-2">Support Vector</h2>
                        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-white/5 space-y-4">
                            <ContactItem icon={Mail} label="Email Dispatch" value="support@climapredict.com" />
                            <ContactItem icon={Globe} label="Digital Hub" value="www.climapredict.com" />
                            <ContactItem icon={Phone} label="Voice Telemetry" value="+91 1800-XXX-XXXX" />
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <h2 className="text-[10px] font-black text-white/30 tracking-[0.4em] mb-6 ml-2">Statutory Framework</h2>
                        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-white/5 space-y-4">
                            <Link href="#" className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                                <div className="text-[10px] font-black tracking-widest uppercase group-hover:text-white transition-colors">Terms of Service</div>
                                <NavArrowRight width={16} height={16} className="text-white/20" />
                            </Link>
                            <Link href="#" className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                                <div className="text-[10px] font-black tracking-widest uppercase group-hover:text-white transition-colors">Privacy Policy</div>
                                <NavArrowRight width={16} height={16} className="text-white/20" />
                            </Link>
                            <Link href="#" className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                                <div className="text-[10px] font-black tracking-widest uppercase group-hover:text-white transition-colors">Licenses</div>
                                <NavArrowRight width={16} height={16} className="text-white/20" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12 text-center text-[10px] font-black text-white/20 tracking-[0.5em] py-12 uppercase">
                        © 2026 ClimaPredict Neural Dynamics. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
            <div className="p-4 bg-white/5 rounded-xl text-white/20 group-hover:text-[#00D09C] transition-colors">
                <Icon width={24} height={24} />
            </div>
            <div>
                <div className="text-[8px] font-black text-white/20 tracking-widest mb-1">{label}</div>
                <div className="text-xs font-black text-white whitespace-nowrap">{value}</div>
            </div>
        </div>
    );
}
