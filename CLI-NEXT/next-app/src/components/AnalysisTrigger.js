'use client';

import { useState, useEffect } from 'react';
import { NavArrowRight, Cloud, Leaf, Database, Check, WarningTriangle } from 'iconoir-react';

/**
 * Analysis Trigger Component - STEP 4
 * Shows simulated processing of satellite, AI and field data
 */

export default function AnalysisTrigger({ onComplete }) {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        { label: 'Fetching Satellite NDVI/EVI Data', icon: Cloud, color: '#4D9FFF' },
        { label: 'AI Deep Learning: Pest & Disease Detection', icon: Leaf, color: '#00D09C' },
        { label: 'Data Fusion: Weather + Soil + Sensors', icon: Database, color: '#FFC857' },
        { label: 'Generating Zone Health Reports', icon: Check, color: '#00D09C' }
    ];

    useEffect(() => {
        const totalTime = 4000; // 4 seconds total
        const interval = 50;
        const increment = (interval / totalTime) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 8000); // Give user time to see success
                    return 100;
                }

                // Update current step based on progress
                const currentIdx = Math.floor((next / 100) * steps.length);
                if (currentIdx !== step && currentIdx < steps.length) {
                    setStep(currentIdx);
                }

                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto py-20 text-center">
            <div className="relative inline-block mb-12">
                {/* Animated Rings */}
                <div className="absolute inset-0 bg-[#00D09C]/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white/5 flex items-center justify-center p-4">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="url(#grad)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="1000"
                            strokeDashoffset={1000 - (progress * 10)}
                            className="transition-all duration-100 ease-linear"
                        />
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00D09C" />
                                <stop offset="100%" stopColor="#4D9FFF" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="flex flex-col items-center">
                        <div className="text-5xl font-black text-white mb-2">{Math.round(progress)}%</div>
                        <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Analyzing</div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <h3 className="text-3xl font-black text-white tracking-tight">Crunching Field Data...</h3>
                <p className="text-white/40 font-medium max-w-md mx-auto">
                    Our AI models are processing images and fusing satellite data with your field conditions to provide precise recommendations.
                </p>

                <div className="max-w-md mx-auto space-y-4">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const isDone = i < step;
                        const isActive = i === step;

                        return (
                            <div
                                key={i}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-white/5 border-white/20' : isDone ? 'bg-[#00D09C]/5 border-[#00D09C]/20 opacity-60' : 'opacity-20 border-transparent'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'animate-bounce' : ''}`} style={{ backgroundColor: `${s.color}20` }}>
                                    <Icon width={20} height={20} style={{ color: s.color }} />
                                </div>
                                <span className={`text-sm font-bold flex-1 text-left ${isActive ? 'text-white' : 'text-white/40'}`}>
                                    {s.label}
                                </span>
                                {isDone && <Check width={18} height={18} className="text-[#00D09C]" />}
                                {isActive && <div className="w-2 h-2 bg-[#00D09C] rounded-full animate-ping" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
