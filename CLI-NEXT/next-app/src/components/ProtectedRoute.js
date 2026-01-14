'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Cloud } from 'iconoir-react';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-[#00D09C]/20 rounded-full animate-ping absolute inset-0" />
                    <div className="relative bg-[#00D09C] p-6 rounded-3xl shadow-[0_0_50px_rgba(0,208,156,0.3)]">
                        <Cloud width={48} height={48} className="text-[#0D0D0D] animate-bounce" />
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Authenticating</h2>
                    <p className="text-white/40 text-sm font-medium animate-pulse uppercase tracking-widest">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
