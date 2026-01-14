'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import GroupChat from '@/components/GroupChat';
import { communityPosts } from '@/data/staticData';
import {
  IoArrowBack,
  IoPerson,
  IoSend,
  IoThumbsUp,
  IoChatbubble,
  IoShareSocial,
  IoLocation
} from 'react-icons/io5';

export default function Community() {
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'chat'

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white pb-32 md:pb-12">
        <div className="max-w-6xl mx-auto px-6 md:px-0">
          <header className="pt-4 md:pt-8 pb-4 flex items-center gap-4 md:mb-10">
            <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
              <IoArrowBack size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Farmer Community</h1>
              <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Connect, share insights, and discuss regional agricultural strategies</p>
            </div>
          </header>

          {/* Mobile Tab Switcher */}
          <div className="px-4 md:px-0 mb-6 md:hidden">
            <div className="flex bg-white/5 backdrop-blur-lg p-1.5 rounded-[1.5rem] border border-white/10">
              {['posts', 'chat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl capitalize transition-all duration-300 touch-target ${activeTab === tab
                      ? 'bg-[#00D09C] text-[#0D0D0D] shadow-lg shadow-[#00D09C]/20'
                      : 'text-white/40 hover:text-white/70'
                    }`}
                >
                  {tab === 'posts' ? 'Community' : 'Group Chat'}
                </button>
              ))}
            </div>
          </div>

          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Group Chat Section - Desktop always visible, Mobile tab-based */}
            <div className={`lg:col-span-5 lg:sticky lg:top-8 ${activeTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
              <GroupChat />
            </div>

            {/* Posts Feed - Desktop always visible, Mobile tab-based */}
            <div className={`lg:col-span-7 space-y-6 ${activeTab === 'posts' ? 'block' : 'hidden lg:block'}`}>
              <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-4 ml-1">Recent Activities</h2>
              {communityPosts.map((post, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-2xl w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl shadow-lg border-2 border-white/10 flex-shrink-0">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-black text-white uppercase">{post.author}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                          <IoLocation size={12} className="text-[#00D09C]" />
                          <span>{post.location}</span>
                          <span className="opacity-50">•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-base md:text-lg font-medium text-white/80 leading-relaxed mb-6 md:mb-8 uppercase tracking-tight">{post.content}</div>

                  <div className="flex gap-2 md:gap-3 flex-wrap">
                    <button className="flex items-center gap-2 bg-[#00D09C]/10 hover:bg-[#00D09C]/20 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all border border-[#00D09C]/10 text-[#00D09C] group/btn touch-target">
                      <IoThumbsUp size={18} className="transition-transform group-hover/btn:-rotate-12" />
                      <span className="text-xs font-black uppercase tracking-wider">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 bg-[#4D9FFF]/10 hover:bg-[#4D9FFF]/20 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all border border-[#4D9FFF]/10 text-[#4D9FFF] group/btn touch-target">
                      <IoChatbubble size={18} className="transition-transform group-hover/btn:scale-110" />
                      <span className="text-xs font-black uppercase tracking-wider">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all border border-white/5 text-white/60 group/btn touch-target">
                      <IoShareSocial size={18} className="transition-transform group-hover/btn:rotate-12" />
                      <span className="text-xs font-black uppercase tracking-wider">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
