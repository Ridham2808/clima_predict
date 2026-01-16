'use client';

import { IoAdd, IoCompass } from 'react-icons/io5';

export default function GroupsSidebar({ groups, activeGroup, onSelectGroup, onCreateGroup }) {
    return (
        <aside className="w-[72px] bg-[#0E0E10] flex flex-col items-center py-3 space-y-2 h-full z-50 overflow-y-auto no-scrollbar">
            {/* Home/Back Button */}
            <button
                onClick={() => window.location.href = '/'}
                className="w-12 h-12 rounded-[50%] bg-[#36393F] text-[#00D09C] flex items-center justify-center hover:rounded-[30%] hover:bg-[#00D09C] hover:text-white transition-all duration-200 group relative shadow-lg"
            >
                <IoCompass size={26} />
                <div className="hidden md:block absolute left-[70px] px-3 py-1 bg-black text-white text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100]">
                    Home
                </div>
            </button>

            <div className="w-8 h-[2px] bg-white/5 rounded-full mx-auto" />

            {/* Groups List */}
            <div className="flex-1 w-full space-y-2 px-3">
                {groups.map((group) => (
                    <div key={group.id} className="relative group flex items-center justify-center">
                        {/* Active Indicator Pill */}
                        <div className={`absolute -left-3 w-2 bg-white rounded-r-full transition-all duration-200 ${activeGroup?.id === group.id ? 'h-10' : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'
                            }`} />

                        <button
                            onClick={() => onSelectGroup(group)}
                            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 relative overflow-hidden ${activeGroup?.id === group.id
                                    ? 'bg-[#00D09C] text-white rounded-[30%]'
                                    : 'bg-[#36393F] text-white/70 rounded-[50%] hover:rounded-[30%] hover:bg-[#00D09C] hover:text-white'
                                }`}
                        >
                            <span className="text-sm font-bold uppercase tracking-tight">
                                {group.name.substring(0, 2)}
                            </span>
                        </button>

                        {/* Tooltip */}
                        <div className="hidden md:block absolute left-[70px] px-3 py-1 bg-black text-white text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100]">
                            {group.name}
                        </div>
                    </div>
                ))}

                {/* Create Group Button */}
                <button
                    onClick={onCreateGroup}
                    className="w-12 h-12 rounded-[50%] bg-[#36393F] text-[#00D09C] flex items-center justify-center hover:rounded-[30%] hover:bg-[#00D09C] hover:text-white transition-all duration-200 group relative shadow-lg"
                >
                    <IoAdd size={28} />
                </button>
            </div>
        </aside>
    );
}
