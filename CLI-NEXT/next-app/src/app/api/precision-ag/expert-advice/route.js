import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import prisma from '@/utils/prisma';
import agronomistAI from '@/services/AgronomistAI';
import cropVisionAI from '@/services/CropVisionAI';
import recommendationGovernance from '@/services/recommendationGovernance';
import zoneHealthScoreEngine from '@/services/zoneHealthScoreEngine';

export async function POST(req) {
    try {
        const userId = await verifyToken(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const {
            cropId,
            cropType,
            daysAfterSowing,
            location,
            soilData,
            weather,
            photoBase64,
            description
        } = body;

        // Layer 1: Location-Blind Visual Signals
        let visualSignals = null;
        if (photoBase64) {
            visualSignals = await cropVisionAI.analyzePlantPhoto(photoBase64);

            // CONFIDENCE GATE: Rule 1
            if (visualSignals && visualSignals.confidence < 0.65) {
                return NextResponse.json({
                    error: 'LOW_CONFIDENCE',
                    message: 'Image quality is too low for reliable diagnosis. Please upload a clearer photo of the affected plant area.',
                    image_quality: visualSignals.image_quality,
                    confidence: visualSignals.confidence
                }, { status: 422 });
            }
        }

        // Layer 1.5: Calculate Health Score for Calibration
        const healthResult = await zoneHealthScoreEngine.calculateZoneHealth({
            zoneId: cropId,
            lat: location?.lat || 28.61,
            lon: location?.lon || 77.20,
            cropType,
            daysAfterSowing,
            sensorData: { soilMoisture: soilData?.moisture || 60 },
            imageAnalysis: visualSignals
        });
        const overallScore = healthResult.success ? healthResult.data.overallScore : 0;

        // Fetch Farm History (Wrapped in try/catch to handle DB outages gracefully)
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cropId);
        let history = [];
        if (isUuid) {
            try {
                history = await prisma.agronomyRecord.findMany({
                    where: { cropId: cropId },
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                });
            } catch (dbError) {
                console.warn('[ExpertAdvice] Database unreachable, proceeding without history:', dbError.message);
            }
        }

        // Layer 2: Location-Aware Expert AI Advice (Calibrated)
        console.log('Generating Score-Calibrated Advice for:', { cropType, overallScore });
        let expertAdvice = await agronomistAI.getExpertAdvice({
            cropType,
            growthStage: daysAfterSowing < 30 ? 'Seedling' : daysAfterSowing < 60 ? 'Vegetative' : 'Reproductive',
            location,
            soilData,
            weather,
            healthScore: overallScore, // CALIBRATION DATA
            history,
            photoAnalysis: visualSignals,
            userDescription: description
        });

        // Layer 3: Governance & Conflict Resolution
        expertAdvice = await recommendationGovernance.govern(expertAdvice, history);

        return NextResponse.json({
            success: true,
            data: expertAdvice,
            visualSignals
        });

    } catch (error) {
        console.error('Expert Advice API Error:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error.message,
                stack: error.stack,
                hint: 'Check GEMINI_API_KEY and DATABASE_URL in .env'
            },
            { status: 500 }
        );
    }
}
