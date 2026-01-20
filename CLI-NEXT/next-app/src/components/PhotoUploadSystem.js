'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Xmark, Check, WarningTriangle, InfoEmpty } from 'iconoir-react';

/**
 * Photo Upload System - STEP 2 (MANDATORY GATE)
 * Enforces minimum 3 photos per zone
 * Validates photo types: Leaf Closeup, Whole Plant, Field Overview
 */

export default function PhotoUploadSystem({ fieldData, onComplete, onBack }) {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const zones = fieldData.zones || [];
    const requiredCount = 3;
    const photoTypes = [
        { id: 'leaf_closeup', label: 'Leaf Closeup', description: 'Close-up of a single leaf' },
        { id: 'whole_plant', label: 'Whole Plant', description: 'View of the entire plant' },
        { id: 'field_overview', label: 'Field Overview', description: 'Wide view of the zone' }
    ];

    const handleFileChange = (e, zoneId, typeId) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simulate upload and local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPhoto = {
                id: Math.random().toString(36).substr(2, 9),
                zoneId,
                type: typeId,
                url: reader.result,
                fileSize: file.size,
                timestamp: new Date().toISOString()
            };

            setPhotos(prev => {
                // Replace if same zone and type already exists
                const filtered = prev.filter(p => !(p.zoneId === zoneId && p.type === typeId));
                return [...filtered, newPhoto];
            });
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = (photoId) => {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
    };

    const getZonePhotos = (zoneId) => photos.filter(p => p.zoneId === zoneId);

    const isZoneComplete = (zoneId) => {
        const zonePhotos = getZonePhotos(zoneId);
        return photoTypes.every(type => zonePhotos.some(p => p.type === type.id));
    };

    const isAllComplete = zones.every(zone => isZoneComplete(zone.id));

    const totalRequired = zones.length * requiredCount;
    const currentCount = photos.length;
    const progressPercent = Math.round((currentCount / totalRequired) * 100);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Header & Progress */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="p-2 bg-[#9D4EDD]/10 rounded-xl">
                                <Camera width={24} height={24} className="text-[#9D4EDD]" />
                            </div>
                            Upload Required Photos
                        </h3>
                        <p className="text-white/40 text-sm font-medium mt-1">
                            Analysis requires at least 3 specific photos per zone to ensure accuracy.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-[#9D4EDD]">{currentCount}/{totalRequired}</div>
                        <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">Photos Uploaded</div>
                    </div>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#9D4EDD] transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(157,78,221,0.4)]"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Zone Grid */}
            <div className="space-y-12">
                {zones.map((zone) => (
                    <div key={zone.id} className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-3 h-3 rounded-full ${isZoneComplete(zone.id) ? 'bg-[#00D09C] shadow-[0_0_8px_#00D09C]' : 'bg-white/10'}`} />
                            <h4 className="text-xl font-black text-white">{zone.name}</h4>
                            {isZoneComplete(zone.id) && (
                                <span className="text-[10px] font-black text-[#00D09C] bg-[#00D09C]/10 px-2 py-0.5 rounded-lg border border-[#00D09C]/20 uppercase ml-2">Verified</span>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {photoTypes.map((type) => {
                                const photo = photos.find(p => p.zoneId === zone.id && p.type === type.id);

                                return (
                                    <div key={type.id} className="group flex flex-col h-full">
                                        <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 px-1">
                                            {type.label}
                                        </div>

                                        <div className={`relative flex-1 rounded-[2rem] border-2 border-dashed transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center p-4 ${photo
                                                ? 'border-[#00D09C]/40 bg-[#00D09C]/5'
                                                : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
                                            }`}>
                                            {photo ? (
                                                <>
                                                    <img src={photo.url} alt={type.label} className="absolute inset-0 w-full h-full object-cover rounded-[1.8rem]" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[1.8rem]">
                                                        <button
                                                            onClick={() => removePhoto(photo.id)}
                                                            className="p-3 bg-red-500 rounded-2xl text-white transform hover:scale-110 transition-all"
                                                        >
                                                            <Xmark width={24} height={24} />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-3 right-3 p-1.5 bg-[#00D09C] rounded-full text-white shadow-lg">
                                                        <Check width={14} height={14} strokeWidth={3} />
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="cursor-pointer flex flex-col items-center text-center px-4 w-full h-full justify-center">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileChange(e, zone.id, type.id)}
                                                    />
                                                    <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:bg-[#9D4EDD]/10 group-hover:text-[#9D4EDD] transition-all">
                                                        <Upload width={32} height={32} />
                                                    </div>
                                                    <span className="text-sm font-bold text-white/60 mb-1">Click to Upload</span>
                                                    <span className="text-[10px] text-white/30 font-medium leading-tight">{type.description}</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Safety Warning */}
            {!isAllComplete && (
                <div className="bg-[#FFC857]/10 border border-[#FFC857]/30 rounded-3xl p-6 flex items-start gap-4">
                    <WarningTriangle width={24} height={24} className="text-[#FFC857] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-black text-[#FFC857] uppercase tracking-wider mb-1">Incomplete Visual Data</h4>
                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                            You must upload all mandatory photos for every zone. Our AI models need high-quality imagery of leaves and whole plants to detect specific diseases and nutrient deficiencies accurately.
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-10 border-t border-white/10">
                <button
                    onClick={onBack}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white/60 font-bold transition-all"
                >
                    Back to Details
                </button>

                <button
                    onClick={() => onComplete(photos)}
                    disabled={!isAllComplete || uploading}
                    className={`px-10 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 transition-all duration-500 ${isAllComplete
                            ? 'bg-gradient-to-r from-[#9D4EDD] to-[#4D9FFF] text-white shadow-xl shadow-[#9D4EDD]/30 hover:shadow-[#9D4EDD]/50 hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        }`}
                >
                    {uploading ? 'Processing...' : 'Run Analysis (All Data Ready)'}
                    <Check width={24} height={24} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
