// API Route: /api/precision-ag/analyze-vision
// High-precision crop health analysis using Multi-Model Ensemble

import { NextResponse } from 'next/server';
import aiVisionEnsemble from '@/services/aiVisionEnsemble';

export async function POST(request) {
    try {
        const body = await request.json();
        const { image, context, description } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'No image data provided' },
                { status: 400 }
            );
        }

        // Context should include cropType, location (lat/lon), and current weather
        const defaultContext = {
            cropType: 'rice',
            location: 'Ahmedabad, IN',
            weather: { temperature: 28, humidity: 45, condition: 'Sunny' }
        };

        const mergedContext = { ...defaultContext, ...context, userDescription: description };

        // Perform Ensemble Analysis
        const result = await aiVisionEnsemble.analyzeEnsemble(image, mergedContext);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Vision analysis API error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Internal server error during vision analysis',
                details: error.message
            },
            { status: 500 }
        );
    }
}
