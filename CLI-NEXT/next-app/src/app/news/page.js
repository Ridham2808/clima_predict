'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import {
  NavArrowRight,
  Journal,
  Calendar,
  ArrowRight,
  Pin
} from 'iconoir-react';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await apiService.getNews();
      if (res.success) {
        setNewsList(res.data);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen text-white pb-12">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-0">
        <header className="pt-8 pb-4 flex items-center gap-4 md:mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all hover:bg-white/10">
            <NavArrowRight className="rotate-180" width={20} height={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">Meteorological Dispatch</h1>
            <p className="hidden md:block text-white/40 text-sm font-medium uppercase tracking-widest mt-1">Latest sector updates and climatic policy adjustments</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="animate-spin text-4xl mb-4">🌀</div>
              <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Downloading intelligence stream…</p>
            </div>
          ) : newsList.length > 0 ? (
            newsList.map((news, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:bg-white/[0.08] transition-all group">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#00D09C]/10 to-[#4D9FFF]/10 rounded-3xl flex items-center justify-center text-5xl flex-shrink-0 border border-white/5 shadow-xl">
                    {news.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#4D9FFF]/10 text-[#4D9FFF] rounded-full text-[8px] font-black uppercase tracking-widest border border-[#4D9FFF]/10">
                        {news.category}
                      </span>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                        <Calendar width={12} height={12} />
                        {news.time}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase mb-3 leading-tight group-hover:text-[#00D09C] transition-colors">{news.title}</h3>
                    <p className="text-sm text-white/40 font-medium leading-relaxed mb-6 line-clamp-2 md:line-clamp-3">{news.description}</p>

                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00D09C] group/btn">
                      Read Intelligence Report
                      <ArrowRight width={16} height={16} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <Journal width={48} height={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">No intel reports found in sector</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
