import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat') || '19.0760';
        const lon = searchParams.get('lon') || '72.8777';

        // 1. Try to get alerts from DB
        const dbAlerts = await prisma.alert.findMany({
            where: {
                endTime: { gte: new Date() }
            },
            orderBy: { startTime: 'desc' },
        });

        if (dbAlerts.length > 0) {
            return NextResponse.json(dbAlerts);
        }

        // 2. If DB empty, generate DYNAMIC alerts based on REAL current weather
        let weatherData = null;
        try {
            const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
            const weatherRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}`);
            if (weatherRes.ok) {
                weatherData = await weatherRes.json();
            }
        } catch (e) {
            console.error('Failed to fetch weather for alerts:', e);
        }

        const dynamicAlerts = [];
        const locationName = weatherData?.location?.name || 'your area';

        if (weatherData) {
            const condition = weatherData.current.condition.text.toLowerCase();
            const temp = weatherData.current.temp_c;
            const humidity = weatherData.current.humidity;

            // Heat Alert
            if (temp > 35) {
                dynamicAlerts.push({
                    id: 'heat-alert',
                    type: 'Heat Wave',
                    severity: 'Warning',
                    title: `High Temperature: ${temp}°C`,
                    description: `Extreme heat detected in ${locationName}. Stay hydrated and avoid outdoor work between 12 PM - 4 PM.`,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 86400000).toISOString(),
                    icon: '🔥',
                    color: '#FF6B35',
                });
            }

            // Rain/Thunderstorm Alert
            if (condition.includes('rain') || condition.includes('thunder') || condition.includes('storm')) {
                dynamicAlerts.push({
                    id: 'rain-alert',
                    type: 'Precipitation',
                    severity: 'Critical',
                    title: `Rain Detected: ${weatherData.current.condition.text}`,
                    description: `Current conditions in ${locationName} indicate ${condition}. Ensure proper drainage for sensitive crops.`,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 43200000).toISOString(),
                    icon: '⛈️',
                    color: '#4D9FFF',
                });
            }

            // Humidity Alert
            if (humidity > 90) {
                dynamicAlerts.push({
                    id: 'humidity-alert',
                    type: 'Fungal Risk',
                    severity: 'Advisory',
                    title: 'High Humidity Risk',
                    description: `Humidity is at ${humidity}% in ${locationName}. High risk of fungal diseases. Monitor your crops closely.`,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 86400000).toISOString(),
                    icon: '💧',
                    color: '#9D4EDD',
                });
            }
        }

        // 3. Fallback to static if still nothing (but make them location-specific)
        if (dynamicAlerts.length === 0) {
            dynamicAlerts.push({
                id: `notice-optimal-${lat}-${lon}`,
                type: 'Routine',
                severity: 'Informational',
                title: `Optimal Conditions in ${locationName}`,
                description: `Current weather in ${locationName} is ideal for field operations. No severe hazards predicted for the next 24h.`,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 86400000).toISOString(),
                icon: '✅',
                color: '#00D09C',
            });

            dynamicAlerts.push({
                id: `notice-irrigation-${lat}-${lon}`,
                type: 'Farming',
                severity: 'Advisory',
                title: 'Irrigation Window Open',
                description: `Low evaporation rates expected in ${locationName} today. Good time to finalize watering schedules.`,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 86400000).toISOString(),
                icon: '💧',
                color: '#4D9FFF',
            });
        }

        return NextResponse.json(dynamicAlerts);
    } catch (error) {
        console.error('Alerts GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        const alert = await prisma.alert.create({
            data: {
                ...data,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
            },
        });
        return NextResponse.json(alert, { status: 201 });
    } catch (error) {
        console.error('Alerts POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
