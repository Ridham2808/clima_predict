import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { verifyToken } from '@/utils/auth';

export async function GET(req) {
    try {
        const userId = await verifyToken(req);

        // If no user is authenticated, return mock data for demo
        if (!userId) {
            return NextResponse.json({
                success: true,
                data: [
                    {
                        id: 'demo-1',
                        type: 'Wheat',
                        crop: 'Wheat',
                        health: 85,
                        status: 'Healthy',
                        area: 'North Field',
                        stage: 'Flowering',
                        expectedYield: '4.5 tons/ha',
                        issues: [],
                    },
                    {
                        id: 'demo-2',
                        type: 'Rice',
                        crop: 'Rice',
                        health: 72,
                        status: 'Moderate',
                        area: 'East Field',
                        stage: 'Vegetative',
                        expectedYield: '3.8 tons/ha',
                        issues: ['Low nitrogen', 'Pest detected'],
                    },
                ],
            });
        }

        // Fetch user's crops from database with relations
        const crops = await prisma.crop.findMany({
            where: { userId },
            include: {
                agronomyRecords: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                soilData: true
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, data: crops });
    } catch (error) {
        console.error('Crops GET API Error:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({
            error: 'Failed to fetch crops',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const crop = await prisma.crop.create({
            data: {
                userId,
                type: data.type,
                health: data.health || 75,
                status: data.status || 'Healthy',
                area: data.area,
                stage: data.stage,
                sowingDate: data.sowingDate ? new Date(data.sowingDate) : null,
                expectedYield: data.expectedYield || 'Calculating...',
                issues: data.issues || [],
            },
        });

        return NextResponse.json({ success: true, data: crop });
    } catch (error) {
        console.error('Crop creation POST error:', error);
        return NextResponse.json({
            error: 'Failed to create crop',
            details: error.message
        }, { status: 500 });
    }
}
