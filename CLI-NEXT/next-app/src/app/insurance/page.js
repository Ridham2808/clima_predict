'use client';

import Link from 'next/link';
import { insuranceData } from '@/data/staticData';
import {
  IoArrowBack,
  IoShieldCheckmark,
  IoCheckmarkCircle,
  IoWarning,
  IoStatsChart,
  IoServer,
  IoAdd
} from 'react-icons/io5';

export default function Insurance() {
  return (
    <div className="min-h-screen text-white pb-12 uppercase">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <IoArrowBack size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">Asset Protection</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Metamorphic risk coverage and agronomic indemnity</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Policy Overview */}
          <div className="lg:col-span-12">
            <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
                <div className="flex-1">
                  <div className="text-[10px] font-black text-[#0D0D0D]/40 tracking-[0.4em] mb-4">Active Coverage Policy</div>
                  <div className="text-4xl md:text-6xl font-black text-[#0D0D0D] tracking-tighter mb-8">{insuranceData.policyNumber}</div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <div className="text-[10px] font-black text-[#0D0D0D]/40 tracking-widest mb-1">Total Coverage</div>
                      <div className="text-2xl font-black text-[#0D0D0D]">₹{insuranceData.coverageAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-[#0D0D0D]/40 tracking-widest mb-1">Annual Premium</div>
                      <div className="text-2xl font-black text-[#0D0D0D]">₹{insuranceData.premium.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <div className="text-[10px] font-black text-[#0D0D0D]/40 tracking-widest mb-1">Termination Date</div>
                      <div className="text-xl font-black text-[#0D0D0D]/80">{insuranceData.expiryDate}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-2xl">
                  <IoShieldCheckmark size={64} className="text-white mb-6" />
                  <div className="px-6 py-2 bg-white text-[#0D0D0D] rounded-xl text-[10px] font-black tracking-widest">{insuranceData.status}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk & Analytics */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-[10px] font-black text-white/30 tracking-[0.4em] mb-4 ml-1">Risk Assessment</h2>
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#00D09C]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center p-6 bg-[#00D09C]/10 rounded-3xl mb-8 border border-[#00D09C]/10">
                  <IoStatsChart size={48} className="text-[#00D09C]" />
                </div>
                <div className="text-6xl font-black text-[#00D09C] mb-2">{insuranceData.riskScore}</div>
                <div className="text-[10px] font-black text-white/20 tracking-widest mb-8">Aggregate Precision Score</div>
                <div className="px-8 py-3 bg-[#00D09C] text-[#0D0D0D] rounded-2xl text-[10px] font-black tracking-widest inline-block uppercase">
                  {insuranceData.riskCategory} Risk Profile
                </div>
              </div>
            </div>
          </div>

          {/* Claims History */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-[10px] font-black text-white/30 tracking-[0.4em]">Indemnity History</h2>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#00D09C] tracking-widest">
                <IoAdd size={16} />
                Initiate Claim
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 flex-1">
              {insuranceData.claimsHistory.map((claim, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:bg-white/[0.08] transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="p-4 bg-white/5 rounded-2xl text-white/20 group-hover:text-white transition-colors">
                      <IoServer size={24} />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white mb-1">{claim.type}</div>
                      <div className="text-[10px] font-bold text-white/20 tracking-widest">{claim.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white mb-2">₹{claim.amount.toLocaleString()}</div>
                    <div className={`text-[8px] font-black px-4 py-1.5 rounded-lg border tracking-widest ${claim.status === 'Approved' ? 'bg-[#00D09C]/10 border-[#00D09C]/20 text-[#00D09C]' : 'bg-[#4D9FFF]/10 border-[#4D9FFF]/20 text-[#4D9FFF]'
                      }`}>
                      {claim.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
