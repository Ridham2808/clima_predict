import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function getUserIdFromRequest(req) {
    const token = req.cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (err) {
        return null;
    }
}

export async function GET(req) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            // Fallback for demo: return static crop health if not logged in
            const { cropHealth } = await import('@/data/staticData');
            return NextResponse.json(cropHealth);
        }

        const crops = await prisma.crop.findMany({
            where: { userId },
        });

        return NextResponse.json(crops);
    } catch (error) {
        console.error('Crops GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const crop = await prisma.crop.create({
            data: {
                ...data,
                userId,
            },
        });
        return NextResponse.json(crop, { status: 201 });
    } catch (error) {
        console.error('Crops POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
