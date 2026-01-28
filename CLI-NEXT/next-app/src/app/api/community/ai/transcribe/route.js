import { NextResponse } from 'next/server';
import aiService from '@/services/aiService';
import { verifyToken } from '@/utils/auth';

export async function POST(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { audioBase64, mimeType } = await req.json();

        if (!audioBase64) {
            return NextResponse.json({ error: 'Audio data is required' }, { status: 400 });
        }

        const prompt = "Please transcribe this audio message accurately. It is likely from a farmer discussing agricultural issues. Return only the transcription text.";

        // Note: Audio transcription works better with Gemini's native support
        // OpenAI fallback will use vision API which may not work perfectly for audio
        const result = await aiService.generateWithImage(prompt, audioBase64, {
            mimeType: mimeType || "audio/webm"
        });

        const transcription = result.text;
        console.log(`[AI Transcribe] Transcription completed using: ${result.provider}`);

        return NextResponse.json({ success: true, transcription });
    } catch (error) {
        console.error('AI Transcription error:', error);
        return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }
}
