'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import integrationService from '@/services/integrationService';
import apiService from '@/services/apiService';
import {
  NavArrowRight,
  Db,
  OrganicFood,
  Wind,
  Droplet,
  HalfMoon,
  SunLight,
  WarningTriangle,
  Cloud,
  GraphUp,
  GraphDown,
  ReportColumns,
  ModernTv,
  Journal,
  NavArrowDown,
  CheckCircle,
  Flash,
  StairsDown,
  FilterList,
  Pin,
  Globe,
  Plus,
  ArrowRight,
  User,
  Send,
  ThumbsUp,
  ChatBubble,
  StatsUpSquare
} from 'iconoir-react';

const formatNumber = (value, decimals = 1) => {
  if (value == null || Number.isNaN(value)) return '—';
  return Number(value).toFixed(decimals);
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function Insights() {
  const { activeLocation } = useActiveLocation();

  const [comparison, setComparison] = useState(null);
  const [comparisonError, setComparisonError] = useState('');

  const [nasaData, setNasaData] = useState(null);
  const [nasaError, setNasaError] = useState('');

  const [aqiData, setAqiData] = useState(null);
  const [aqiError, setAqiError] = useState('');

  const [tomorrowData, setTomorrowData] = useState(null);
  const [tomorrowError, setTomorrowError] = useState('');

  const [meteostatData, setMeteostatData] = useState(null);
  const [meteostatError, setMeteostatError] = useState('');

  const [places, setPlaces] = useState([]);
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeError, setPlaceError] = useState('');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const [carbonForm, setCarbonForm] = useState({
    electricityUnit: 'kwh',
    electricityValue: '',
    country: 'IN',
    state: '',
  });
  const [carbonResult, setCarbonResult] = useState(null);
  const [carbonLoading, setCarbonLoading] = useState(false);
  const [carbonError, setCarbonError] = useState('');

  const [webhookStatus, setWebhookStatus] = useState('');
  const [webhookLoading, setWebhookLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!activeLocation?.lat || !activeLocation?.lon) {
      return;
    }

    const { lat, lon } = activeLocation;

    const loadComparison = async () => {
      try {
        const result = await integrationService.getOpenWeatherComparison({ lat, lon });
        if (!cancelled) {
          setComparison(result);
          setComparisonError('');
        }
      } catch (error) {
        if (!cancelled) {
          setComparison(null);
          setComparisonError(error.message);
        }
      }
    };

    const loadNasaData = async () => {
      try {
        const result = await integrationService.getNasaClimateData({
          lat,
          lon,
          parameters: ['T2M', 'PRECTOT', 'RH2M', 'WS2M'],
          community: 'AG',
        });
        if (!cancelled) {
          setNasaData(result);
          setNasaError('');
        }
      } catch (error) {
        if (!cancelled) {
          setNasaData(null);
          setNasaError(error.message);
        }
      }
    };

    const loadAqiData = async () => {
      try {
        const result = await integrationService.getRealtimeAqi({ lat, lon });
        if (!cancelled) {
          setAqiData(result);
          setAqiError('');
        }
      } catch (error) {
        if (!cancelled) {
          setAqiData(null);
          setAqiError(error.message);
        }
      }
    };

    const loadTomorrow = async () => {
      try {
        const result = await integrationService.getTomorrowForecast({
          lat,
          lon,
          timesteps: ['1h', '1d'],
        });
        if (!cancelled) {
          setTomorrowData(result);
          setTomorrowError('');
        }
      } catch (error) {
        if (!cancelled) {
          setTomorrowData(null);
          setTomorrowError(error.message);
        }
      }
    };

    const loadMeteostat = async () => {
      try {
        const result = await integrationService.getMeteostatHistory({ lat, lon });
        if (!cancelled) {
          setMeteostatData(result);
          setMeteostatError('');
        }
      } catch (error) {
        if (!cancelled) {
          setMeteostatData(null);
          setMeteostatError(error.message);
        }
      }
    };

    const loadChatHistory = async () => {
      try {
        const res = await apiService.getChatHistory();
        if (res.success && Array.isArray(res.data) && !cancelled) {
          setChatHistory(res.data);
          if (res.data.length > 0) {
            setAiResponse(res.data[0].response);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadComparison();
    loadNasaData();
    loadAqiData();
    loadTomorrow();
    loadMeteostat();
    loadChatHistory();

    return () => {
      cancelled = true;
    };
  }, [activeLocation]);

  const nasaSummary = useMemo(() => {
    if (!nasaData?.data) return null;
    const parameterAverages = {};
    for (const [key, value] of Object.entries(nasaData.data)) {
      const values = Object.values(value || {}).map(Number).filter((v) => !Number.isNaN(v));
      if (values.length === 0) continue;
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      parameterAverages[key] = average;
    }
    return parameterAverages;
  }, [nasaData]);

  const meteostatSummary = useMemo(() => {
    if (!meteostatData?.data?.length) return null;
    const temps = meteostatData.data.map((entry) => entry.tavg).filter((v) => v != null);
    const rain = meteostatData.data.map((entry) => entry.prcp || 0).filter((v) => v != null);
    return {
      avgTemp: temps.length > 0 ? temps.reduce((sum, val) => sum + val, 0) / temps.length : null,
      totalRainfall: rain.length > 0 ? rain.reduce((sum, val) => sum + val, 0) : null,
      hottestDay: meteostatData.data.reduce((prev, curr) => (curr.tmax ?? -Infinity) > (prev.tmax ?? -Infinity) ? curr : prev),
      coldestDay: meteostatData.data.reduce((prev, curr) => (curr.tmin ?? Infinity) < (prev.tmin ?? Infinity) ? curr : prev),
    };
  }, [meteostatData]);

  const hyperlocalPreview = useMemo(() => {
    if (!tomorrowData?.timelines?.length) return [];
    const hourly = tomorrowData.timelines.find((t) => t.timestep === '1h');
    if (!hourly?.intervals) return [];
    return hourly.intervals.slice(0, 5).map((interval) => ({
      time: interval.startTime,
      temperature: interval.values?.temperature,
      precipitation: interval.values?.precipitationProbability,
      windSpeed: interval.values?.windSpeed,
    }));
  }, [tomorrowData]);

  const handleSearchPlaces = async (event) => {
    event.preventDefault();
    if (!placeQuery.trim() || !activeLocation) {
      setPlaceError('Enter a keyword to search hazard hotspots.');
      return;
    }
    setPlaceLoading(true);
    setPlaceError('');
    try {
      const results = await integrationService.searchPlaces({
        query: placeQuery.trim(),
        lat: activeLocation.lat,
        lon: activeLocation.lon,
        radius: '50000',
      });
      setPlaces(results.results || []);
      if (!results.results?.length) setPlaceError('No nearby matches.');
    } catch (error) {
      setPlaces([]);
      setPlaceError(error.message);
    } finally {
      setPlaceLoading(false);
    }
  };

  const handleCarbonSubmit = async (event) => {
    event.preventDefault();
    if (!carbonForm.electricityValue) {
      setCarbonError('Enter a usage value.');
      return;
    }
    setCarbonLoading(true);
    setCarbonError('');
    try {
      const payload = {
        type: 'electricity',
        electricity_unit: carbonForm.electricityUnit,
        electricity_value: Number(carbonForm.electricityValue),
        country: carbonForm.country,
      };
      if (carbonForm.state) payload.state = carbonForm.state;
      const result = await integrationService.createCarbonEstimate(payload);
      setCarbonResult(result.estimate);
    } catch (error) {
      setCarbonResult(null);
      setCarbonError(error.message);
    } finally {
      setCarbonLoading(false);
    }
  };

  const handleAiSubmit = async (event) => {
    event.preventDefault();
    if (!aiPrompt.trim()) {
      setAiError('Ask a question to get AI advice.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    try {
      const contextPieces = [];
      if (comparison) contextPieces.push(`Forecast confidence: ${comparison.confidence}.`);
      if (aqiData) contextPieces.push(`AQI: ${aqiData.aqi}.`);
      if (nasaData) contextPieces.push(`NASA Data: ${JSON.stringify(nasaData.summary || nasaData)}`);

      const context = contextPieces.join('\n');
      const result = await integrationService.askAiAdvisor({
        prompt: aiPrompt.trim(),
        context,
        provider: 'gemini'
      });

      setAiResponse(result.message);

      // Save to history
      await apiService.saveChatMessage(aiPrompt.trim(), result.message);

      // Refresh local history
      const historyRes = await apiService.getChatHistory();
      if (historyRes.success) setChatHistory(historyRes.data);

    } catch (error) {
      setAiResponse('');
      setAiError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleWebhookSend = async () => {
    if (!comparison && !aqiData) {
      setWebhookStatus('Collect weather data before dispatching alerts.');
      return;
    }
    setWebhookLoading(true);
    setWebhookStatus('');
    try {
      const messageLines = [];
      if (comparison) messageLines.push(`Confidence: ${comparison.confidence}`);
      if (aqiData) messageLines.push(`AQI: ${aqiData.aqi}`);
      const result = await integrationService.sendWebhook({
        title: 'ClimaPredict Daily Snapshot',
        message: messageLines.join('\n'),
        metadata: { Location: activeLocation?.label || 'Selected area' }
      });
      setWebhookStatus(result.failed?.length ? 'Partial delivery failure.' : 'Alert sent.');
    } catch (error) {
      setWebhookStatus(error.message);
    } finally {
      setWebhookLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white pb-28">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center justify-between gap-4 md:mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
              <NavArrowRight className="rotate-180" width={20} height={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Climate Intelligence</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Multi-source planetary observation and analytics</p>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Status: Nominal</span>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          {/* Section: Forecast Confidence */}
          <section className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
            <header className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Forecast Validation</h2>
                <p className="text-xs text-white/30 uppercase tracking-widest mt-1 font-bold">OpenWeatherMap Comparison Layer</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <ModernTv width={24} height={24} className="text-[#00D09C]" />
              </div>
            </header>
            {comparisonError ? (
              <p className="text-sm font-black text-[#FF6B35] uppercase">{comparisonError}</p>
            ) : comparison ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ForecastCard title="Confidence" value={comparison.confidence || '—'} subtitle="Model accuracy score" icon={CheckCircle} color="#00D09C" />
                <ForecastCard title="Temp Delta" value={`${formatNumber(comparison.differences?.temperature, 1)}°C`} subtitle="Actual vs Forecast" icon={GraphUp} color="#FFC857" />
                <ForecastCard title="Humidity" value={`${comparison.differences?.humidity ?? '—'}%`} subtitle="Air saturation variance" icon={Droplet} color="#4D9FFF" />
              </div>
            ) : (
              <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">Synchronising atmospheric data…</p>
            )}
          </section>

          {/* Section: NASA POWER */}
          <section className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
            <header className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Planetary Dynamics</h2>
                <p className="text-xs text-white/30 uppercase tracking-widest mt-1 font-bold">NASA EarthData Satellite metrics</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <Globe width={24} height={24} className="text-[#4D9FFF]" />
              </div>
            </header>
            {nasaError ? (
              <p className="text-sm font-black text-[#FF6B35] uppercase">{nasaError}</p>
            ) : nasaSummary ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoBadge icon={SunLight} label="Surface Temp" value={`${formatNumber(nasaSummary.T2M)}°C`} />
                <InfoBadge icon={Cloud} label="Daily Rain" value={`${formatNumber(nasaSummary.PRECTOT)} mm`} />
                <InfoBadge icon={Droplet} label="Humidity" value={`${formatNumber(nasaSummary.RH2M)}%`} />
                <InfoBadge icon={Wind} label="Wind Speed" value={`${formatNumber(nasaSummary.WS2M)} m/s`} />
              </div>
            ) : (
              <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">Retrieving satellite telemetry…</p>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Air Quality */}
            <section className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
              <header className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Environmental Health</h2>
                  <p className="text-xs text-white/30 uppercase tracking-widest mt-1 font-bold">AQICN Live sensor network</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <OrganicFood width={24} height={24} className="text-[#9D4EDD]" />
                </div>
              </header>
              {aqiError ? (
                <p className="text-sm font-black text-[#FF6B35] uppercase">{aqiError}</p>
              ) : aqiData ? (
                <div className="space-y-4">
                  <InfoBadge icon={FilterList} label="AQI Index" value={aqiData.aqi} />
                  <InfoBadge icon={Cloud} label="Pollutant" value={aqiData.dominentPollutant?.toUpperCase() || '—'} />
                  <div className="p-6 bg-[#00D09C]/5 border border-[#00D09C]/10 rounded-2xl">
                    <p className="text-[10px] font-black text-[#00D09C] uppercase tracking-widest mb-1">Health Recommendation</p>
                    <p className="text-sm font-bold text-white/60">Air quality is currently optimal for outdoor activities. No special precautions required.</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">Sampling air pollution data…</p>
              )}
            </section>

            {/* AI Advisor */}
            <section className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 transition-transform group-hover:scale-125 duration-1000" />
              <div className="relative z-10 h-full flex flex-col">
                <header className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Cognitive Advisor</h2>
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">AI Contextual Analysis</p>
                  </div>
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                    <Journal width={24} height={24} className="text-white" />
                  </div>
                </header>
                <form onSubmit={handleAiSubmit} className="space-y-4 flex-1">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask about crop protection…"
                    className="w-full bg-white/20 border border-white/20 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-white/60 outline-none focus:bg-white/30 transition-all uppercase"
                    rows={3}
                  />
                  <button type="submit" disabled={aiLoading} className="w-full bg-white text-[#0D0D0D] font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-sm">
                    {aiLoading ? 'Synthesising…' : 'Execute Insight Search'}
                  </button>
                </form>
                {aiResponse && (
                  <div className="mt-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-bold text-white uppercase tracking-wider leading-relaxed">
                    {aiResponse}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5">
            <header className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Hyperlocal Cadence</h2>
                <p className="text-xs text-white/30 uppercase tracking-widest mt-1 font-bold">High-resolution Tomorrow.io intervals</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <Flash width={24} height={24} className="text-[#FFC857]" />
              </div>
            </header>
            <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
              {hyperlocalPreview.length > 0 ? (
                hyperlocalPreview.map((interval, i) => (
                  <div key={i} className="min-w-[150px] bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col items-center group hover:bg-white/10 transition-all">
                    <span className="text-[10px] font-black text-white/30 uppercase mb-4">{new Date(interval.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-3xl font-black text-[#00D09C] mb-2">{formatNumber(interval.temperature, 0)}°</span>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-[8px] font-black text-white/40 uppercase tracking-widest">
                        <Droplet width={12} height={12} /> {formatNumber(interval.precipitation, 0)}%
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-black text-white/40 uppercase tracking-widest">
                        <Wind width={12} height={12} /> {formatNumber(interval.windSpeed, 1)}m
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Loading temporary timeline…</p>
              )}
            </div>
          </section>

          <footer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={handleWebhookSend} disabled={webhookLoading} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-white/10 transition-all group">
              <div className="text-left">
                <h3 className="text-lg font-black text-white uppercase mb-1">Community Broadcast</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Send snapshot to Slack/Discord</p>
              </div>
              <div className="p-4 bg-[#4D9FFF]/10 rounded-2xl group-hover:bg-[#4D9FFF] group-hover:text-white transition-all text-[#4D9FFF]">
                <Send width={24} height={24} />
              </div>
            </button>
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-black text-white uppercase mb-1">Carbon Footprint</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Estimating operational impact</p>
              </div>
              <div className="p-4 bg-[#FF6B35]/10 rounded-2xl text-[#FF6B35]">
                <Flash width={24} height={24} />
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ForecastCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:bg-white/10 transition-all group">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors" style={{ color }}>
          <Icon width={24} height={24} />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-white/20">{title}</p>
      </div>
      <div>
        <p className="text-4xl font-black text-white mb-1 tracking-tighter">{value}</p>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoBadge({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:bg-white/10 transition-all group">
      <div className="p-4 bg-white/5 rounded-2xl text-white/20 group-hover:text-white transition-colors">
        <Icon width={24} height={24} />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5">{label}</p>
        <p className="text-base md:text-lg font-black text-white truncate uppercase">{value}</p>
      </div>
    </div>
  );
}
