import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET() {
    try {
        // In a real app, we might fetch from an IoT platform or specific table
        // For now, let's assume we have a Sensor model or fallback to static data

        // Let's try to fetch if we had a Sensor model (which we don't yet in schema, let's just use static for now but via API)
        const { sensorData } = await import('@/data/staticData');

        // Randomize sensor values slightly to simulate live feed
        const dynamicSensors = sensorData.map(sensor => {
            let fluctuation = 0;
            if (sensor.name === 'Soil Moisture') fluctuation = (Math.random() - 0.5) * 4;
            if (sensor.name === 'Soil Temperature') fluctuation = (Math.random() - 0.5) * 2;
            if (sensor.name === 'Light Intensity') fluctuation = (Math.random() - 0.5) * 500;

            const newValue = typeof sensor.value === 'number'
                ? Number((sensor.value + fluctuation).toFixed(sensor.name === 'Soil pH' ? 1 : 0))
                : sensor.value;

            return {
                ...sensor,
                value: newValue,
                lastUpdated: 'Just now'
            };
        });

        return NextResponse.json(dynamicSensors);
    } catch (error) {
        console.error('Sensors GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        // Here you would save sensor data
        return NextResponse.json({ success: true, message: 'Sensor data recorded' }, { status: 201 });
    } catch (error) {
        console.error('Sensors POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
