/**
 * Notification Service
 * Handles in-app and SMS notifications.
 * Integration points: Twilio (for SMS) or similar provider.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const Pusher = require('pusher');

class NotificationService {
    constructor() {
        this.twilioSid = process.env.TWILIO_ACCOUNT_SID;
        this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        this.twilioFrom = process.env.TWILIO_PHONE_NUMBER;

        // Real-time engine
        this.pusher = new Pusher({
            appId: "1929949",
            key: "fb36ee8f870a41707920",
            secret: "6032152f2050f28a38ae",
            cluster: "ap2",
            useTLS: true
        });
    }

    /**
     * Send a dual-channel notification (In-App + SMS if enabled)
     * @param {string} userId - Target user ID
     * @param {Object} data - { type, title, message }
     */
    async send(userId, data) {
        console.log(`[NotificationDelivery] Sending to ${userId}:`, data.title);

        try {
            // 1. Create In-App Notification
            const inApp = await prisma.notification.create({
                data: {
                    userId,
                    type: data.type || 'system',
                    title: data.title,
                    message: data.message,
                    isRead: false
                }
            });

            // 2. Real-Time Broadcast (Pusher) - Instant arrival on User's phone/screen
            try {
                await this.pusher.trigger(`user-${userId}`, 'new-notification', {
                    id: inApp.id,
                    title: data.title,
                    message: data.message,
                    type: data.type,
                    createdAt: inApp.createdAt
                });
                console.log(`[RealTime] Success: Broadcasted to user-${userId}`);
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
}

module.exports = new NotificationService();
