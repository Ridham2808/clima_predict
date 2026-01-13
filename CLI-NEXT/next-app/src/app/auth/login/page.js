'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoMail, IoLockClosed, IoLogIn, IoWarning } from 'react-icons/io5';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Store token (client-side as well for convenience)
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-6 py-12">
            <div className="w-full max-w-md mx-auto space-y-8">
                <header className="text-center">
                    <div className="inline-flex p-4 bg-white/5 rounded-[2rem] border border-white/5 mb-6">
                        <IoLogIn size={40} className="text-[#00D09C]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Nexus Entry</h1>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">Access secure meteorological streams</p>
                </header>

                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-4 flex items-center gap-3 text-[#FF6B35]">
                                <IoWarning size={20} />
                                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Email Identity</label>
                            <div className="relative">
                                <IoMail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:bg-white/10 transition-all uppercase placeholder:text-white/10"
                                    placeholder="name@nexus.io"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Security Key</label>
                            <div className="relative">
                                <IoLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:bg-white/10 transition-all uppercase placeholder:text-white/10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-2xl py-5 text-[#0D0D0D] font-black tracking-[0.2em] text-xs hover:opacity-90 shadow-2xl active:scale-95 transition-all uppercase mt-4"
                        >
                            {loading ? 'Authenticating…' : 'Initialize Session'}
                        </button>

                        <div className="text-center">
                            <Link href="/auth/forgot-password" title="Recover Access" className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors">
                                Recover Access protocol
                            </Link>
                        </div>
                    </form>
                </div>

                <footer className="text-center space-y-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        New operative? <Link href="/auth/register" className="text-[#00D09C] hover:underline">Register Identity</Link>
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors">
                        <IoArrowBack size={14} /> Global Feed
                    </Link>
                </footer>
            </div>
        </div>
    );
}
