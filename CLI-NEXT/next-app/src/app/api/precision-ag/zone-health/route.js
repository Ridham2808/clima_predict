// API Route: /api/precision-ag/zone-health
// Calculate zone health score using all data sources

import { NextResponse } from 'next/server';

// Import services (using dynamic import for Next.js compatibility)
const getZoneHealthScoreEngine = async () => {
    const module = await import('@/services/zoneHealthScoreEngine');
    return module.default;
};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract parameters
        const zoneId = searchParams.get('zoneId') || 'zone_1';
        const lat = parseFloat(searchParams.get('lat') || '28.6139');
        const lon = parseFloat(searchParams.get('lon') || '77.2090');
        const cropType = searchParams.get('cropType') || 'rice';
        const daysAfterSowing = parseInt(searchParams.get('daysAfterSowing') || '45');

        // Parse sensor data if provided
        let sensorData = {};
        const sensorDataParam = searchParams.get('sensorData');
        if (sensorDataParam) {
            try {
                sensorData = JSON.parse(sensorDataParam);
            } catch (e) {
                console.error('Invalid sensor data JSON:', e);
            }
        }

        // Get zone health score engine
        const zoneHealthScoreEngine = await getZoneHealthScoreEngine();

        // Calculate zone health
        const result = await zoneHealthScoreEngine.calculateZoneHealth({
            zoneId,
            lat,
            lon,
            cropType,
            daysAfterSowing,
            sensorData,
            imageAnalysis: null // TODO: Integrate image analysis
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to calculate zone health' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('Zone health API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            zoneId,
            lat,
            lon,
            cropType,
            daysAfterSowing,
            sensorData = {},
            imageAnalysis = null
        } = body;

        // Validate required fields
        if (!zoneId || !lat || !lon || !cropType) {
            return NextResponse.json(
                { error: 'Missing required fields: zoneId, lat, lon, cropType' },
                { status: 400 }
            );
        }

        // Get zone health score engine
        const zoneHealthScoreEngine = await getZoneHealthScoreEngine();

        // Calculate zone health
        const result = await zoneHealthScoreEngine.calculateZoneHealth({
            zoneId,
            lat,
            lon,
            cropType,
            daysAfterSowing,
            sensorData,
            imageAnalysis
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to calculate zone health' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('Zone health API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
