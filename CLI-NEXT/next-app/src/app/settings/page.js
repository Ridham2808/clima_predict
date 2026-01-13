'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  defaultLocation,
  loadActiveLocationId,
  loadSavedLocations,
  persistLocations,
  setActiveLocation,
} from '@/utils/locationPreferences';
import {
  NavArrowRight,
  Bell,
  Pin,
  Plus,
  EditPencil,
  Trash,
  Check,
  Map as MapIcon,
  SunLight,
  Wind
} from 'iconoir-react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [savedLocations, setSavedLocations] = useState([defaultLocation]);
  const [activeLocationId, setActiveLocationId] = useState(defaultLocation.id);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const locations = loadSavedLocations();
    const activeId = loadActiveLocationId();
    const validActive = locations.some((loc) => loc.id === activeId) ? activeId : locations[0].id;
    setSavedLocations(locations);
    setActiveLocationId(validActive);

    const handleLocationsUpdated = (event) => {
      const { locations: updated } = event.detail || {};
      if (updated) setSavedLocations(updated);
    };
    const handleActiveUpdated = (event) => {
      if (event.detail?.id) setActiveLocationId(event.detail.id);
    };

    window.addEventListener('clima-locations-updated', handleLocationsUpdated);
    window.addEventListener('clima-active-location-changed', handleActiveUpdated);

    return () => {
      window.removeEventListener('clima-locations-updated', handleLocationsUpdated);
      window.removeEventListener('clima-active-location-changed', handleActiveUpdated);
    };
  }, []);

  const displayName = useCallback((location) => location.customName?.trim() || location.label, []);

  const applyLocationChanges = useCallback((locations, nextActiveId = activeLocationId) => {
    const result = persistLocations(locations, nextActiveId);
    setSavedLocations(result.locations);
    setActiveLocationId(result.activeId);
    return result;
  }, [activeLocationId]);

  const toggleAddLocationPanel = () => {
    setShowAddLocation((prev) => {
      const next = !prev;
      if (!next) {
        setSearchQuery('');
        setSearchResults([]);
        setSearchError('');
      }
      return next;
    });
  };

  const handleSearchLocations = async (event) => {
    event?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Enter a city, town, or place name to search.');
      setSearchResults([]);
      return;
    }
    setSearchError('');
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/weather/geocode?query=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || 'Search failed.');
      }
      const results = await response.json();
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No matches found. Try a nearby city or adjust spelling.');
      }
    } catch (error) {
      setSearchError(error.message || 'Unable to search locations right now.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddLocation = (result) => {
    const exists = savedLocations.some((loc) => loc.lat === String(result.lat) && loc.lon === String(result.lon));
    if (exists) {
      setFeedback({ type: 'warning', message: `${result.label} is already in your saved locations.` });
      return;
    }
    const newLocation = {
      id: `loc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: result.label,
      lat: String(result.lat),
      lon: String(result.lon),
      customName: '',
    };
    applyLocationChanges([...savedLocations, newLocation], newLocation.id);
    setFeedback({ type: 'success', message: `${result.label} added and set as active.` });
    setShowAddLocation(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSetActive = (locationId) => {
    const active = setActiveLocation(locationId);
    setActiveLocationId(active.id);
    setFeedback({ type: 'success', message: `Switched weather data to ${displayName(active)}.` });
  };

  const handleStartEdit = (location) => {
    setEditingId(location.id);
    setEditingValue(displayName(location));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const trimmed = editingValue.trim();
    const updated = savedLocations.map((loc) => loc.id === editingId ? { ...loc, customName: trimmed } : loc);
    applyLocationChanges(updated);
    setFeedback({ type: 'success', message: 'Location name updated.' });
    setEditingId(null);
    setEditingValue('');
  };

  const handleDeleteLocation = (location) => {
    if (location.id === defaultLocation.id) {
      setFeedback({ type: 'warning', message: 'The default location cannot be removed.' });
      return;
    }
    const updated = savedLocations.filter((loc) => loc.id !== location.id);
    const nextActive = activeLocationId === location.id ? defaultLocation.id : activeLocationId;
    applyLocationChanges(updated, nextActive);
    setFeedback({ type: 'success', message: `${displayName(location)} removed.` });
  };

  const feedbackColor = useMemo(() => {
    if (!feedback) return 'text-white/40';
    if (feedback.type === 'success') return 'text-[#00D09C]';
    if (feedback.type === 'warning') return 'text-[#FFC857]';
    return 'text-[#FF6B35]';
  }, [feedback]);

  return (
    <div className="min-h-screen text-white pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center justify-between gap-4 md:mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
              <NavArrowRight className="rotate-180" width={20} height={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">System Preferences</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Configure your local monitoring environment</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#FF6B35]/10 rounded-2xl">
                  <Bell width={24} height={24} className="text-[#FF6B35]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Notifications</h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest">Alerts and announcements</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-wider">Push Notifications</div>
                  <div className="text-xs text-white/40 mt-1 font-medium">Receive real-time weather hazards</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-7 rounded-full transition-all duration-500 relative ${notifications ? 'bg-[#00D09C]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-500 ${notifications ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#4D9FFF]/10 rounded-2xl">
                  <MapIcon width={24} height={24} className="text-[#4D9FFF]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Location Services</h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest">Global positioning system</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-wider">Automatic Detection</div>
                  <div className="text-xs text-white/40 mt-1 font-medium">Use GPS for precise coordinates</div>
                </div>
                <button
                  onClick={() => setLocationServices(!locationServices)}
                  className={`w-14 h-7 rounded-full transition-all duration-500 relative ${locationServices ? 'bg-[#00D09C]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-500 ${locationServices ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#FFC857]/10 rounded-2xl">
                  <SunLight width={24} height={24} className="text-[#FFC857]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Display Units</h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest">Measurement standards</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                  <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Temperature</span>
                  <span className="text-sm font-black text-[#FFC857]">Celsius (°C)</span>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                  <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Wind Speed</span>
                  <span className="text-sm font-black text-[#FFC857]">Kilometers/Hour (km/h)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 h-full">
            <div className="flex items-center justify-between gap-4 mb-8 px-2">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#00D09C]/10 rounded-2xl">
                  <Pin width={24} height={24} className="text-[#00D09C]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Saved Regions</h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest">Monitoring zones</p>
                </div>
              </div>
              <button
                onClick={toggleAddLocationPanel}
                className="p-4 bg-[#00D09C] text-[#0D0D0D] rounded-2xl shadow-lg shadow-[#00D09C]/20 active:scale-95 transition-all hover:bg-[#00D09C]/90"
              >
                {showAddLocation ? <NavArrowRight className="rotate-90" width={24} height={24} /> : <Plus width={24} height={24} strokeWidth={3} />}
              </button>
            </div>

            {feedback && (
              <div className={`text-xs font-black uppercase tracking-widest ${feedbackColor} bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 text-center`}>
                {feedback.message}
              </div>
            )}

            <div className="space-y-4">
              {savedLocations.map((location) => {
                const isActive = location.id === activeLocationId;
                const isEditing = editingId === location.id;
                return (
                  <div key={location.id} className={`bg-white/5 rounded-3xl p-6 border transition-all duration-300 ${isActive ? 'border-[#00D09C]/30 bg-[#00D09C]/5' : 'border-white/5 hover:bg-white/10'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-4">
                            <input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C]"
                              placeholder="Region custom label"
                              autoFocus
                            />
                            <div className="flex gap-3">
                              <button onClick={handleSaveEdit} className="flex-1 bg-[#00D09C] text-[#0D0D0D] text-[10px] font-black uppercase tracking-widest p-3 rounded-xl">Save</button>
                              <button onClick={handleCancelEdit} className="flex-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest p-3 rounded-xl">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="text-lg font-black text-white truncate">{displayName(location)}</p>
                              {isActive && <div className="p-1 px-3 bg-[#00D09C] text-[#0D0D0D] rounded-full text-[8px] font-black uppercase tracking-widest">Active</div>}
                            </div>
                            <p className="text-xs font-bold text-white/20 uppercase tracking-tighter truncate mb-2">{location.label}</p>
                            <p className="text-[10px] font-bold text-white/10 tracking-widest uppercase">{location.lat}, {location.lon}</p>
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="flex flex-col gap-2">
                          {!isActive && (
                            <button onClick={() => handleSetActive(location.id)} className="p-2.5 bg-white/10 rounded-xl hover:bg-[#00D09C] hover:text-[#0D0D0D] transition-all group">
                              <Check width={18} height={18} />
                            </button>
                          )}
                          <button onClick={() => handleStartEdit(location)} className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white/40 hover:text-white">
                            <EditPencil width={18} height={18} />
                          </button>
                          <button onClick={() => handleDeleteLocation(location)} className="p-2.5 bg-white/10 rounded-xl hover:bg-[#FF6B35] transition-all text-[#FF6B35]/40 hover:text-white">
                            <Trash width={18} height={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {showAddLocation && (
              <div className="mt-8 pt-8 border-t border-white/5 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <form onSubmit={handleSearchLocations} className="space-y-4">
                  <div className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-4">Initialise New Region</div>
                  <div className="flex gap-3">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Coordinates or city name…"
                      className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-[#00D09C] transition-all"
                    />
                    <button type="submit" disabled={searchLoading} className="px-6 bg-[#00D09C] text-[#0D0D0D] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00D09C]/90">
                      {searchLoading ? 'Detecting…' : 'Search'}
                    </button>
                  </div>
                  {searchError && <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest text-center mt-2">{searchError}</p>}
                </form>

                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {searchResults.map((result) => (
                      <div key={`${result.lat}-${result.lon}`} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all group">
                        <div className="min-w-0">
                          <p className="font-black text-white text-sm truncate">{result.label}</p>
                          <p className="text-[10px] text-white/20 font-bold uppercase tracking-tighter mt-1">{result.lat}, {result.lon}</p>
                        </div>
                        <button onClick={() => handleAddLocation(result)} className="p-3 bg-white/10 rounded-xl group-hover:bg-[#00D09C] group-hover:text-[#0D0D0D] transition-all">
                          <Plus width={18} height={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
