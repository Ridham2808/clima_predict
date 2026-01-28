'use client';

import { useState } from 'react';
import { Bell, Clock, NavArrowRight, InfoCircle, ShoppingBag, CheckCircle, Leaf } from 'iconoir-react';

/**
 * Expert Zone Recommendations
 * Displays detailed, actionable agronomy advice with AI explainability
 */
export default function ZoneRecommendations({ advice, loading, onApplyAction }) {
    const [expandedRec, setExpandedRec] = useState(null);
    const [showLogic, setShowLogic] = useState(false);

    if (loading || !advice) {
        return (
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-8 bg-white/10 rounded-xl w-48 animate-pulse" />
                    <div className="h-8 bg-white/5 rounded-xl w-24 animate-pulse" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-[2rem] space-y-3">
                            <div className="h-2 bg-white/20 rounded w-1/4 animate-pulse" />
                            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-6 bg-white/5 rounded-lg w-16 animate-pulse" />
                                <div className="h-6 bg-white/5 rounded-lg w-20 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-auto pt-6 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] animate-pulse">
                        Synchronising Neural Path...
                    </p>
                </div>
            </div>
        );
    }

    const interventions = advice.interventions || [];
    const forbidden = advice.forbiddenActions || [];
    const diagnosis = advice.healthDiagnosis || {};

    return (
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="p-2 bg-[#00D09C]/10 rounded-xl">
                            <Leaf className="text-[#00D09C]" width={20} height={20} />
                        </div>
                        Action Plan
                    </h3>
                    <p className="text-[10px] font-black text-[#00D09C] uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#00D09C] rounded-full animate-pulse" />
                        Real-Time AI Neural Diagnosis
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Forecast: </span>
                    <span className="text-[10px] font-black text-[#4D9FFF] uppercase tracking-widest">Growing Stable</span>
                </div>
            </div>

            {/* Forbidden Actions - CRITICAL WARNINGS */}
            {forbidden.length > 0 && (
                <div className="mb-8 space-y-3">
                    <div className="text-[10px] font-black text-[#FF6B35] uppercase tracking-[0.3em] px-1">⚠️ Forbidden Actions (Immediate Danger)</div>
                    {forbidden.map((item, i) => (
                        <div key={i} className="p-4 bg-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-[#FF6B35]/20 rounded-lg shrink-0">
                                <CheckCircle className="text-[#FF6B35] rotate-45" width={16} height={16} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-wider">{item.action}</p>
                                <p className="text-[10px] text-[#FF6B35] font-bold mt-0.5 leading-relaxed">{item.reason}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Step-by-Step Interventions */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-1">Evidence-Based Interventions</div>

                {interventions.map((step, index) => (
                    <div
                        key={index}
                        className={`bg-white/5 border border-white/10 rounded-[2.5rem] p-6 transition-all relative overflow-hidden ${expandedRec === index ? 'ring-2 ring-[#00D09C]/30 bg-white/[0.08]' : 'hover:bg-white/[0.07]'}`}
                    >
                        {/* Summary Header */}
                        <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedRec(expandedRec === index ? null : index)}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00D09C] text-[#0D0D0D] text-[10px] font-black">
                                        {step.step || index + 1}
                                    </span>
                                    <h4 className="text-base font-black text-white leading-tight uppercase tracking-tight">
                                        {step.title}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">
                                        <Clock width={12} height={12} />
                                        {step.when || 'Optimal Window'}
                                    </div>
                                    <div className="text-[10px] font-black text-[#00D09C] uppercase tracking-widest">
                                        +{step.impact || '5%'} Yield Impact
                                    </div>
                                </div>
                            </div>
                            <NavArrowRight
                                className={`text-white/20 transition-transform duration-300 mt-2 ${expandedRec === index ? 'rotate-90 text-[#00D09C]' : ''}`}
                                width={24} height={24}
                            />
                        </div>

                        {/* Detailed Logic Box */}
                        {expandedRec === index && (
                            <div className="mt-6 pt-6 border-t border-white/5 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                {/* The 4 Pillars */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LogicPoint label="What to do" value={step.what} color="#00D09C" />
                                    <LogicPoint label="Why this works" value={step.why} color="#4D9FFF" />
                                    <LogicPoint label="How to apply" value={step.how} color="#FFC857" />
                                    <LogicPoint label="Best timing" value={step.when} color="#9D4EDD" />
                                </div>

                                {/* Product Integration */}
                                {step.products?.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Recommended Professional Products</div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {step.products.map((prod, pi) => (
                                                <div key={pi} className="p-5 bg-white/5 border border-white/10 rounded-3xl group/prod">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#00D09C] uppercase tracking-widest mb-1">Official Brand</p>
                                                            <h5 className="text-lg font-black text-white">{prod.brand}</h5>
                                                            <p className="text-xs font-bold text-white/40 mt-0.5">Estimated: {prod.price}</p>
                                                        </div>
                                                        <a
                                                            href={prod.buyLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00D09C] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[#00D09C]/20"
                                                        >
                                                            <ShoppingBag width={16} height={16} />
                                                            Buy from Trusted Source
                                                        </a>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-4">
                                                        <div>
                                                            <p className="text-[9px] font-black text-[#00D09C] uppercase tracking-widest mb-3">Technical Pros</p>
                                                            <div className="space-y-2">
                                                                {prod.pros?.map((p, li) => (
                                                                    <div key={li} className="text-[10px] text-white/60 font-medium flex items-start gap-2">
                                                                        <CheckCircle className="text-[#00D09C] mt-0.5 shrink-0" width={12} height={12} />
                                                                        {p}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-[#FF6B35] uppercase tracking-widest mb-3">Constraints</p>
                                                            <div className="space-y-2">
                                                                {prod.cons?.map((c, li) => (
                                                                    <div key={li} className="text-[10px] text-white/60 font-medium flex items-start gap-2 text-white/30">
                                                                        <div className="w-1.5 h-1.5 bg-white/10 rounded-full mt-1 shrink-0" />
                                                                        {c}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => onApplyAction({
                                        action: step.title,
                                        inputUsed: step.products?.[0]?.brand || 'Standard Procedure',
                                        dosage: step.what,
                                        decisionLogic: [step.why, step.how]
                                    })}
                                    className="w-full py-5 bg-[#111111] hover:bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 group"
                                >
                                    <CheckCircle className="text-[#00D09C] group-hover:scale-125 transition-transform" width={18} height={18} />
                                    {(advice.healthDiagnosis?.overallScore >= 85 || (advice.interventions && (advice.interventions[index]?.title?.toLowerCase().includes('monitor') || advice.interventions[index]?.what?.toLowerCase().includes('monitor'))))
                                        ? 'Monitor Crop Health'
                                        : 'Mark Action as Applied'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Impact Summary Section - RESPONSIVE STACKING */}
            {advice.impactPrediction && (
                <div className="mt-auto pt-8 border-t border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <ImpactStat label="Yield Impact" value={advice.impactPrediction.yieldChange} color="#00D09C" />
                        <ImpactStat label="Quality Focus" value={advice.impactPrediction.qualityImprovement} color="#4D9FFF" />
                        <div className="col-span-2 md:col-span-1">
                            <ImpactStat
                                label="Risk Registry"
                                value={advice.healthDiagnosis?.overallScore >= 85 ? 'Optimized Trajectory' : (advice.impactPrediction.riskIfIgnored || 'Under Assessment')}
                                color={advice.healthDiagnosis?.overallScore >= 85 ? '#00D09C' : '#FF6B35'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function LogicPoint({ label, value, color }) {
    if (!value) return null;
    return (
        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-[1.8rem] space-y-1 group hover:bg-white/5 transition-colors">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color }}>{label}</div>
            <p className="text-[11px] text-white/80 font-bold leading-relaxed">{value}</p>
        </div>
    );
}

function ImpactStat({ label, value, color }) {
    return (
        <div className="text-center md:text-left space-y-1">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">{label}</p>
            <p className="text-[13px] font-bold truncate" style={{ color }}>{value}</p>
        </div>
    );
}
