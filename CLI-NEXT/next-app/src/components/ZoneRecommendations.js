'use client';

import { Bell, Clock, NavArrowRight, CheckCircle } from 'iconoir-react';

/**
 * Zone Recommendations Component
 * Displays actionable recommendations with priority and timing
 * Responsive: Scrollable list on desktop, stacked cards on mobile
 */

export default function ZoneRecommendations({ recommendations, loading, cropType }) {
    if (loading) {
        return (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 md:p-8">
                <div className="h-6 bg-white/10 rounded-xl w-1/2 mb-6 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/10 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const priorityConfig = {
        urgent: { color: '#FF3B30', icon: '🚨', label: 'URGENT' },
        high: { color: '#FF6B35', icon: '⚠️', label: 'HIGH' },
        moderate: { color: '#FFC857', icon: '📋', label: 'MODERATE' },
        advisory: { color: '#4D9FFF', icon: 'ℹ️', label: 'ADVISORY' }
    };

    const timingConfig = {
        immediate: { label: 'Now', color: '#FF3B30' },
        next_24_hours: { label: '24 hrs', color: '#FF6B35' },
        next_48_hours: { label: '48 hrs', color: '#FFC857' },
        this_week: { label: 'This Week', color: '#4D9FFF' }
    };

    return (
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 md:p-8 h-full">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#00D09C]/10 rounded-xl">
                        <Bell width={20} height={20} className="text-[#00D09C]" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white">Recommendations</h3>
                </div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                    AI-Generated Actions • {cropType}
                </p>
            </div>

            {/* Recommendations List */}
            {recommendations.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-sm font-bold text-white/40">
                        No urgent actions needed
                    </p>
                    <p className="text-xs text-white/30 mt-2">
                        All conditions are optimal
                    </p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {recommendations.map((rec, index) => {
                        const priority = priorityConfig[rec.priority] || priorityConfig.moderate;
                        const timing = timingConfig[rec.timing] || timingConfig.this_week;

                        return (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden"
                            >
                                {/* Priority Indicator Strip */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1"
                                    style={{ backgroundColor: priority.color }}
                                />

                                {/* Content */}
                                <div className="pl-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{priority.icon}</span>
                                            <span
                                                className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
                                                style={{
                                                    backgroundColor: `${priority.color}20`,
                                                    color: priority.color
                                                }}
                                            >
                                                {priority.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/40">
                                            <Clock width={14} height={14} />
                                            <span>{timing.label}</span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <p className="text-sm font-bold text-white leading-relaxed mb-3 group-hover:text-white/90 transition-colors">
                                        {rec.action}
                                    </p>

                                    {/* Category Tag */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                                            {rec.category.replace(/_/g, ' ')}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <NavArrowRight width={16} height={16} className="text-white/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer - SMS Alert Option */}
            {recommendations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <button className="w-full bg-[#00D09C]/10 hover:bg-[#00D09C]/20 border border-[#00D09C]/20 hover:border-[#00D09C]/40 rounded-2xl px-4 py-3 text-sm font-bold text-[#00D09C] transition-all flex items-center justify-center gap-2 group">
                        <Bell width={16} height={16} className="group-hover:animate-bounce" />
                        Send SMS Alerts
                    </button>
                </div>
            )}
        </div>
    );
}
