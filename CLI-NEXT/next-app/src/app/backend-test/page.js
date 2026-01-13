'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  NavArrowRight,
  Db,
  CheckCircle,
  WarningTriangle,
  Flash,
  ModernTv,
  Network
} from 'iconoir-react';

export default function BackendTest() {
  const [status, setStatus] = useState('Standby');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runTest = async () => {
    setLoading(true);
    setStatus('Probing...');
    try {
      const response = await fetch('/api/weather/test');
      const data = await response.json();
      setResults(data);
      setStatus(response.ok ? 'Synchronized' : 'Fault');
    } catch (err) {
      setStatus('Connection Err');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white pb-12 uppercase">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">System Diagnostics</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Backend synchronization and neural grid status</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 md:p-14 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#00D09C]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 mb-8 group-hover:scale-105 transition-transform duration-500">
                  <ModernTv width={64} height={64} className={loading ? 'text-[#00D09C] animate-pulse' : 'text-white/20'} />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Diagnostic Probe</h2>
                <p className="text-white/20 text-[10px] font-black tracking-[0.4em] mb-10">Neural connection to Weather Core</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[8px] font-black text-white/20 tracking-widest mb-1 uppercase">Grid Status</div>
                    <div className={`text-sm font-black uppercase ${status === 'Synchronized' ? 'text-[#00D09C]' : 'text-[#FF6B35]'}`}>{status}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[8px] font-black text-white/20 tracking-widest mb-1 uppercase">Response Type</div>
                    <div className="text-sm font-black text-white uppercase">JSON-STREAMS</div>
                  </div>
                </div>

                <button
                  onClick={runTest}
                  disabled={loading}
                  className="w-full bg-[#00D09C] text-[#0D0D0D] py-6 rounded-[2rem] font-black tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Executing Synchronization...' : 'Initiate Diagnostic Probe'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-white/30 tracking-[0.4em] ml-2 uppercase">Telemetry Data</h2>
            <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white/5 h-full relative overflow-hidden group min-h-[400px]">
              {results ? (
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 text-[#00D09C] mb-8">
                    <CheckCircle width={20} height={20} />
                    <span className="text-[10px] font-black tracking-widest uppercase">Payload Received Successfully</span>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-3xl p-8 border border-white/5 font-mono text-xs text-[#00D09C] overflow-x-auto selection:bg-[#00D09C]/20">
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Network width={64} height={64} className="mb-6" />
                  <p className="text-[10px] font-black tracking-widest uppercase">Awaiting Stream Initialization</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
