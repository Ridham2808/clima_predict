'use client';

import Link from 'next/link';

export default function Insurance() {
  const insurancePolicies = [
    {
      id: 1,
      name: 'Pradhan Mantri Fasal Bima Yojana',
      type: 'Crop Insurance',
      coverage: '₹5,00,000',
      premium: '₹12,500/year',
      status: 'Active',
      validUntil: 'March 31, 2026',
      crops: ['Wheat', 'Cotton', 'Rice'],
      icon: '🌾',
      color: '#00D09C',
    },
    {
      id: 2,
      name: 'Weather Based Crop Insurance',
      type: 'Weather Insurance',
      coverage: '₹3,00,000',
      premium: '₹8,000/year',
      status: 'Active',
      validUntil: 'December 31, 2025',
      crops: ['Sugarcane'],
      icon: '🌤️',
      color: '#4D9FFF',
    },
  ];

  const recentClaims = [
    {
      id: 1,
      date: 'Oct 15, 2025',
      reason: 'Heavy Rainfall Damage',
      amount: '₹45,000',
      status: 'Approved',
      statusColor: '#00D09C',
    },
    {
      id: 2,
      date: 'Aug 22, 2025',
      reason: 'Drought Impact',
      amount: '₹32,000',
      status: 'Processing',
      statusColor: '#FFC857',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="px-5 pt-5 pb-4 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-2xl font-bold text-white flex-1">Insurance</h1>
        </header>

        {/* Summary Card */}
        <div className="px-5 mb-6">
          <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <span className="text-3xl">🛡️</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/80">Total Coverage</div>
                <div className="text-3xl font-bold text-white">₹8,00,000</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <div className="text-sm text-white/80">Active Policies</div>
                <div className="text-xl font-bold text-white">2</div>
              </div>
              <div>
                <div className="text-sm text-white/80">Annual Premium</div>
                <div className="text-xl font-bold text-white">₹20,500</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Policies */}
        <div className="px-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Active Policies</h2>
          <div className="space-y-3">
            {insurancePolicies.map((policy) => (
              <div key={policy.id} className="bg-[#252525] rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: `${policy.color}20` }}
                  >
                    <span className="text-2xl">{policy.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-white mb-1">{policy.name}</div>
                    <div className="text-sm text-[#B0B0B0]">{policy.type}</div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                    style={{ backgroundColor: `${policy.color}33` }}
                  >
                    {policy.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-[#B0B0B0] mb-1">Coverage</div>
                    <div className="text-sm font-semibold text-white">{policy.coverage}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#B0B0B0] mb-1">Premium</div>
                    <div className="text-sm font-semibold text-white">{policy.premium}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-[#B0B0B0] mb-1">Covered Crops</div>
                  <div className="flex flex-wrap gap-2">
                    {policy.crops.map((crop, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/5 px-2 py-1 rounded-lg text-white"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-[#B0B0B0]">
                  Valid until: <span className="text-white">{policy.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Claims */}
        <div className="px-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Claims</h2>
          <div className="space-y-3">
            {recentClaims.map((claim) => (
              <div key={claim.id} className="bg-[#252525] rounded-2xl p-4 border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-white mb-1">{claim.reason}</div>
                    <div className="text-sm text-[#B0B0B0]">{claim.date}</div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                    style={{ backgroundColor: `${claim.statusColor}33` }}
                  >
                    {claim.status}
                  </div>
                </div>
                <div className="text-xl font-bold text-[#00D09C]">{claim.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 space-y-3">
          <button className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-xl py-3 text-white font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]">
            File New Claim
          </button>
          <button className="w-full bg-[#252525] border border-white/10 rounded-xl py-3 text-white font-semibold hover:bg-white/5 transition-colors">
            Add New Policy
          </button>
        </div>
      </div>
    </div>
  );
}
