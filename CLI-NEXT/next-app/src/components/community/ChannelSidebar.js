'use client';

import { IoChatbubble, IoVolumeHigh, IoWarning, IoLeaf, IoCash, IoSettingsOutline, IoPerson, IoAdd, IoSearch } from 'react-icons/io5';

const CHANNEL_ICONS = {
    general: <IoChatbubble size={18} />,
    weather: <IoWarning size={18} />,
    'crop-help': <IoLeaf size={18} />,
    'market-prices': <IoCash size={18} />,
    'voice-room': <IoVolumeHigh size={18} />,
    DEFAULT: <IoChatbubble size={18} />
};

export default function ChannelSidebar({ activeGroup, activeChannel, onSelectChannel, user, onCreateChannel }) {
    if (!activeGroup) return null;

    return (
        <div className="flex-1 bg-[#2F3136] flex flex-col h-full overflow-hidden rounded-tl-[32px] md:rounded-tl-none">
            {/* Group Header */}
            <div className="h-[48px] px-4 flex items-center justify-between border-b border-[#202225] shadow-sm flex-shrink-0">
                <h2 className="text-[15px] font-bold text-white tracking-tight truncate">{activeGroup.name}</h2>
                <div className="flex items-center gap-2">
                    <IoSettingsOutline size={20} className="text-[#B9BBBE]" />
                </div>
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto px-2 pt-4 space-y-4 no-scrollbar">
                {/* Search Visual */}
                <div className="px-2 mb-2">
                    <div className="flex items-center gap-3 bg-[#202225] rounded-md px-3 py-1.5 text-[#8E9297] text-sm">
                        <IoSearch size={16} />
                        <span>Search</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between px-2 mb-1">
                        <h3 className="text-[12px] font-bold text-[#8E9297] uppercase tracking-wide">Topic Channels</h3>
                        <button
                            onClick={onCreateChannel}
                            className="text-[#8E9297] hover:text-white transition-colors"
                        >
                            <IoAdd size={18} />
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {activeGroup.channels?.filter(c => c.type === 'TEXT').map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => onSelectChannel(channel)}
                                className={`w-full flex items-center gap-3 px-2 py-2 rounded-md transition-all group ${activeChannel?.id === channel.id
                                    ? 'bg-[#393D42] text-white'
                                    : 'text-[#8E9297] hover:bg-[#34373C] hover:text-[#DCDDDE]'
                                    }`}
                            >
                                <span className={`text-[#8E9297] ${activeChannel?.id === channel.id ? 'text-white' : ''}`}>
                                    <span className="text-xl font-light">#</span>
                                </span>
                                <span className={`text-[15px] ${activeChannel?.id === channel.id ? 'font-medium' : ''}`}>
                                    {channel.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="px-2 text-[12px] font-bold text-[#8E9297] uppercase tracking-wide mb-1">Voice Lounges</h3>
                    <div className="space-y-0.5">
                        {activeGroup.channels?.filter(c => c.type === 'VOICE').map((channel) => (
                            <button
                                key={channel.id}
                                className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-[#8E9297] hover:bg-[#34373C] hover:text-[#DCDDDE] transition-all group"
                            >
                                <IoVolumeHigh size={20} className="text-[#8E9297]" />
                                <span className="text-[15px]">{channel.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Bar (Discord Style) */}
            <div className="bg-[#292B2F] px-2 py-2.5 flex items-center gap-2 border-t border-[#202225] flex-shrink-0">
                <div className="relative">
                    <div className="w-8 h-8 bg-[#4F545C] rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                        {user?.name?.substring(0, 1) || <IoPerson size={16} />}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3BA55D] border-[2px] border-[#292B2F] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-white truncate leading-tight">{user?.name || 'Farmer'}</div>
                    <div className="text-[11px] text-[#B9BBBE] truncate leading-tight">Online</div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 text-[#B9BBBE] hover:bg-[#393D42] rounded-md transition-all">
                        <IoSettingsOutline size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
