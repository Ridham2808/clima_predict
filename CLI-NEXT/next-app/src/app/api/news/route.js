import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            orderBy: { id: 'desc' }, // Assuming chronological ID or replace with createdAt
        });

        if (news.length === 0) {
            const { newsUpdates } = await import('@/data/staticData');
            return NextResponse.json(newsUpdates);
        }

        return NextResponse.json(news);
    } catch (error) {
        console.error('News GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        const newsItem = await prisma.news.create({
            data,
        });
        return NextResponse.json(newsItem, { status: 201 });
    } catch (error) {
        console.error('News POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
