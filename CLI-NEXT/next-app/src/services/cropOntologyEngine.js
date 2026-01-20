// Crop Ontology Engine - Crop-specific rules, thresholds, and disease databases
// This makes the system CROP-AWARE instead of generic AI

/**
 * Crop Ontology Engine
 * Provides crop-specific intelligence:
 * - Growth stages and timing
 * - Disease susceptibility by stage
 * - Optimal environmental thresholds
 * - Region-specific adaptations
 */

class CropOntologyEngine {
    constructor() {
        this.cropDatabase = this.initializeCropDatabase();
        this.diseaseDatabase = this.initializeDiseaseDatabase();
        this.regionalAdaptations = this.initializeRegionalAdaptations();
    }

    /**
     * Initialize crop-specific knowledge base
     */
    initializeCropDatabase() {
        return {
            rice: {
                name: 'Rice (Paddy)',
                scientificName: 'Oryza sativa',
                growthStages: [
                    { stage: 'germination', days: '0-10', criticalFactors: ['temperature', 'moisture'] },
                    { stage: 'seedling', days: '10-30', criticalFactors: ['nutrients', 'water'] },
                    { stage: 'tillering', days: '30-50', criticalFactors: ['nitrogen', 'water'] },
                    { stage: 'stem_elongation', days: '50-70', criticalFactors: ['water', 'nutrients'] },
                    { stage: 'panicle_initiation', days: '70-90', criticalFactors: ['phosphorus', 'water'] },
                    { stage: 'flowering', days: '90-110', criticalFactors: ['temperature', 'humidity'] },
                    { stage: 'grain_filling', days: '110-130', criticalFactors: ['water', 'temperature'] },
                    { stage: 'maturity', days: '130-150', criticalFactors: ['drying'] }
                ],
                optimalConditions: {
                    temperature: { min: 20, max: 35, optimal: 25 },
                    soilMoisture: { min: 60, max: 100, optimal: 80 }, // Rice needs high moisture
                    humidity: { min: 50, max: 90, optimal: 70 },
                    pH: { min: 5.5, max: 7.0, optimal: 6.5 }
                },
                commonDiseases: ['blast', 'bacterial_blight', 'sheath_blight', 'brown_spot'],
                waterRequirement: 'high', // 1200-1500mm per season
                fertilizerSchedule: {
                    basal: { N: 40, P: 20, K: 20 },
                    tillering: { N: 30, P: 0, K: 0 },
                    panicle: { N: 30, P: 10, K: 10 }
                }
            },

            wheat: {
                name: 'Wheat',
                scientificName: 'Triticum aestivum',
                growthStages: [
                    { stage: 'germination', days: '0-7', criticalFactors: ['moisture', 'temperature'] },
                    { stage: 'seedling', days: '7-21', criticalFactors: ['nutrients'] },
                    { stage: 'tillering', days: '21-45', criticalFactors: ['nitrogen'] },
                    { stage: 'stem_extension', days: '45-70', criticalFactors: ['water', 'nutrients'] },
                    { stage: 'booting', days: '70-85', criticalFactors: ['water'] },
                    { stage: 'heading', days: '85-100', criticalFactors: ['temperature'] },
                    { stage: 'flowering', days: '100-110', criticalFactors: ['temperature', 'humidity'] },
                    { stage: 'grain_filling', days: '110-130', criticalFactors: ['water'] },
                    { stage: 'maturity', days: '130-150', criticalFactors: ['drying'] }
                ],
                optimalConditions: {
                    temperature: { min: 12, max: 25, optimal: 20 },
                    soilMoisture: { min: 40, max: 70, optimal: 55 },
                    humidity: { min: 40, max: 70, optimal: 55 },
                    pH: { min: 6.0, max: 7.5, optimal: 6.5 }
                },
                commonDiseases: ['rust', 'powdery_mildew', 'septoria', 'fusarium'],
                waterRequirement: 'moderate', // 450-650mm per season
                fertilizerSchedule: {
                    basal: { N: 50, P: 30, K: 20 },
                    tillering: { N: 40, P: 0, K: 0 },
                    booting: { N: 30, P: 0, K: 10 }
                }
            },

            cotton: {
                name: 'Cotton',
                scientificName: 'Gossypium hirsutum',
                growthStages: [
                    { stage: 'germination', days: '0-10', criticalFactors: ['temperature', 'moisture'] },
                    { stage: 'seedling', days: '10-30', criticalFactors: ['nutrients'] },
                    { stage: 'squaring', days: '30-60', criticalFactors: ['nitrogen', 'water'] },
                    { stage: 'flowering', days: '60-90', criticalFactors: ['water', 'temperature'] },
                    { stage: 'boll_development', days: '90-120', criticalFactors: ['water', 'nutrients'] },
                    { stage: 'boll_opening', days: '120-150', criticalFactors: ['drying'] },
                    { stage: 'maturity', days: '150-180', criticalFactors: ['drying'] }
                ],
                optimalConditions: {
                    temperature: { min: 21, max: 37, optimal: 28 },
                    soilMoisture: { min: 50, max: 75, optimal: 60 },
                    humidity: { min: 50, max: 80, optimal: 65 },
                    pH: { min: 6.0, max: 8.0, optimal: 7.0 }
                },
                commonDiseases: ['bollworm', 'fusarium_wilt', 'bacterial_blight', 'leaf_curl'],
                waterRequirement: 'high', // 700-1300mm per season
                fertilizerSchedule: {
                    basal: { N: 40, P: 40, K: 20 },
                    squaring: { N: 40, P: 0, K: 20 },
                    flowering: { N: 30, P: 0, K: 20 }
                }
            },

            tomato: {
                name: 'Tomato',
                scientificName: 'Solanum lycopersicum',
                growthStages: [
                    { stage: 'germination', days: '0-10', criticalFactors: ['temperature', 'moisture'] },
                    { stage: 'seedling', days: '10-25', criticalFactors: ['light', 'nutrients'] },
                    { stage: 'vegetative', days: '25-50', criticalFactors: ['nitrogen', 'water'] },
                    { stage: 'flowering', days: '50-70', criticalFactors: ['phosphorus', 'temperature'] },
                    { stage: 'fruit_set', days: '70-90', criticalFactors: ['water', 'calcium'] },
                    { stage: 'fruit_development', days: '90-120', criticalFactors: ['water', 'potassium'] },
                    { stage: 'ripening', days: '120-140', criticalFactors: ['temperature'] }
                ],
                optimalConditions: {
                    temperature: { min: 18, max: 29, optimal: 24 },
                    soilMoisture: { min: 60, max: 80, optimal: 70 },
                    humidity: { min: 60, max: 85, optimal: 70 },
                    pH: { min: 6.0, max: 6.8, optimal: 6.5 }
                },
                commonDiseases: ['early_blight', 'late_blight', 'fusarium_wilt', 'bacterial_spot'],
                waterRequirement: 'moderate', // 400-600mm per season
                fertilizerSchedule: {
                    basal: { N: 30, P: 50, K: 30 },
                    vegetative: { N: 40, P: 0, K: 0 },
                    flowering: { N: 20, P: 20, K: 40 }
                }
            }
        };
    }

    /**
     * Initialize disease database with symptoms and conditions
     */
    initializeDiseaseDatabase() {
        return {
            blast: {
                name: 'Rice Blast',
                crops: ['rice'],
                pathogen: 'Magnaporthe oryzae',
                favorableConditions: {
                    temperature: { min: 25, max: 28 },
                    humidity: { min: 85, max: 100 },
                    leafWetness: { hours: 8 }
                },
                symptoms: ['diamond-shaped lesions', 'gray center', 'brown margins'],
                severity: 'high',
                controlMeasures: ['fungicide spray', 'resistant varieties', 'balanced fertilization']
            },

            rust: {
                name: 'Wheat Rust',
                crops: ['wheat'],
                pathogen: 'Puccinia spp.',
                favorableConditions: {
                    temperature: { min: 15, max: 22 },
                    humidity: { min: 70, max: 100 },
                    leafWetness: { hours: 6 }
                },
                symptoms: ['orange-red pustules', 'leaf yellowing', 'premature drying'],
                severity: 'high',
                controlMeasures: ['fungicide spray', 'resistant varieties', 'early sowing']
            },

            bollworm: {
                name: 'Cotton Bollworm',
                crops: ['cotton'],
                pathogen: 'Helicoverpa armigera',
                favorableConditions: {
                    temperature: { min: 25, max: 30 },
                    humidity: { min: 60, max: 80 }
                },
                symptoms: ['boll damage', 'larval presence', 'flower drop'],
                severity: 'high',
                controlMeasures: ['Bt cotton', 'pheromone traps', 'insecticide spray']
            },

            late_blight: {
                name: 'Late Blight',
                crops: ['tomato', 'potato'],
                pathogen: 'Phytophthora infestans',
                favorableConditions: {
                    temperature: { min: 10, max: 25 },
                    humidity: { min: 90, max: 100 },
                    leafWetness: { hours: 12 }
                },
                symptoms: ['water-soaked lesions', 'white fungal growth', 'fruit rot'],
                severity: 'very_high',
                controlMeasures: ['fungicide spray', 'remove infected plants', 'improve drainage']
            }
        };
    }

    /**
     * Initialize regional adaptations
     */
    initializeRegionalAdaptations() {
        return {
            punjab: {
                region: 'Punjab',
                climate: 'semi-arid',
                majorCrops: ['wheat', 'rice', 'cotton'],
                adaptations: {
                    rice: { waterManagement: 'critical', pest: 'stem_borer_high' },
                    wheat: { sowingWindow: 'nov_1_to_20', variety: 'PBW_343' }
                }
            },
            maharashtra: {
                region: 'Maharashtra',
                climate: 'tropical',
                majorCrops: ['cotton', 'sugarcane', 'soybean'],
                adaptations: {
                    cotton: { bollwormRisk: 'very_high', btCotton: 'recommended' }
                }
            },
            kerala: {
                region: 'Kerala',
                climate: 'tropical_humid',
                majorCrops: ['rice', 'coconut', 'rubber'],
                adaptations: {
                    rice: { diseaseRisk: 'high_humidity_diseases', drainage: 'critical' }
                }
            }
        };
    }

    /**
     * Get crop-specific information
     */
    getCropInfo(cropType) {
        const crop = this.cropDatabase[cropType.toLowerCase()];
        if (!crop) {
            return {
                success: false,
                error: `Crop type '${cropType}' not found in database`
            };
        }
        return { success: true, data: crop };
    }

    /**
     * Determine current growth stage based on days after sowing
     */
    getCurrentGrowthStage(cropType, daysAfterSowing) {
        const cropInfo = this.getCropInfo(cropType);
        if (!cropInfo.success) return cropInfo;

        const stages = cropInfo.data.growthStages;
        for (const stage of stages) {
            const [minDays, maxDays] = stage.days.split('-').map(d => parseInt(d));
            if (daysAfterSowing >= minDays && daysAfterSowing <= maxDays) {
                return {
                    success: true,
                    data: {
                        currentStage: stage.stage,
                        daysInStage: daysAfterSowing - minDays,
                        criticalFactors: stage.criticalFactors,
                        daysAfterSowing
                    }
                };
            }
        }

        return {
            success: false,
            error: 'Growth stage could not be determined'
        };
    }

    /**
     * Check if conditions are optimal for the crop
     */
    checkOptimalConditions(cropType, currentConditions) {
        const cropInfo = this.getCropInfo(cropType);
        if (!cropInfo.success) return cropInfo;

        const optimal = cropInfo.data.optimalConditions;
        const deviations = [];
        let overallScore = 100;

        // Check temperature
        if (currentConditions.temperature) {
            const temp = currentConditions.temperature;
            if (temp < optimal.temperature.min || temp > optimal.temperature.max) {
                const deviation = Math.min(
                    Math.abs(temp - optimal.temperature.min),
                    Math.abs(temp - optimal.temperature.max)
                );
                deviations.push({
                    factor: 'temperature',
                    current: temp,
                    optimal: optimal.temperature.optimal,
                    range: `${optimal.temperature.min}-${optimal.temperature.max}°C`,
                    severity: deviation > 5 ? 'high' : 'moderate'
                });
                overallScore -= deviation > 5 ? 20 : 10;
            }
        }

        // Check soil moisture
        if (currentConditions.soilMoisture) {
            const moisture = currentConditions.soilMoisture;
            if (moisture < optimal.soilMoisture.min || moisture > optimal.soilMoisture.max) {
                const deviation = Math.min(
                    Math.abs(moisture - optimal.soilMoisture.min),
                    Math.abs(moisture - optimal.soilMoisture.max)
                );
                deviations.push({
                    factor: 'soilMoisture',
                    current: moisture,
                    optimal: optimal.soilMoisture.optimal,
                    range: `${optimal.soilMoisture.min}-${optimal.soilMoisture.max}%`,
                    severity: deviation > 15 ? 'high' : 'moderate'
                });
                overallScore -= deviation > 15 ? 25 : 15;
            }
        }

        // Check humidity
        if (currentConditions.humidity) {
            const humidity = currentConditions.humidity;
            if (humidity < optimal.humidity.min || humidity > optimal.humidity.max) {
                const deviation = Math.min(
                    Math.abs(humidity - optimal.humidity.min),
                    Math.abs(humidity - optimal.humidity.max)
                );
                deviations.push({
                    factor: 'humidity',
                    current: humidity,
                    optimal: optimal.humidity.optimal,
                    range: `${optimal.humidity.min}-${optimal.humidity.max}%`,
                    severity: deviation > 20 ? 'high' : 'moderate'
                });
                overallScore -= deviation > 20 ? 15 : 8;
            }
        }

        return {
            success: true,
            data: {
                overallScore: Math.max(0, overallScore),
                status: overallScore > 80 ? 'optimal' : overallScore > 60 ? 'acceptable' : 'suboptimal',
                deviations,
                recommendations: this.generateRecommendations(deviations, cropType)
            }
        };
    }

    /**
     * Predict disease risk based on conditions
     */
    predictDiseaseRisk(cropType, weatherConditions, growthStage) {
        const cropInfo = this.getCropInfo(cropType);
        if (!cropInfo.success) return cropInfo;

        const cropDiseases = cropInfo.data.commonDiseases;
        const risks = [];

        for (const diseaseKey of cropDiseases) {
            const disease = this.diseaseDatabase[diseaseKey];
            if (!disease) continue;

            const favorable = disease.favorableConditions;
            let riskScore = 0;
            const factors = [];

            // Check temperature
            if (weatherConditions.temperature >= favorable.temperature.min &&
                weatherConditions.temperature <= favorable.temperature.max) {
                riskScore += 35;
                factors.push('favorable temperature');
            }

            // Check humidity
            if (weatherConditions.humidity >= favorable.humidity.min &&
                weatherConditions.humidity <= favorable.humidity.max) {
                riskScore += 35;
                factors.push('high humidity');
            }

            // Check leaf wetness (if available)
            if (favorable.leafWetness && weatherConditions.rainfall > 0) {
                riskScore += 30;
                factors.push('leaf wetness from rain');
            }

            if (riskScore > 50) {
                risks.push({
                    disease: disease.name,
                    riskLevel: riskScore > 80 ? 'very_high' : riskScore > 60 ? 'high' : 'moderate',
                    riskScore,
                    factors,
                    symptoms: disease.symptoms,
                    controlMeasures: disease.controlMeasures,
                    severity: disease.severity
                });
            }
        }

        return {
            success: true,
            data: {
                overallRisk: risks.length > 0 ? 'detected' : 'low',
                riskCount: risks.length,
                risks,
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Generate actionable recommendations
     */
    generateRecommendations(deviations, cropType) {
        const recommendations = [];

        for (const deviation of deviations) {
            switch (deviation.factor) {
                case 'temperature':
                    if (deviation.current > deviation.optimal) {
                        recommendations.push({
                            action: 'Increase irrigation frequency to cool soil',
                            priority: deviation.severity === 'high' ? 'urgent' : 'moderate',
                            timing: 'immediate'
                        });
                    } else {
                        recommendations.push({
                            action: 'Delay irrigation to avoid cold stress',
                            priority: 'moderate',
                            timing: 'next_24_hours'
                        });
                    }
                    break;

                case 'soilMoisture':
                    if (deviation.current < deviation.optimal) {
                        recommendations.push({
                            action: `Irrigate immediately. Target: ${deviation.optimal}% moisture`,
                            priority: deviation.severity === 'high' ? 'urgent' : 'high',
                            timing: 'immediate'
                        });
                    } else {
                        recommendations.push({
                            action: 'Stop irrigation. Risk of waterlogging',
                            priority: 'urgent',
                            timing: 'immediate'
                        });
                    }
                    break;

                case 'humidity':
                    if (deviation.current > deviation.optimal) {
                        recommendations.push({
                            action: 'Monitor for fungal diseases. Consider preventive fungicide',
                            priority: 'moderate',
                            timing: 'next_48_hours'
                        });
                    }
                    break;
            }
        }

        return recommendations;
    }

    /**
     * Get fertilizer recommendation for current stage
     */
    getFertilizerRecommendation(cropType, growthStage, areaHectares = 1) {
        const cropInfo = this.getCropInfo(cropType);
        if (!cropInfo.success) return cropInfo;

        const schedule = cropInfo.data.fertilizerSchedule;
        const stageName = growthStage.toLowerCase().replace(/_/g, '');

        let recommendation = null;
        for (const [stage, nutrients] of Object.entries(schedule)) {
            if (stageName.includes(stage)) {
                recommendation = {
                    stage,
                    nutrients,
                    quantityPerHectare: nutrients,
                    totalQuantity: {
                        N: nutrients.N * areaHectares,
                        P: nutrients.P * areaHectares,
                        K: nutrients.K * areaHectares
                    },
                    unit: 'kg/hectare'
                };
                break;
            }
        }

        return {
            success: true,
            data: recommendation || { message: 'No fertilizer needed at this stage' }
        };
    }
}

// Export singleton instance
const cropOntologyEngine = new CropOntologyEngine();
module.exports = cropOntologyEngine;
