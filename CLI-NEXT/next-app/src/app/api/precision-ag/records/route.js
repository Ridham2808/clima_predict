import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import prisma from '@/utils/prisma';

export async function GET(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const cropId = searchParams.get('cropId');

        if (!cropId) {
            return NextResponse.json({ error: 'Crop ID is required' }, { status: 400 });
        }

        const records = await prisma.agronomyRecord.findMany({
            where: { cropId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, records });
    } catch (error) {
        console.error('Agronomy Records GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const {
            cropId,
            action,
            inputUsed,
            dosage,
            weatherOnDay,
            decisionLogic
        } = await req.json();

        if (!cropId || !action) {
            return NextResponse.json({ error: 'Missing cropId or action' }, { status: 400 });
        }

        const record = await prisma.agronomyRecord.create({
            data: {
                cropId,
                action,
                inputUsed,
                dosage,
                weatherOnDay,
                decisionLogic
            }
        });

        return NextResponse.json({ success: true, record });
    } catch (error) {
        console.error('Agronomy Records POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
