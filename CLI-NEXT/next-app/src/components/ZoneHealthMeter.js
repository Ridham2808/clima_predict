'use client';

import { NavArrowUp, NavArrowDown } from 'iconoir-react';


/**
 * Zone Health Meter Component
 * Visual gauge showing 0-100 health score with breakdown
 * Responsive: Large card on desktop, compact on mobile
 */

export default function ZoneHealthMeter({ zoneHealth, loading, zoneName }) {
    if (loading) {
        return (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-10 animate-pulse">
                <div className="h-8 bg-white/10 rounded-xl w-1/2 mb-6" />
                <div className="h-32 bg-white/10 rounded-full mx-auto mb-6" />
                <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded-lg" />
                    <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                </div>
            </div>
        );
    }

    if (!zoneHealth) {
        return (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-10 text-center">
                <div className="text-white/40 font-bold">No health data available</div>
            </div>
        );
    }

    const { overallScore, healthLevel, trend, breakdown, confidence } = zoneHealth;

    // Calculate circular progress
    const circumference = 2 * Math.PI * 70; // radius = 70
    const strokeDashoffset = circumference - (overallScore / 100) * circumference;

    return (
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Background Glow Effect */}
            <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: healthLevel.color }}
            />

            {/* Header */}
            <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg md:text-xl font-black text-white">{zoneName || 'Zone'} Health</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{healthLevel.icon}</span>
                        {trend.direction !== 'stable' && (
                            <div className={`flex items-center gap-1 ${trend.direction === 'improving' ? 'text-[#00D09C]' : 'text-[#FF6B35]'
                                }`}>
                                {trend.direction === 'improving' ? (
                                    <NavArrowUp width={16} height={16} />
                                ) : (
                                    <NavArrowDown width={16} height={16} />
                                )}
                                <span className="text-xs font-bold">{Math.abs(trend.change)}%</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                    Overall Health Index
                </div>
            </div>

            {/* Circular Health Gauge */}
            <div className="relative z-10 flex flex-col items-center mb-8">
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="70"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="50%"
                            cy="50%"
                            r="70"
                            stroke={healthLevel.color}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                            style={{ filter: `drop-shadow(0 0 10px ${healthLevel.color}40)` }}
                        />
                    </svg>

                    {/* Center Score */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                            className="text-6xl md:text-7xl font-black tracking-tighter mb-1 transition-all duration-500"
                            style={{ color: healthLevel.color }}
                        >
                            {overallScore}
                        </div>
                        <div className="text-xs font-black uppercase tracking-widest text-white/40">
                            {healthLevel.level}
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Breakdown */}
            <div className="relative z-10 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">
                    Health Factors
                </div>

                {/* Crop Vigor */}
                {breakdown.cropVigor && (
                    <HealthFactorBar
                        label="Crop Vigor"
                        score={breakdown.cropVigor.score}
                        icon="🌱"
                        color="#00D09C"
                    />
                )}

                {/* Weather Stress */}
                {breakdown.weatherStress && (
                    <HealthFactorBar
                        label="Weather Stress"
                        score={breakdown.weatherStress.score}
                        icon="🌡️"
                        color="#4D9FFF"
                    />
                )}

                {/* Soil Moisture */}
                {breakdown.soilMoisture && (
                    <HealthFactorBar
                        label="Soil Moisture"
                        score={breakdown.soilMoisture.score}
                        icon="💧"
                        color="#9D4EDD"
                    />
                )}

                {/* Growth Stage */}
                {breakdown.growthStage && (
                    <HealthFactorBar
                        label="Growth Stage"
                        score={breakdown.growthStage.score}
                        icon="📈"
                        color="#FFC857"
                    />
                )}

                {/* Disease Risk (inverted display) */}
                {breakdown.diseaseRisk && (
                    <HealthFactorBar
                        label="Disease Risk"
                        score={breakdown.diseaseRisk.score}
                        icon="🛡️"
                        color={breakdown.diseaseRisk.score > 70 ? '#00D09C' : '#FF6B35'}
                    />
                )}
            </div>

            {/* Confidence Indicator */}
            <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white/40">Data Confidence</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${confidence.score > 75 ? 'bg-[#00D09C]' :
                            confidence.score > 50 ? 'bg-[#FFC857]' : 'bg-[#FF6B35]'
                            } animate-pulse`} />
                        <span className="font-black text-white">{confidence.score}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Health Factor Bar Component
 * Shows individual factor score with progress bar
 */
function HealthFactorBar({ label, score, icon, color }) {
    return (
        <div className="group">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-sm">{icon}</span>
                    <span className="text-xs font-bold text-white/60 group-hover:text-white/80 transition-colors">
                        {label}
                    </span>
                </div>
                <span className="text-xs font-black text-white">{score}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${score}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}40`
                    }}
                />
            </div>
        </div>
    );
}
