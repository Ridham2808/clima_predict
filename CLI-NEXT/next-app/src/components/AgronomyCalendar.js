'use client';

import { Calendar, Play, CheckCircle, WarningTriangle, NavArrowRight } from 'iconoir-react';

/**
 * Agronomy Calendar Component
 * Displays "What to apply now / next / avoid"
 */
export default function AgronomyCalendar({ schedule, loading }) {
    if (loading) {
        return (
            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-6" />
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-16 bg-white/10 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (!schedule) return null;

    return (
        <div className="bg-[#111111]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 h-full shadow-xl">
            <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-[#4D9FFF]" width={18} height={18} />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Crop Management Calendar</span>
            </div>

            <div className="space-y-6">
                {/* Apply Now */}
                <div>
                    <div className="text-[10px] font-black text-[#00D09C] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#00D09C] rounded-full animate-pulse" />
                        Apply Now
                    </div>
                    <div className="space-y-2">
                        {schedule.applyNow?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                <Play className="text-white/20" width={14} height={14} />
                                <p className="text-xs font-bold text-white leading-tight">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Apply Next */}
                <div>
                    <div className="text-[10px] font-black text-[#4D9FFF] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#4D9FFF] rounded-full" />
                        Coming Up Next
                    </div>
                    <div className="space-y-2">
                        {schedule.applyNext?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                <CheckCircle className="text-white/10" width={14} height={14} />
                                <p className="text-xs font-medium text-white/60 leading-tight">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Avoid Now */}
                {schedule.avoidNow?.length > 0 && (
                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                        <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <WarningTriangle className="text-red-400" width={14} height={14} />
                            Avoid Currently
                        </div>
                        <ul className="space-y-1">
                            {schedule.avoidNow.map((item, i) => (
                                <li key={i} className="text-[11px] font-bold text-red-400/80">• {item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Adjustment Logic */}
            <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-[2rem]">
                <p className="text-[10px] font-black text-white/20 uppercase mb-2">Weather Adjustment Logic</p>
                <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                    {schedule.adjustmentLogic}
                </p>
            </div>
        </div>
    );
}
