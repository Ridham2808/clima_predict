'use client';

import { useState, useEffect } from 'react';
import { Leaf, NavArrowUp, Droplet, AlertTriangle, Camera, Map as MapIcon } from 'iconoir-react';

import ZoneHealthMeter from './ZoneHealthMeter';
import FieldZoneMap from './FieldZoneMap';
import ZoneRecommendations from './ZoneRecommendations';
import PhotoAnalyzer from './PhotoAnalyzer';

/**
 * Precision Agriculture Dashboard
 * Main container for zone-based field management
 * Responsive design: Desktop (3-column) + Mobile (stacked)
 */

export default function PrecisionAgDashboard({ location, cropType = 'rice', daysAfterSowing = 45 }) {
    const [activeTab, setActiveTab] = useState('overview'); // Mobile tabs
    const [zoneHealth, setZoneHealth] = useState(null);
    const [latestAnalysis, setLatestAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState('zone_1');

    // Mock zones data (will be replaced with real field data)
    const zones = [
        { id: 'zone_1', name: 'North Field', area: 2.5, crop: cropType },
        { id: 'zone_2', name: 'South Field', area: 3.0, crop: cropType },
        { id: 'zone_3', name: 'East Field', area: 1.8, crop: cropType }
    ];

    useEffect(() => {
        fetchZoneHealth();
    }, [selectedZone, location]);

    const fetchZoneHealth = async (analysisData = latestAnalysis) => {
        setLoading(true);
        if (analysisData && analysisData.healthScore) {
            setLatestAnalysis(analysisData);
        }

        try {
            const response = await fetch(`/api/precision-ag/zone-health`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zoneId: selectedZone,
                    lat: location?.lat || 28.6139,
                    lon: location?.lon || 77.2090,
                    cropType,
                    daysAfterSowing,
                    sensorData: { soilMoisture: 65, temperature: 28 },
                    imageAnalysis: analysisData
                })
            });

            if (response.ok) {
                const result = await response.json();
                setZoneHealth(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch zone health:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-[#00D09C]/10 rounded-xl">
                                <Leaf width={28} height={28} className="text-[#00D09C]" />
                            </div>
                            Precision Agriculture
                        </h1>
                        <p className="text-white/40 text-sm font-medium mt-1">
                            Zone-based field intelligence • {cropType.charAt(0).toUpperCase() + cropType.slice(1)} • Day {daysAfterSowing}
                        </p>
                    </div>

                    {/* Zone Selector - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Active Zone:</span>
                        <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-[#00D09C] transition-all"
                        >
                            {zones.map(zone => (
                                <option key={zone.id} value={zone.id} className="bg-[#1A1A1A]">
                                    {zone.name} ({zone.area} ha)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Zone Selector - Mobile */}
                <div className="md:hidden mt-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {zones.map(zone => (
                            <button
                                key={zone.id}
                                onClick={() => setSelectedZone(zone.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${selectedZone === zone.id
                                    ? 'bg-[#00D09C] text-[#0D0D0D]'
                                    : 'bg-white/5 text-white/60 border border-white/10'
                                    }`}
                            >
                                {zone.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="md:hidden mb-6">
                <div className="flex bg-white/5 backdrop-blur-lg p-1.5 rounded-[1.5rem] border border-white/10">
                    {['overview', 'map', 'actions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-bold rounded-2xl capitalize transition-all duration-300 ${activeTab === tab
                                ? 'bg-[#00D09C] text-[#0D0D0D] shadow-lg shadow-[#00D09C]/20'
                                : 'text-white/40'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Layout - 3 Column Grid */}
            <div className="hidden md:grid grid-cols-12 gap-8">
                {/* Left Column: Zone Health + Quick Stats */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Zone Health Meter */}
                    <ZoneHealthMeter
                        zoneHealth={zoneHealth}
                        loading={loading}
                        zoneName={zones.find(z => z.id === selectedZone)?.name}
                    />

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 hover:bg-white/[0.07] transition-all group">
                            <div className="bg-[#4D9FFF]/10 p-3 rounded-2xl w-fit mb-3">
                                <Droplet width={24} height={24} className="text-[#4D9FFF]" />
                            </div>
                            <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Soil Moisture</div>
                            <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">
                                {zoneHealth?.breakdown?.soilMoisture?.value || '--'}%
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 hover:bg-white/[0.07] transition-all group">
                            <div className="bg-[#FFC857]/10 p-3 rounded-2xl w-fit mb-3">
                                <NavArrowUp width={24} height={24} className="text-[#FFC857]" />
                            </div>
                            <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Crop Vigor</div>
                            <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">
                                {zoneHealth?.breakdown?.cropVigor?.score || '--'}
                            </div>
                        </div>
                    </div>

                    {/* Photo Analyzer */}
                    <PhotoAnalyzer zoneId={selectedZone} onAnalysisComplete={fetchZoneHealth} />
                </div>

                {/* Middle Column: Field Map */}
                <div className="col-span-12 lg:col-span-5">
                    <FieldZoneMap
                        zones={zones}
                        selectedZone={selectedZone}
                        onZoneSelect={setSelectedZone}
                        zoneHealth={zoneHealth}
                        location={location}
                    />
                </div>

                {/* Right Column: Recommendations */}
                <div className="col-span-12 lg:col-span-3">
                    <ZoneRecommendations
                        recommendations={zoneHealth?.recommendations || []}
                        loading={loading}
                        cropType={cropType}
                    />
                </div>
            </div>

            {/* Mobile Layout - Tabbed Content */}
            <div className="md:hidden">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Zone Health Meter */}
                        <ZoneHealthMeter
                            zoneHealth={zoneHealth}
                            loading={loading}
                            zoneName={zones.find(z => z.id === selectedZone)?.name}
                        />

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                <div className="bg-[#4D9FFF]/10 p-3 rounded-2xl w-fit mb-3">
                                    <Droplet width={20} height={20} className="text-[#4D9FFF]" />
                                </div>
                                <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Moisture</div>
                                <div className="text-2xl font-black text-white">
                                    {zoneHealth?.breakdown?.soilMoisture?.value || '--'}%
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                <div className="bg-[#FFC857]/10 p-3 rounded-2xl w-fit mb-3">
                                    <NavArrowUp width={20} height={20} className="text-[#FFC857]" />
                                </div>
                                <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Vigor</div>
                                <div className="text-2xl font-black text-white">
                                    {zoneHealth?.breakdown?.cropVigor?.score || '--'}
                                </div>
                            </div>
                        </div>

                        {/* Photo Analyzer */}
                        <PhotoAnalyzer zoneId={selectedZone} onAnalysisComplete={fetchZoneHealth} />
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <FieldZoneMap
                            zones={zones}
                            selectedZone={selectedZone}
                            onZoneSelect={setSelectedZone}
                            zoneHealth={zoneHealth}
                            location={location}
                        />
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <ZoneRecommendations
                            recommendations={zoneHealth?.recommendations || []}
                            loading={loading}
                            cropType={cropType}
                        />
                    </div>
                )}
            </div>

            {/* Data Quality Indicator */}
            {zoneHealth && (
                <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${zoneHealth.confidence.score > 75 ? 'bg-[#00D09C]' :
                                zoneHealth.confidence.score > 50 ? 'bg-[#FFC857]' : 'bg-[#FF6B35]'
                                } animate-pulse`} />
                            <span className="text-xs font-bold text-white/60">
                                Data Confidence: {zoneHealth.confidence.level.toUpperCase()} ({zoneHealth.confidence.score}%)
                            </span>
                        </div>
                        <span className="text-[10px] text-white/30 font-medium">
                            Updated: {new Date(zoneHealth.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
