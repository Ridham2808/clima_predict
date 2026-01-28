import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { verifyToken } from '@/utils/auth';
import { getPusherServer } from '@/utils/pusher';
import notificationService from '@/services/notificationService';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const channelId = searchParams.get('channelId');

        if (!channelId) {
            return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
        }

        const messages = await prisma.chatMessage.findMany({
            where: { channelId },
            include: {
                user: {
                    select: { id: true, name: true }
                },
                repliedTo: {
                    include: {
                        user: { select: { name: true } }
                    }
                },
                reactions: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
            take: 50
        });

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error('Messages fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { channelId, message, audioUrl, fileUrl, fileType, repliedToId, isAI } = await req.json();

        const chatMessage = await prisma.chatMessage.create({
            data: {
                userId,
                channelId,
                message,
                audioUrl,
                fileUrl,
                fileType,
                repliedToId,
                isAI: isAI || false
            },
            include: {
                user: {
                    select: { id: true, name: true }
                },
                repliedTo: {
                    include: {
                        user: { select: { name: true } }
                    }
                },
                reactions: true
            }
        });

        // Trigger Pusher event for real-time update
        try {
            const pusher = getPusherServer();
            if (pusher) {
                // Align with frontend subscription to presence-channel
                await pusher.trigger(`presence-channel-${channelId}`, 'new-message', chatMessage);
            }
        } catch (pusherError) {
            console.error('Pusher broadcast failed:', pusherError);
        }

        // Professional Notification Fan-out (Wrapped in try/catch to be non-blocking)
        try {
            const channel = await prisma.channel.findUnique({
                where: { id: channelId },
                include: {
                    group: {
                        include: {
                            members: {
                                where: {
                                    userId: { not: userId },
                                    user: { preferences: { communityUpdates: true } }
                                },
                                select: { userId: true }
                            }
                        }
                    }
                }
            });

            if (channel?.group?.members?.length > 0) {
                const recipientIds = channel.group.members.map(m => m.userId);
                notificationService.batchSend(recipientIds, {
                    type: 'CHAT_MESSAGE',
                    title: `New message in ${channel.name}`,
                    message: `${chatMessage.user.name || 'Someone'}: ${message || 'sent an attachment'}`,
                    entityId: chatMessage.id,
                    link: `/community?groupId=${channel.groupId}&channelId=${channelId}`
                });
            }
        } catch (notifyError) {
            console.warn('[CommunityChat] Notification dispatch deferred:', notifyError.message);
        }

        return NextResponse.json({ success: true, message: chatMessage });

    } catch (error) {
        console.error('Message creation error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const messageId = searchParams.get('id');

        if (!messageId) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        // Verify ownership
        const msg = await prisma.chatMessage.findUnique({
            where: { id: messageId }
        });

        if (!msg || msg.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.chatMessage.delete({
            where: { id: messageId }
        });

        const pusher = getPusherServer();
        if (pusher) {
            await pusher.trigger(`presence-channel-${msg.channelId}`, 'message-deleted', { id: messageId });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Message deletion error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
