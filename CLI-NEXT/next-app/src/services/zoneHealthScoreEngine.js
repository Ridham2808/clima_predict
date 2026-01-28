// Zone Health Score Engine - Calculates 0-100 health index per field zone
// Combines: Image analysis + Weather stress + Soil moisture + Crop stage alignment

import dataFusionService from './dataFusionService';
import cropOntologyEngine from './cropOntologyEngine';

/**
 * Zone Health Score Engine
 * Generates a comprehensive 0-100 health score for each field zone
 * Factors considered:
 * 1. Satellite NDVI/EVI (crop vigor)
 * 2. Weather stress index
 * 3. Soil moisture deviation from optimal
 * 4. Crop growth stage alignment
 * 5. Disease risk factors
 */

class ZoneHealthScoreEngine {
    constructor() {
        this.weights = {
            cropVigor: 0.30,      // 30% - Satellite NDVI/EVI
            weatherStress: 0.25,  // 25% - Temperature/humidity stress
            soilMoisture: 0.20,   // 20% - Soil moisture status
            growthStage: 0.15,    // 15% - Growth stage alignment
            diseaseRisk: 0.10     // 10% - Disease probability
        };
    }

    /**
     * Calculate comprehensive zone health score
     * @param {Object} params - { zoneId, lat, lon, cropType, daysAfterSowing, sensorData, imageAnalysis }
     * @returns {Object} Health score with breakdown
     */
    async calculateZoneHealth(params) {
        const {
            zoneId,
            lat,
            lon,
            cropType,
            daysAfterSowing,
            sensorData = {},
            imageAnalysis = null
        } = params;

        try {
            // Step 1: Fuse all data sources
            const fusedData = await dataFusionService.fuseZoneData({
                lat,
                lon,
                zoneId,
                sensorData
            });

            if (!fusedData.success) {
                console.warn('Data fusion returned limited results, proceeding with fallbacks.');
            }

            const data = fusedData.data || { satellite: {}, intelligence: {} };

            // Step 2: Calculate individual health factors
            const cropVigorScore = this.calculateCropVigorScore(data.satellite || {}, imageAnalysis);
            const weatherStressScore = this.calculateWeatherStressScore(data.intelligence?.temperatureStress || 1);
            const soilMoistureScore = this.calculateSoilMoistureScore(
                data.intelligence?.moistureStatus || 'Optimal',
                cropType
            );
            const growthStageScore = await this.calculateGrowthStageScore(
                cropType,
                daysAfterSowing,
                data
            );
            const diseaseRiskScore = await this.calculateDiseaseRiskScore(
                cropType,
                data.weather,
                daysAfterSowing,
                imageAnalysis
            );

            // Step 2: Weighting & Synthesis (Visual-First Hierarchy)
            // Weightings (Total = 1.0)
            const weights = {
                vigor: 0.60,      // Prioritize Visual Biometrics (NDVI/Image)
                weather: 0.10,    // Precautionary only
                moisture: 0.10,   // Root support
                growth: 0.10,     // Staging
                disease: 0.10     // Predictive risk
            };

            const overallScore = Math.round(
                (cropVigorScore.score * weights.vigor) +
                (weatherStressScore.score * weights.weather) +
                (soilMoistureScore.score * weights.moisture) +
                (growthStageScore.score * weights.growth) +
                (diseaseRiskScore.score * weights.disease)
            );

            // Step 3: Predictive Analytics (Impact Simulation)
            const factors = [
                { name: 'Visual Vigor', score: cropVigorScore.score, weight: weights.vigor },
                { name: 'Thermal Stability', score: weatherStressScore.score, weight: weights.weather },
                { name: 'Soil Hydration', score: soilMoistureScore.score, weight: weights.moisture },
                { name: 'Growth Alignment', score: growthStageScore.score, weight: weights.growth },
                { name: 'Biotic Risk', score: diseaseRiskScore.score, weight: weights.disease }
            ];

            const impactFactors = factors.map(f => {
                const normalizedImpact = Math.round(((f.score - 80) / 10) * f.weight * 10);
                return {
                    label: f.name,
                    value: f.score,
                    impact: normalizedImpact,
                    color: normalizedImpact < -1 ? '#FF6B35' : normalizedImpact > 0 ? '#00D09C' : '#FFC857'
                };
            });

            // Step 4.2: Severity Calibration & Unit Consistency
            let severityLabel = 'Balanced';
            let diagnosticSummary = "";
            const sortedByImpact = [...impactFactors].sort((a, b) => a.impact - b.impact);
            const primaryRootCause = sortedByImpact[0];

            if (overallScore >= 85) {
                severityLabel = 'Optimal';
                diagnosticSummary = "All visual biometrics aligned with professional standards.";
            } else if (overallScore >= 70) {
                severityLabel = 'Optimization Ready';
                diagnosticSummary = `${primaryRootCause.label} showing deviation. Optimization recommended.`;
            } else {
                severityLabel = overallScore < 50 ? 'Stress Warning' : 'Attention Required';
                diagnosticSummary = `Significant deviation in ${primaryRootCause.label} detected via real-time analysis.`;
            }

            const technicalExplanation = Math.abs(primaryRootCause.impact) > 1 ? diagnosticSummary : "Biometric parameters stabilized.";

            // Step 4.3: Conditional Risk Registry (Refined Tiers)
            let yieldRiskLabel = 'No risk detected - trajectory optimal';
            if (overallScore < 60) yieldRiskLabel = 'High yield loss probable if ignored';
            else if (overallScore < 75) yieldRiskLabel = 'Moderate yield risk';
            else if (overallScore < 85) yieldRiskLabel = 'Low optimization risk';
            else yieldRiskLabel = 'None - continue standard maintenance';

            // Step 5: Determine health level and trend
            const healthLevel = this.getHealthLevel(overallScore);
            const trend = this.calculateTrend(zoneId, overallScore);

            // Step 6: Generate actionable recommendations
            const recommendations = this.generateRecommendations({
                overallScore,
                cropVigorScore,
                weatherStressScore,
                soilMoistureScore,
                growthStageScore,
                diseaseRiskScore,
                cropType
            }, imageAnalysis);

            return {
                success: true,
                data: {
                    zoneId,
                    overallScore,
                    healthLevel,
                    trend,
                    technicalExplanation,
                    primaryRootCause: {
                        label: primaryRootCause.label,
                        impact: primaryRootCause.impact,
                        status: primaryRootCause.impact < -3 ? 'CRITICAL' : 'STABLE',
                        yieldRisk: yieldRiskLabel
                    },
                    impactFactors,
                    confidence: { score: Math.round((data.confidence || 0.85) * 100) },
                    breakdown: {
                        cropVigor: cropVigorScore,
                        weatherStress: weatherStressScore,
                        soilMoisture: soilMoistureScore,
                        growthStage: growthStageScore,
                        diseaseRisk: diseaseRiskScore
                    },
                    recommendations,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Zone health calculation error:', error);
            return {
                success: false,
                error: error.message,
                data: this.getFallbackHealth(zoneId)
            };
        }
    }

    /**
     * Calculate crop vigor score from satellite NDVI/EVI
     */
    calculateCropVigorScore(satelliteData, imageAnalysis) {
        let score = null;
        let confidence = 'none';
        const factors = [];

        // Satellite NDVI
        if (satelliteData && satelliteData.ndvi !== undefined) {
            const ndvi = satelliteData.ndvi;
            if (ndvi > 0.8) score = 95;
            else if (ndvi > 0.6) score = 75;
            else if (ndvi > 0.4) score = 50;
            else score = 30;
            confidence = satelliteData.dataQuality || 'moderate';
            factors.push(`Satellite NDVI: ${ndvi}`);
        }

        // Image analysis (DOMINANT SIGNAL)
        if (imageAnalysis && imageAnalysis.healthScore !== undefined) {
            const imageScore = imageAnalysis.healthScore;
            // If we have both, image (visual) is the truth: 80% weight
            score = score ? Math.round(score * 0.2 + imageScore * 0.8) : imageScore;
            factors.push(`Visual AI analysis: ${imageScore}%`);
            confidence = 'high';
        }

        if (score === null) {
            return { score: 0, confidence: 'none', factors: ['Waiting for visual evidence...'], ndvi: null };
        }

        return {
            score: Math.min(100, Math.max(0, score)),
            confidence,
            factors,
            ndvi: satelliteData?.ndvi || null
        };
    }

    /**
     * Calculate weather stress score (inverted - high stress = low score)
     */
    calculateWeatherStressScore(temperatureStress) {
        if (!temperatureStress || temperatureStress.level === 'unknown') {
            return {
                score: 70, // Assume moderate if unknown
                level: 'unknown',
                factors: ['Weather stress data not available']
            };
        }

        let score = 100;
        const factors = [];

        // Invert stress score (high stress = low health)
        const stressLevel = temperatureStress.level;

        if (stressLevel === 'high') {
            score = 40;
            factors.push(`High temperature stress (${temperatureStress.temperature}°C)`);
            factors.push(`Low humidity (${temperatureStress.humidity}%)`);
        } else if (stressLevel === 'moderate') {
            score = 70;
            factors.push(`Moderate temperature stress`);
        } else {
            score = 95;
            factors.push('Favorable weather conditions');
        }

        return {
            score,
            level: stressLevel,
            factors,
            recommendation: temperatureStress.recommendation
        };
    }

    /**
     * Calculate soil moisture score based on crop requirements
     */
    calculateSoilMoistureScore(moistureStatus, cropType) {
        if (!moistureStatus || moistureStatus.status === 'unknown') {
            return {
                score: 60,
                status: 'unknown',
                factors: ['Soil moisture data not available']
            };
        }

        let score = 100;
        const factors = [];
        const status = moistureStatus.status;

        if (status === 'optimal') {
            score = 100;
            factors.push(`Optimal soil moisture (${moistureStatus.value}%)`);
        } else if (status === 'moderate') {
            score = 75;
            factors.push(`Acceptable soil moisture (${moistureStatus.value}%)`);
        } else if (status === 'low') {
            score = 45;
            factors.push(`Low soil moisture (${moistureStatus.value}%) - irrigation needed`);
        } else if (status === 'high') {
            score = 55;
            factors.push(`High soil moisture (${moistureStatus.value}%) - waterlogging risk`);
        }

        return {
            score,
            status,
            value: moistureStatus.value,
            factors,
            recommendation: moistureStatus.recommendation
        };
    }

    /**
     * Calculate growth stage alignment score
     */
    async calculateGrowthStageScore(cropType, daysAfterSowing, fusedData) {
        if (!cropType || !daysAfterSowing) {
            return {
                score: 70,
                stage: 'unknown',
                factors: ['Growth stage data not available']
            };
        }

        // Get current growth stage
        const stageResult = cropOntologyEngine.getCurrentGrowthStage(cropType, daysAfterSowing);

        if (!stageResult.success) {
            return {
                score: 70,
                stage: 'unknown',
                factors: [stageResult.error]
            };
        }

        const currentStage = stageResult.data;
        const factors = [`Current stage: ${currentStage.currentStage}`];

        // Check if conditions match stage requirements
        const conditionsResult = cropOntologyEngine.checkOptimalConditions(cropType, {
            temperature: fusedData.weather?.temperature,
            soilMoisture: fusedData.sensors?.soilMoisture,
            humidity: fusedData.weather?.humidity
        });

        let score = 100;

        if (conditionsResult.success) {
            score = conditionsResult.data.overallScore;
            factors.push(`Conditions: ${conditionsResult.data.status}`);

            if (conditionsResult.data.deviations.length > 0) {
                conditionsResult.data.deviations.forEach(dev => {
                    factors.push(`${dev.factor}: ${dev.current} (optimal: ${dev.optimal})`);
                });
            }
        }

        return {
            score,
            stage: currentStage.currentStage,
            daysInStage: currentStage.daysInStage,
            factors,
            criticalFactors: currentStage.criticalFactors
        };
    }

    /**
     * Calculate disease risk score (inverted - high risk = low score)
     */
    async calculateDiseaseRiskScore(cropType, weatherData, daysAfterSowing, imageAnalysis = null) {
        if (!cropType || !weatherData) {
            return {
                score: 80,
                risk: 'unknown',
                factors: ['Disease risk assessment not available']
            };
        }

        // Get current growth stage for context
        const stageResult = cropOntologyEngine.getCurrentGrowthStage(cropType, daysAfterSowing);
        const growthStage = stageResult.success ? stageResult.data.currentStage : 'unknown';

        // Predict disease risk
        const riskResult = cropOntologyEngine.predictDiseaseRisk(
            cropType,
            {
                temperature: weatherData.temperature,
                humidity: weatherData.humidity,
                rainfall: weatherData.precipitation || 0
            },
            growthStage
        );

        if (!riskResult.success || riskResult.data.overallRisk === 'low') {
            return {
                score: 95,
                risk: 'low',
                factors: ['No significant disease risk detected'],
                diseases: []
            };
        }

        let score = 100;
        const risks = riskResult.data.risks;
        const factors = [];

        // Add weather-based risks
        risks.forEach(risk => {
            if (risk.riskLevel === 'very_high') {
                score -= 40;
                factors.push(`Very high risk: ${risk.disease}`);
            } else if (risk.riskLevel === 'high') {
                score -= 25;
                factors.push(`High risk: ${risk.disease}`);
            } else if (risk.riskLevel === 'moderate') {
                score -= 15;
                factors.push(`Moderate risk: ${risk.disease}`);
            }
        });

        // Add Image Analysis findings
        if (imageAnalysis && imageAnalysis.issues && imageAnalysis.issues.length > 0) {
            score -= (imageAnalysis.issues.length * 20); // Significant penalty for visual proof
            imageAnalysis.issues.forEach(issue => {
                factors.push(`Vision AI confirms: ${issue}`);
            });
        }

        return {
            score: Math.max(0, score),
            risk: score < 40 ? 'high' : score < 70 ? 'moderate' : 'low',
            riskCount: risks.length + (imageAnalysis?.issues?.length || 0),
            factors,
            diseases: risks.map(r => ({
                name: r.disease,
                level: r.riskLevel,
                controlMeasures: r.controlMeasures
            }))
        };
    }

    /**
     * Determine health level from score
     */
    getHealthLevel(score) {
        if (score >= 85) return { level: 'excellent', color: '#00D09C', icon: '🌟' };
        if (score >= 70) return { level: 'good', color: '#4D9FFF', icon: '✅' };
        if (score >= 50) return { level: 'moderate', color: '#FFC857', icon: '⚠️' };
        if (score >= 30) return { level: 'poor', color: '#FF6B35', icon: '⚠️' };
        return { level: 'critical', color: '#FF3B30', icon: '🚨' };
    }

    /**
     * Calculate trend (improving/stable/declining)
     */
    calculateTrend(zoneId, currentScore) {
        // TODO: Implement historical comparison
        // For now, return stable
        return {
            direction: 'stable',
            change: 0,
            icon: '→'
        };
    }

    /**
     * Generate actionable recommendations
     */
    generateRecommendations(scores, imageAnalysis = null) {
        const recommendations = [];

        // Image analysis recommendations (Direct from Vision AI)
        if (imageAnalysis && imageAnalysis.recommendations) {
            imageAnalysis.recommendations.forEach(rec => {
                recommendations.push({
                    priority: 'high',
                    category: 'photo_analysis',
                    action: rec,
                    timing: 'immediate',
                    source: 'AI Vision'
                });
            });
        }

        // Crop vigor recommendations
        if (scores.cropVigorScore.score < 70) {
            recommendations.push({
                priority: scores.cropVigorScore.score < 50 ? 'high' : 'moderate',
                category: 'crop_vigor',
                action: scores.cropVigorScore.factors[0] || 'Investigate low vegetation index.',
                timing: 'immediate'
            });
        }

        // Weather stress recommendations
        if (scores.weatherStressScore.score < 60) {
            recommendations.push({
                priority: 'high',
                category: 'weather_stress',
                action: scores.weatherStressScore.recommendation,
                timing: 'immediate'
            });
        }

        // Soil moisture recommendations
        if (scores.soilMoistureScore.score < 60) {
            recommendations.push({
                priority: 'urgent',
                category: 'irrigation',
                action: scores.soilMoistureScore.recommendation,
                timing: 'immediate'
            });
        }

        // Disease risk recommendations
        if (scores.diseaseRiskScore.score < 70 && scores.diseaseRiskScore.diseases.length > 0) {
            scores.diseaseRiskScore.diseases.forEach(disease => {
                recommendations.push({
                    priority: disease.level === 'very_high' ? 'urgent' : 'high',
                    category: 'disease_control',
                    action: `${disease.name}: ${disease.controlMeasures.join(', ')}`,
                    timing: disease.level === 'very_high' ? 'immediate' : 'next_24_hours'
                });
            });
        }

        // Growth stage recommendations
        if (scores.growthStageScore.score < 70) {
            recommendations.push({
                priority: 'moderate',
                category: 'growth_stage',
                action: 'Conditions not optimal for current growth stage. Review critical factors.',
                timing: 'next_48_hours'
            });
        }

        return recommendations;
    }

    /**
     * Fallback health data
     */
    getFallbackHealth(zoneId) {
        return {
            zoneId,
            overallScore: 50,
            healthLevel: { level: 'unknown', color: '#808080', icon: '❓' },
            trend: { direction: 'unknown', change: 0, icon: '?' },
            confidence: { score: 0, level: 'none' },
            breakdown: {},
            recommendations: [{
                priority: 'high',
                category: 'data',
                action: 'Insufficient data to calculate health score. Add sensors or satellite data.',
                timing: 'immediate'
            }],
            timestamp: new Date().toISOString(),
            isFallback: true
        };
    }
}

// Export singleton instance
const zoneHealthScoreEngine = new ZoneHealthScoreEngine();
export default zoneHealthScoreEngine;
