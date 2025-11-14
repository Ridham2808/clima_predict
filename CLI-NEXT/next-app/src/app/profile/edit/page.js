'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EditProfile() {
    const [formData, setFormData] = useState({
        name: 'Farmer Name',
        email: 'farmer@example.com',
        phone: '+91 98765 43210',
        location: 'Surat, Gujarat',
        farmSize: '15.5',
        crops: 'Wheat, Cotton, Rice, Sugarcane',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Profile updated successfully!');
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white pb-6">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <header className="px-5 pt-5 pb-4 flex items-center gap-4">
                    <Link href="/profile" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span className="text-xl">←</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white flex-1">Edit Profile</h1>
                </header>

                {/* Profile Picture */}
                <div className="px-5 mb-6 flex flex-col items-center">
                    <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-full w-24 h-24 flex items-center justify-center mb-3 border-4 border-white/10">
                        <span className="text-5xl">👤</span>
                    </div>
                    <button className="text-[#00D09C] text-sm font-semibold">Change Photo</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#B0B0B0] mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[#B0B0B0] mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-[#B0B0B0] mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                            placeholder="Enter your phone"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-[#B0B0B0] mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                            placeholder="City, State"
                        />
                    </div>

                    {/* Farm Size */}
                    <div>
                        <label className="block text-sm font-medium text-[#B0B0B0] mb-2">Farm Size (Acres)</label>
                        <input
                            type="number"
                            name="farmSize"
                            value={formData.farmSize}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                            placeholder="Enter farm size"
                        />
                    </div>

                    {/* Crops */}
                    <div>
                        <label className="block text-sm font-medium text-[#B0B0B0] mb-2">Crops Grown</label>
                        <textarea
                            name="crops"
                            value={formData.crops}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent resize-none"
                            placeholder="Enter crops (comma separated)"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] rounded-xl py-3 text-white font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
                    >
                        Save Changes
                    </button>

                    {/* Cancel Button */}
                    <Link href="/profile">
                        <button
                            type="button"
                            className="w-full bg-[#252525] border border-white/10 rounded-xl py-3 text-white font-semibold hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
}
