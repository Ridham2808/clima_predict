'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoMail, IoLockClosed, IoPerson, IoWarning, IoShieldCheckmark } from 'react-icons/io5';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            router.push('/auth/login?registered=true');
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
                        <IoShieldCheckmark size={40} className="text-[#4D9FFF]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Identity Creation</h1>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">Register new operative protocols</p>
                </header>

                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && (
                            <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-4 flex items-center gap-3 text-[#FF6B35]">
                                <IoWarning size={20} />
                                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Operative Name</label>
                            <div className="relative">
                                <IoPerson className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:bg-white/10 transition-all uppercase placeholder:text-white/10"
                                    placeholder="Commander Alpha"
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Confirm Key</label>
                            <div className="relative">
                                <IoLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:bg-white/10 transition-all uppercase placeholder:text-white/10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#4D9FFF] to-[#9D4EDD] rounded-2xl py-5 text-white font-black tracking-[0.2em] text-xs hover:opacity-90 shadow-2xl active:scale-95 transition-all uppercase mt-4"
                        >
                            {loading ? 'Registering…' : 'Execute Creation'}
                        </button>
                    </form>
                </div>

                <footer className="text-center space-y-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Existing operative? <Link href="/auth/login" className="text-[#4D9FFF] hover:underline">Verify Identity</Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
