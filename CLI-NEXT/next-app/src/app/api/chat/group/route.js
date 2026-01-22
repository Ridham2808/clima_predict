import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import notificationService from '@/services/notificationService';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Helper to get user from token
async function getUserFromToken(req) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

// GET - Fetch group chat messages
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        const messages = await prisma.chatMessage.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            skip: offset,
            take: limit,
        });

        const totalCount = await prisma.chatMessage.count();

        return NextResponse.json({
            messages,
            totalCount,
            hasMore: offset + limit < totalCount,
        });
    } catch (error) {
        console.error('Group chat fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Send new message
export async function POST(req) {
    try {
        const userId = await getUserFromToken(req);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, isAI } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const chatMessage = await prisma.chatMessage.create({
            data: {
                userId,
                message,
                isAI: isAI || false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Trigger Pusher for real-time
        try {
            const { getPusherServer } = await import('@/utils/pusher');
            const pusher = getPusherServer();
            if (pusher) {
                await pusher.trigger('group-chat', 'new-message', { message: chatMessage });
            }
        } catch (e) {
            console.error('Pusher error in group chat:', e);
        }

        // Professional Notification Fan-out (Async)
        try {
            // 1. Resolve recipients (All users with communityUpdates enabled, except sender)
            const recipients = await prisma.user.findMany({
                where: {
                    id: { not: userId },
                    preferences: {
                        communityUpdates: true
                    }
                },
                select: { id: true }
            });

            if (recipients.length > 0) {
                const recipientIds = recipients.map(r => r.id);

                notificationService.batchSend(recipientIds, {
                    type: 'CHAT_MESSAGE',
                    title: 'New Global Chat Message',
                    message: `${chatMessage.user.name || 'Someone'}: ${message}`,
                    entityId: chatMessage.id,
                    link: '/community' // Adjust link as needed for global chat
                });
            }
        } catch (notifyError) {
            console.error('Notification dispatch failed for global chat:', notifyError);
        }

        return NextResponse.json({ message: chatMessage }, { status: 201 });

    } catch (error) {
        console.error('Message send error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
