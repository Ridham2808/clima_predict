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
        const token = req.cookies.get('auth_token')?.value;

        // If no token, return empty chat history instead of error
        if (!token) {
            return NextResponse.json({ data: [] }, { status: 200 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            // Invalid token, return empty history
            return NextResponse.json({ data: [] }, { status: 200 });
        }

        const chats = await prisma.chat.findMany({
            where: { userId: decoded.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({ data: chats }, { status: 200 });
    } catch (error) {
        console.error('Chat history error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await getUserIdFromRequest(req);

        const { message, response } = await req.json();

        if (!message || !response) {
            return NextResponse.json({ error: 'Message and response are required' }, { status: 400 });
        }

        // If no userId, just return success without saving (guest mode)
        if (!userId) {
            return NextResponse.json({ message: 'Chat not saved (guest mode)', success: true }, { status: 200 });
        }

        const chat = await prisma.chat.create({
            data: {
                userId,
                message,
                response,
            },
        });

        return NextResponse.json(chat, { status: 201 });
    } catch (error) {
        console.error('Chat history POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
