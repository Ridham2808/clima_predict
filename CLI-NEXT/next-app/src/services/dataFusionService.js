// Data Fusion Service - Merges Weather, Satellite, and IoT sensor data
// This is the CORE intelligence layer that powers all precision agriculture features

const weatherService = require('./weatherService');

/**
 * Data Fusion Service
 * Combines heterogeneous data sources into unified field intelligence
 * - Weather API (OpenWeatherMap)
 * - Satellite data (NDVI/EVI from Sentinel Hub - to be integrated)
 * - IoT sensors (soil moisture, temperature, humidity)
 * - Generates confidence scores for data quality
 */

class DataFusionService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    }

    /**
     * Fuse all data sources for a specific field zone
     * @param {Object} params - { lat, lon, zoneId, sensorData }
     * @returns {Object} Fused intelligence with confidence score
     */
    async fuseZoneData(params) {
        const { lat, lon, zoneId, sensorData = {} } = params;
        const cacheKey = `${lat}_${lon}_${zoneId}`;

        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Parallel data fetching for speed
            const [weatherData, satelliteData] = await Promise.all([
                this.fetchWeatherData({ lat, lon }),
                this.fetchSatelliteData({ lat, lon, zoneId }) // Placeholder for now
            ]);

            // Fuse the data
            const fusedData = {
                zoneId,
                timestamp: new Date().toISOString(),
                weather: weatherData,
                satellite: satelliteData,
                sensors: sensorData,

                // Computed intelligence
                intelligence: {
                    temperatureStress: this.calculateTemperatureStress(weatherData, sensorData),
                    moistureStatus: this.calculateMoistureStatus(sensorData, weatherData),
                    cropHealthIndex: this.calculateCropHealthIndex(satelliteData, sensorData),
                    weatherRisk: this.calculateWeatherRisk(weatherData),
                },

                // Data quality metrics
                confidence: this.calculateConfidence({
                    weatherData,
                    satelliteData,
                    sensorData
                }),

                // Missing data flags
                missingData: this.identifyMissingData({
                    weatherData,
                    satelliteData,
                    sensorData
                })
            };

            // Cache the result
            this.setCache(cacheKey, fusedData);

            return {
                success: true,
                data: fusedData
            };

        } catch (error) {
            console.error('Data fusion error:', error);
            return {
                success: false,
                error: error.message,
                data: this.getFallbackData(params)
            };
        }
    }

    /**
     * Fetch weather data from weather service
     */
    async fetchWeatherData({ lat, lon }) {
        try {
            const result = await weatherService.getCurrentWeather({ lat, lon });
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Weather fetch error:', error);
            return null;
        }
    }

    /**
     * Fetch satellite data (NDVI/EVI)
     * TODO: Integrate with Sentinel Hub API
     */
    async fetchSatelliteData({ lat, lon, zoneId }) {
        // Placeholder - will integrate Sentinel Hub API
        // For now, return simulated NDVI data
        return {
            ndvi: 0.65 + Math.random() * 0.2, // 0.65-0.85 (healthy vegetation)
            evi: 0.55 + Math.random() * 0.15,
            lastUpdate: new Date().toISOString(),
            cloudCover: Math.random() * 30, // % cloud cover
            dataQuality: 'good', // good/fair/poor
            source: 'simulated' // Will be 'sentinel-hub' after integration
        };
    }

    /**
     * Calculate temperature stress index
     * High temp + low humidity = high stress
     */
    calculateTemperatureStress(weather, sensors) {
        if (!weather) return { level: 'unknown', score: 0 };

        const temp = weather.temperature || sensors.temperature || 25;
        const humidity = weather.humidity || sensors.humidity || 60;

        // Stress increases with high temp and low humidity
        let stressScore = 0;

        if (temp > 35) stressScore += 40;
        else if (temp > 30) stressScore += 20;
        else if (temp > 25) stressScore += 10;

        if (humidity < 30) stressScore += 30;
        else if (humidity < 50) stressScore += 15;

        const level = stressScore > 50 ? 'high' : stressScore > 25 ? 'moderate' : 'low';

        return {
            level,
            score: stressScore,
            temperature: temp,
            humidity,
            recommendation: this.getStressRecommendation(level)
        };
    }

    /**
     * Calculate moisture status
     */
    calculateMoistureStatus(sensors, weather) {
        const soilMoisture = sensors.soilMoisture || sensors.moisture || null;
        const rainfall = weather?.precipitation || 0;

        if (soilMoisture === null) {
            return {
                status: 'unknown',
                value: null,
                recommendation: 'Install soil moisture sensors for accurate monitoring'
            };
        }

        let status = 'optimal';
        let recommendation = 'Soil moisture is in optimal range';

        if (soilMoisture < 20) {
            status = 'low';
            recommendation = 'Irrigation needed soon. Soil moisture below optimal.';
        } else if (soilMoisture < 30) {
            status = 'moderate';
            recommendation = 'Monitor closely. Consider irrigation if no rain forecast.';
        } else if (soilMoisture > 80) {
            status = 'high';
            recommendation = 'Avoid irrigation. Risk of waterlogging.';
        }

        return {
            status,
            value: soilMoisture,
            unit: '%',
            rainfall,
            recommendation
        };
    }

    /**
     * Calculate crop health index from satellite + sensors
     */
    calculateCropHealthIndex(satellite, sensors) {
        if (!satellite || satellite.source === 'simulated') {
            return {
                index: null,
                confidence: 'low',
                note: 'Satellite data not available. Using sensor data only.'
            };
        }

        // NDVI-based health (0.6-0.9 is healthy)
        const ndvi = satellite.ndvi || 0;
        let healthScore = 0;

        if (ndvi > 0.8) healthScore = 90 + Math.random() * 10;
        else if (ndvi > 0.7) healthScore = 75 + Math.random() * 15;
        else if (ndvi > 0.6) healthScore = 60 + Math.random() * 15;
        else if (ndvi > 0.4) healthScore = 40 + Math.random() * 20;
        else healthScore = 20 + Math.random() * 20;

        return {
            index: Math.round(healthScore),
            ndvi: satellite.ndvi,
            evi: satellite.evi,
            confidence: satellite.dataQuality,
            lastUpdate: satellite.lastUpdate
        };
    }

    /**
     * Calculate weather risk score
     */
    calculateWeatherRisk(weather) {
        if (!weather) return { level: 'unknown', score: 0 };

        let riskScore = 0;
        const risks = [];

        // High wind risk
        if (weather.windSpeed > 40) {
            riskScore += 30;
            risks.push('High wind - avoid spraying');
        } else if (weather.windSpeed > 25) {
            riskScore += 15;
            risks.push('Moderate wind - spray with caution');
        }

        // Temperature extremes
        if (weather.temperature > 38) {
            riskScore += 25;
            risks.push('Extreme heat - crop stress risk');
        } else if (weather.temperature < 10) {
            riskScore += 20;
            risks.push('Cold stress risk');
        }

        // Humidity extremes
        if (weather.humidity > 85) {
            riskScore += 20;
            risks.push('High humidity - fungal disease risk');
        }

        const level = riskScore > 50 ? 'high' : riskScore > 25 ? 'moderate' : 'low';

        return {
            level,
            score: riskScore,
            risks,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Calculate overall confidence score (0-100%)
     */
    calculateConfidence({ weatherData, satelliteData, sensorData }) {
        let confidence = 0;
        let factors = 0;

        // Weather data contribution (30%)
        if (weatherData && !weatherData.isFallback) {
            confidence += 30;
            factors++;
        } else if (weatherData) {
            confidence += 15; // Fallback data has lower confidence
            factors++;
        }

        // Satellite data contribution (40%)
        if (satelliteData && satelliteData.source !== 'simulated') {
            if (satelliteData.dataQuality === 'good') confidence += 40;
            else if (satelliteData.dataQuality === 'fair') confidence += 25;
            else confidence += 10;
            factors++;
        }

        // Sensor data contribution (30%)
        if (sensorData && Object.keys(sensorData).length > 0) {
            const sensorCount = Object.keys(sensorData).length;
            confidence += Math.min(30, sensorCount * 10); // Max 30%
            factors++;
        }

        return {
            score: Math.round(confidence),
            level: confidence > 75 ? 'high' : confidence > 50 ? 'moderate' : 'low',
            factors: {
                weather: weatherData ? (weatherData.isFallback ? 'fallback' : 'live') : 'missing',
                satellite: satelliteData ? satelliteData.source : 'missing',
                sensors: sensorData && Object.keys(sensorData).length > 0 ? 'available' : 'missing'
            }
        };
    }

    /**
     * Identify missing data sources
     */
    identifyMissingData({ weatherData, satelliteData, sensorData }) {
        const missing = [];

        if (!weatherData || weatherData.isFallback) {
            missing.push('real-time weather data');
        }

        if (!satelliteData || satelliteData.source === 'simulated') {
            missing.push('satellite imagery (NDVI/EVI)');
        }

        if (!sensorData || Object.keys(sensorData).length === 0) {
            missing.push('IoT sensor data');
        }

        return missing;
    }

    /**
     * Get stress recommendation
     */
    getStressRecommendation(level) {
        const recommendations = {
            high: 'Increase irrigation frequency. Consider shade nets. Avoid midday field work.',
            moderate: 'Monitor closely. Ensure adequate soil moisture.',
            low: 'Conditions are favorable. Maintain regular schedule.'
        };
        return recommendations[level] || 'Monitor conditions';
    }

    /**
     * Fallback data when fusion fails
     */
    getFallbackData(params) {
        return {
            zoneId: params.zoneId,
            timestamp: new Date().toISOString(),
            weather: null,
            satellite: null,
            sensors: params.sensorData || {},
            intelligence: {
                temperatureStress: { level: 'unknown', score: 0 },
                moistureStatus: { status: 'unknown', value: null },
                cropHealthIndex: { index: null, confidence: 'low' },
                weatherRisk: { level: 'unknown', score: 0 }
            },
            confidence: { score: 0, level: 'none' },
            missingData: ['weather', 'satellite', 'sensors'],
            isFallback: true
        };
    }

    /**
     * Cache management
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        if (age > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Export singleton instance
const dataFusionService = new DataFusionService();
module.exports = dataFusionService;
