'use client';

import { useState, useEffect, useCallback } from 'react';
import { IoNotifications, IoClose, IoChevronForward } from 'react-icons/io5';
import Link from 'next/link';

let toastTrigger = null;

export const showToast = (notification) => {
    if (toastTrigger) toastTrigger(notification);
};

export default function NotificationToast() {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const trigger = useCallback((data) => {
        setNotification(data);
        setIsVisible(true);

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        toastTrigger = trigger;
        return () => {
            toastTrigger = null;
        };
    }, [trigger]);

    if (!notification) return null;

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-12 opacity-0 scale-95 pointer-events-none'
                }`}
        >
            <div className="bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-4 overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D09C]/5 to-[#4D9FFF]/5 pointer-events-none" />

                <div className="w-12 h-12 bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00D09C]/20">
                    <IoNotifications size={24} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">
                        {notification.title}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                        {notification.message}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <IoClose size={20} />
                    </button>
                    {notification.link && (
                        <Link
                            href={notification.link}
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 text-[#00D09C] hover:bg-[#00D09C]/10 rounded-lg transition-all"
                        >
                            <IoChevronForward size={20} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Animated progress bar */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] transition-all duration-[5000ms] ease-linear ${isVisible ? 'w-full' : 'w-0'
                        }`}
                />
            </div>
        </div>
    );
}
