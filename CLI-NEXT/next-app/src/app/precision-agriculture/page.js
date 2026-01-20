'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import PrecisionAgFlow from '@/components/PrecisionAgFlow';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import Link from 'next/link';
import { NavArrowLeft } from 'iconoir-react';

/**
 * Precision Agriculture Page
 * Dedicated page for zone-based field management with multi-step onboarding
 */

export default function PrecisionAgriculturePage() {
    const { activeLocation } = useActiveLocation();

    return (
        <ProtectedRoute>
            <div className="min-h-screen text-white pb-32 md:pb-12 overflow-x-hidden selection:bg-[#00D09C]/30">
                <div className="w-full mx-auto px-4 md:px-8 py-10">
                    {/* Main Flow Manager */}
                    <PrecisionAgFlow location={activeLocation} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
