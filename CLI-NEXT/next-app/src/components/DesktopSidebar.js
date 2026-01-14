'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getActiveLocation, loadSavedLocations, persistLocations } from '@/utils/locationPreferences';
import {
    ViewGrid,
    Map,
    Network,
    Bell,
    Settings,
    Cloud,
    Pin,
    ModernTv,
    Journal,
    StatsUpSquare,
    Xmark,
    Search,
    NavArrowRight,
    Plus,
    User,
    Eye
} from 'iconoir-react';

const navItems = [
    { href: '/', icon: ViewGrid, label: 'Dashboard', category: 'main' },
    { href: '/forecast', icon: StatsUpSquare, label: 'Forecast', category: 'weather' },
    { href: '/hourly-forecast', icon: Cloud, label: 'Hourly', category: 'weather' },
    { href: '/weather-details', icon: Eye, label: 'Details', category: 'weather' },
    { href: '/weather-map', icon: Map, label: 'Map', category: 'weather' },
    { href: '/weather-statistics', icon: StatsUpSquare, label: 'Statistics', category: 'weather' },
    { href: '/weather-tips', icon: Cloud, label: 'Tips', category: 'weather' },
    { href: '/alerts', icon: Bell, label: 'Alerts', category: 'main' },
    { href: '/crop-health', icon: Plus, label: 'Crop Health', category: 'agriculture' },
    { href: '/farming-recommendations', icon: NavArrowRight, label: 'Farming Tips', category: 'agriculture' },
    { href: '/market-prices', icon: Plus, label: 'Market Prices', category: 'agriculture' },
    { href: '/insurance', icon: Plus, label: 'Insurance', category: 'agriculture' },
    { href: '/sensors', icon: Network, label: 'Sensors', category: 'main' },
    { href: '/insights', icon: ModernTv, label: 'Insights', category: 'main' },
    { href: '/community', icon: Journal, label: 'Community', category: 'main' },
    { href: '/news', icon: Journal, label: 'News', category: 'main' },
    { href: '/profile', icon: User, label: 'Profile', category: 'main' },
    { href: '/settings', icon: Settings, label: 'Settings', category: 'main' },
];

export default function DesktopSidebar() {
    const pathname = usePathname();
    const [location, setLocation] = useState('Mumbai, India');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Load active location from locationPreferences
    useEffect(() => {
        const activeLocation = getActiveLocation();
        setLocation(activeLocation.customName || activeLocation.label);
    }, []);

    // Listen for location changes from settings page
    useEffect(() => {
        const handleLocationChange = () => {
            const activeLocation = getActiveLocation();
            setLocation(activeLocation.customName || activeLocation.label);
        };

        window.addEventListener('clima-active-location-changed', handleLocationChange);
        window.addEventListener('clima-locations-updated', handleLocationChange);

        return () => {
            window.removeEventListener('clima-active-location-changed', handleLocationChange);
            window.removeEventListener('clima-locations-updated', handleLocationChange);
        };
    }, []);

    // Search for locations
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/weather/geocode?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data.results) {
                setSearchResults(data.results.slice(0, 5)); // Top 5 results
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Select location and add to saved locations
    const selectLocation = (locationData) => {
        const savedLocations = loadSavedLocations();

        // Check if location already exists
        const exists = savedLocations.some(
            loc => loc.lat === String(locationData.lat) && loc.lon === String(locationData.lon)
        );

        let newLocationId;

        if (!exists) {
            // Add new location
            const newLocation = {
                id: `loc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                label: `${locationData.name}, ${locationData.country}`,
                lat: String(locationData.lat),
                lon: String(locationData.lon),
                customName: '',
            };
            newLocationId = newLocation.id;
            persistLocations([...savedLocations, newLocation], newLocationId);
        } else {
            // Find existing location and set as active
            const existingLocation = savedLocations.find(
                loc => loc.lat === String(locationData.lat) && loc.lon === String(locationData.lon)
            );
            newLocationId = existingLocation.id;
            persistLocations(savedLocations, newLocationId);
        }

        setLocation(`${locationData.name}, ${locationData.country}`);
        setShowLocationModal(false);
        setSearchQuery('');
        setSearchResults([]);

        // Reload page to fetch new weather data
        window.location.reload();
    };

    return (
        <>
            <aside className="hidden md:flex flex-col h-screen w-72 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D] to-[#0A0A0A] border-r border-white/10 p-6 fixed left-0 top-0 overflow-y-auto custom-scrollbar z-40">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/5 via-transparent to-[#4D9FFF]/5 opacity-30 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 ml-0.5 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-2xl shadow-lg shadow-[#00D09C]/30 hover:shadow-[#00D09C]/50 transition-all duration-300 hover:scale-105">
                        <Cloud width={24} height={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">ClimaPredict</h1>
                        <p className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">Precision Meteorology</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-3.5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] text-[#0D0D0D] font-black shadow-xl shadow-[#00D09C]/20'
                                    : 'text-white/40 hover:text-white hover:bg-white/5 hover:scale-[1.02]'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#00D09C] via-[#00D09C] to-[#4D9FFF] animate-pulse opacity-20" />
                                )}
                                <Icon width={20} height={20} className={`relative z-10 transition-all duration-300 ${isActive ? 'text-[#0D0D0D]' : 'group-hover:text-white group-hover:scale-110'}`} />
                                <span className="text-xs font-black uppercase tracking-widest relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 relative z-20">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#00D09C]/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 border border-[#00D09C]/0 group-hover:border-[#00D09C]/20 rounded-[2.5rem] transition-all duration-500" />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[#00D09C] shadow-inner group-hover:bg-[#00D09C]/10 group-hover:border-[#00D09C]/20 transition-all duration-300">
                                <Pin width={18} height={18} className="group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">Selected Region</span>
                                <span className="text-sm font-black truncate text-white/80 group-hover:text-white transition-colors duration-300">{location}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowLocationModal(true)}
                            className="relative z-20 w-full py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 text-[#00D09C] hover:border-[#00D09C]/30 hover:shadow-md hover:shadow-[#00D09C]/10 cursor-pointer"
                        >
                            Switch Location
                        </button>
                    </div>
                </div>
            </aside>

            {/* Location Switcher Modal */}
            {showLocationModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-[3rem] p-8 max-w-md w-full shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/5 via-transparent to-[#4D9FFF]/5 opacity-50 pointer-events-none" />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Switch Location</h2>
                            <button
                                onClick={() => {
                                    setShowLocationModal(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                                <Xmark width={20} height={20} className="text-white/40 hover:text-white transition-colors" />
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" width={18} height={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search city or location..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-[#00D09C]/30 transition-all uppercase placeholder:text-white/10"
                            />
                        </div>

                        {isSearching && (
                            <div className="text-center py-8 text-white/40 text-xs font-bold uppercase tracking-widest">
                                Searching...
                            </div>
                        )}

                        {searchResults.length > 0 && (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => selectLocation(result)}
                                        className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Pin width={16} height={16} className="text-[#00D09C]" />
                                            <div>
                                                <div className="text-sm font-black text-white group-hover:text-[#00D09C] transition-colors">
                                                    {result.name}
                                                </div>
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                                    {result.state ? `${result.state}, ` : ''}{result.country}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                            <div className="text-center py-8 text-white/40 text-xs font-bold uppercase tracking-widest">
                                No locations found
                            </div>
                        )}

                        {searchQuery.length < 2 && (
                            <div className="text-center py-8 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                                Type at least 2 characters to search
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
