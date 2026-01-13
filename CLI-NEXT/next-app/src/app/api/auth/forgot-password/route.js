import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import prisma from '@/utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security reasons, don't reveal if user exists
            return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' }, { status: 200 });
        }

        const resetToken = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

        const msg = {
            to: email,
            from: SENDER_EMAIL,
            subject: 'ClimaPredict Password Reset',
            text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00D09C;">ClimaPredict Password Reset</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00D09C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">This link will expire in 1 hour.</p>
        </div>
      `,
        };

        if (SENDGRID_API_KEY) {
            await sgMail.send(msg);
        } else {
            console.warn('SendGrid API key not configured. Mocking reset URL:', resetUrl);
        }

        return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' }, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
