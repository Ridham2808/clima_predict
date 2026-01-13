'use client';

import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import { communityPosts } from '@/data/staticData';
import {
  NavArrowRight,
  User,
  Send,
  ThumbsUp,
  ChatBubble,
  ShareAndroid,
  Pin
} from 'iconoir-react';

export default function Community() {
  return (
    <div className="min-h-screen text-white pb-28 uppercase">
      <div className="max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10 uppercase">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Farmer Community</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Connect, share insights, and discuss regional agricultural strategies</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Post Section */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 order-2 lg:order-1">
            <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Share Insight</h2>
                <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="bg-white/30 rounded-full w-10 h-10 flex items-center justify-center border border-white/30 flex-shrink-0">
                    <User width={20} height={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="flex-1 bg-transparent text-white placeholder-white/60 outline-none font-bold text-sm uppercase"
                  />
                  <button className="p-2 bg-white text-[#0D0D0D] rounded-xl active:scale-90 transition-all shadow-lg">
                    <Send width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
            <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-4 ml-1">Recent Activities</h2>
            {communityPosts.map((post, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-2xl w-14 h-14 flex items-center justify-center text-3xl shadow-lg border-2 border-white/10 flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="text-lg font-black text-white uppercase">{post.author}</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                        <Pin width={12} height={12} className="text-[#00D09C]" />
                        <span>{post.location}</span>
                        <span className="opacity-50">•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-lg font-medium text-white/80 leading-relaxed mb-8 uppercase tracking-tight">{post.content}</div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-[#00D09C]/10 hover:bg-[#00D09C]/20 px-5 py-3 rounded-2xl transition-all border border-[#00D09C]/10 text-[#00D09C] group/btn">
                    <ThumbsUp width={18} height={18} className="transition-transform group-hover/btn:-rotate-12" />
                    <span className="text-sm font-black uppercase tracking-widest">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 bg-[#4D9FFF]/10 hover:bg-[#4D9FFF]/20 px-5 py-3 rounded-2xl transition-all border border-[#4D9FFF]/10 text-[#4D9FFF] group/btn">
                    <ChatBubble width={18} height={18} className="transition-transform group-hover/btn:scale-110" />
                    <span className="text-sm font-black uppercase tracking-widest">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-2xl transition-all border border-white/5 text-white/40 hover:text-white">
                    <ShareAndroid width={18} height={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
