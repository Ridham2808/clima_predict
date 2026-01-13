import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET() {
    try {
        const alerts = await prisma.alert.findMany({
            orderBy: { startTime: 'desc' },
        });

        if (alerts.length === 0) {
            // Return static data if DB is empty for now (seeding)
            const { weatherAlerts } = await import('@/data/staticData');
            return NextResponse.json(weatherAlerts);
        }

        return NextResponse.json(alerts);
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
