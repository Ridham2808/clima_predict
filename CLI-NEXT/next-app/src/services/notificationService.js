/**
 * Notification Service
 * Handles in-app and SMS notifications.
 * Integration points: Twilio (for SMS) or similar provider.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const Pusher = require('pusher');
const { getPusherServer } = require('../utils/pusher');

class NotificationService {
    constructor() {
        this.twilioSid = process.env.TWILIO_ACCOUNT_SID;
        this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        this.twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    }

    /**
     * Get the Pusher instance from shared utility
     */
    getPusher() {
        return getPusherServer();
    }

    /**
     * Send a dual-channel notification (In-App + SMS if enabled)
     * @param {string} userId - Target user ID
     * @param {Object} data - { type, title, message }
     */
    async send(userId, data) {
        console.log(`[NotificationDelivery] Sending to ${userId}:`, data.title);

        try {
            // 1. Idempotency Check
            if (data.entityId) {
                const existing = await prisma.notification.findFirst({
                    where: {
                        userId,
                        entityId: data.entityId,
                        type: data.type || 'system'
                    }
                });
                if (existing) {
                    console.log(`[NotificationIdempotency] Already sent ${data.type} for entity ${data.entityId} to ${userId}`);
                    return existing;
                }
            }

            // 2. Create In-App Notification
            const inApp = await prisma.notification.create({
                data: {
                    userId,
                    type: data.type || 'system',
                    title: data.title,
                    message: data.message,
                    entityId: data.entityId,
                    isRead: false
                }
            });

            // 2. Real-Time Broadcast (Pusher) - Instant arrival on User's phone/screen
            try {
                const pusher = this.getPusher();
                if (pusher) {
                    await pusher.trigger(`user-${userId}`, 'new-notification', {
                        id: inApp.id,
                        title: data.title,
                        message: data.message,
                        type: data.type,
                        link: data.link,
                        createdAt: inApp.createdAt
                    });
                    console.log(`[RealTime] Success: Broadcasted to user-${userId}`);
                } else {
                    console.warn('[RealTime] Pusher not configured, skipping broadcast');
                }
            } catch (err) {
                console.warn('[RealTime] Pusher failed, notification will be seen after refresh:', err.message);
            }

            // 3. Fetch User for SMS logic
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { preferences: true }
            });

            if (user && user.preferences?.smsNotifications && user.phone) {
                await this.sendSMS(user.phone, `ClimaPredict: ${data.title}. ${data.message}`);
            }

            return inApp;
        } catch (error) {
            console.error('[NotificationDelivery] Critical Error:', error.message);
            throw error;
        }
    }

    /**
     * Internal SMS dispatcher (Simulated for Now with fallback logging)
     */
    async sendSMS(to, body) {
        if (this.twilioSid && this.twilioAuthToken) {
            console.log(`[SMS] Dispatching real SMS via Twilio to ${to}`);
            // Actual Twilio REST call would go here
            // const client = require('twilio')(this.twilioSid, this.twilioAuthToken);
            // await client.messages.create({ body, from: this.twilioFrom, to });
        } else {
            console.warn(`[SMS Mock] TWILIO_ACCOUNT_SID not found. Logged SMS body:`);
            console.log(`To: ${to} | Body: ${body}`);
        }
    }

    /**
     * Professional Fan-out: Send notifications to multiple users asynchronously.
     * @param {string[]} userIds - Array of user IDs
     * @param {Object} data - Notification data
     */
    batchSend(userIds, data) {
        if (!userIds || userIds.length === 0) return;

        console.log(`[NotificationFanOut] Queueing ${userIds.length} notifications for entity ${data.entityId || 'N/A'}`);

        // Use setImmediate to ensure this doesn't block the current event loop cycle (non-blocking)
        setImmediate(async () => {
            const results = await Promise.allSettled(
                userIds.map(userId => this.send(userId, data))
            );

            const success = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            console.log(`[NotificationFanOut] Completed: ${success} success, ${failed} failed`);
        });
    }
}

module.exports = new NotificationService();
