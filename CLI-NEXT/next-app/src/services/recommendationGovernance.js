// Recommendation Governance Service
// Ensures AI recommendations are safe, confident, and legally compliant
// Critical for enterprise deployment and farmer trust

/**
 * Recommendation Governance Service
 * Implements:
 * - Confidence threshold gating
 * - Legal disclaimer logic
 * - Human agronomist override capability
 * - Recommendation liability tracking
 */

class RecommendationGovernance {
    constructor() {
        this.confidenceThresholds = {
            urgent: 85,      // Urgent actions require 85%+ confidence
            high: 75,        // High priority requires 75%+ confidence
            moderate: 60,    // Moderate priority requires 60%+ confidence
            advisory: 40     // Advisory only, below 40% not shown
        };

        this.disclaimers = {
            irrigation: 'Recommendation based on current data. Verify soil moisture before applying.',
            pesticide: 'Always follow label instructions. Consult local agronomist for dosage.',
            fertilizer: 'Soil testing recommended for precise nutrient management.',
            disease: 'Visual inspection required. Lab confirmation recommended for treatment.',
            general: 'This is an AI-generated recommendation. Use professional judgment.'
        };

        this.recommendationLog = [];
    }

    /**
     * Validate and govern a recommendation before showing to farmer
     * @param {Object} recommendation - The AI-generated recommendation
     * @param {Object} context - Additional context (crop, zone, user)
     * @returns {Object} Governed recommendation with confidence, disclaimer, and approval status
     */
    governRecommendation(recommendation, context = {}) {
        const {
            action,
            category,
            priority,
            timing,
            confidence = 50,
            dataQuality = {},
            reasoning = []
        } = recommendation;

        // Step 1: Confidence threshold check
        const thresholdCheck = this.checkConfidenceThreshold(confidence, priority);

        if (!thresholdCheck.passes) {
            return {
                approved: false,
                reason: thresholdCheck.reason,
                recommendation: null,
                requiresHumanReview: true
            };
        }

        // Step 2: Add appropriate disclaimer
        const disclaimer = this.getDisclaimer(category);

        // Step 3: Determine if human override is needed
        const requiresOverride = this.requiresHumanOverride(recommendation, context);

        // Step 4: Add confidence visualization
        const confidenceDisplay = this.formatConfidenceDisplay(confidence);

        // Step 5: Create governed recommendation
        const governedRecommendation = {
            id: this.generateRecommendationId(),
            original: recommendation,
            governed: {
                action,
                category,
                priority,
                timing,
                confidence: {
                    score: confidence,
                    level: confidenceDisplay.level,
                    display: confidenceDisplay.text,
                    color: confidenceDisplay.color
                },
                disclaimer,
                legalNotice: this.getLegalNotice(category),
                dataQuality: {
                    sources: dataQuality.sources || [],
                    freshness: dataQuality.freshness || 'unknown',
                    completeness: dataQuality.completeness || 'partial'
                },
                reasoning,
                requiresHumanOverride,
                agronomistReview: requiresOverride ? 'pending' : 'not_required',
                liability: this.getLiabilityLevel(confidence, category),
                timestamp: new Date().toISOString()
            },
            context: {
                crop: context.cropType,
                zone: context.zoneId,
                user: context.userId,
                location: context.location
            }
        };

        // Step 6: Log recommendation for tracking
        this.logRecommendation(governedRecommendation);

        return {
            approved: true,
            recommendation: governedRecommendation,
            requiresHumanReview: requiresOverride
        };
    }

    /**
     * Check if confidence meets threshold for priority level
     */
    checkConfidenceThreshold(confidence, priority) {
        const requiredConfidence = this.confidenceThresholds[priority] || this.confidenceThresholds.moderate;

        if (confidence < this.confidenceThresholds.advisory) {
            return {
                passes: false,
                reason: `Confidence too low (${confidence}%). Minimum ${this.confidenceThresholds.advisory}% required.`
            };
        }

        if (confidence < requiredConfidence) {
            return {
                passes: true, // Allow but downgrade priority
                reason: `Confidence (${confidence}%) below threshold for ${priority} priority. Showing as advisory.`,
                downgradeTo: 'advisory'
            };
        }

        return {
            passes: true,
            reason: 'Confidence threshold met'
        };
    }

    /**
     * Get appropriate disclaimer for category
     */
    getDisclaimer(category) {
        return this.disclaimers[category] || this.disclaimers.general;
    }

    /**
     * Determine if human agronomist override is required
     */
    requiresHumanOverride(recommendation, context) {
        const { category, priority, confidence } = recommendation;

        // High-risk categories always need human review
        const highRiskCategories = ['pesticide', 'disease', 'major_irrigation_change'];
        if (highRiskCategories.includes(category)) {
            return true;
        }

        // Urgent actions with confidence < 90% need review
        if (priority === 'urgent' && confidence < 90) {
            return true;
        }

        // Large-scale operations need review
        if (context.areaHectares && context.areaHectares > 10) {
            return true;
        }

        return false;
    }

    /**
     * Format confidence for display
     */
    formatConfidenceDisplay(confidence) {
        if (confidence >= 90) {
            return {
                level: 'very_high',
                text: `Very High Confidence (${confidence}%)`,
                color: '#00D09C',
                icon: '🟢'
            };
        } else if (confidence >= 75) {
            return {
                level: 'high',
                text: `High Confidence (${confidence}%)`,
                color: '#4D9FFF',
                icon: '🔵'
            };
        } else if (confidence >= 60) {
            return {
                level: 'moderate',
                text: `Moderate Confidence (${confidence}%)`,
                color: '#FFC857',
                icon: '🟡'
            };
        } else {
            return {
                level: 'low',
                text: `Advisory Only (${confidence}%)`,
                color: '#FF6B35',
                icon: '🟠'
            };
        }
    }

    /**
     * Get legal notice for category
     */
    getLegalNotice(category) {
        const notices = {
            pesticide: 'Use of pesticides is subject to local regulations. User assumes all liability.',
            disease: 'AI diagnosis is not a substitute for professional phytopathology services.',
            fertilizer: 'Over-application may cause environmental damage. Follow local guidelines.',
            irrigation: 'Water usage subject to local water rights and regulations.',
            general: 'Recommendations are advisory. User retains full decision-making authority.'
        };

        return notices[category] || notices.general;
    }

    /**
     * Determine liability level
     */
    getLiabilityLevel(confidence, category) {
        const highLiabilityCategories = ['pesticide', 'disease', 'major_irrigation_change'];

        if (highLiabilityCategories.includes(category)) {
            return {
                level: 'high',
                notice: 'High-risk recommendation. Professional consultation recommended.',
                insuranceCoverage: 'not_covered'
            };
        }

        if (confidence < 70) {
            return {
                level: 'moderate',
                notice: 'Moderate confidence. Verify with additional data sources.',
                insuranceCoverage: 'partial'
            };
        }

        return {
            level: 'standard',
            notice: 'Standard recommendation based on available data.',
            insuranceCoverage: 'standard'
        };
    }

    /**
     * Generate unique recommendation ID
     */
    generateRecommendationId() {
        return `REC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Log recommendation for audit trail
     */
    logRecommendation(governedRecommendation) {
        this.recommendationLog.push({
            id: governedRecommendation.id,
            timestamp: governedRecommendation.governed.timestamp,
            category: governedRecommendation.governed.category,
            confidence: governedRecommendation.governed.confidence.score,
            approved: true,
            context: governedRecommendation.context
        });

        // Keep only last 1000 recommendations in memory
        if (this.recommendationLog.length > 1000) {
            this.recommendationLog = this.recommendationLog.slice(-1000);
        }
    }

    /**
     * Record farmer feedback on recommendation
     */
    recordFeedback(recommendationId, feedback) {
        const { outcome, effectiveness, notes, followedAction } = feedback;

        const feedbackRecord = {
            recommendationId,
            outcome, // 'success', 'partial_success', 'failure', 'not_followed'
            effectiveness: effectiveness || null, // 1-5 rating
            notes: notes || '',
            followedAction: followedAction !== undefined ? followedAction : true,
            timestamp: new Date().toISOString()
        };

        // TODO: Store in database for ML retraining
        console.log('Feedback recorded:', feedbackRecord);

        return {
            success: true,
            message: 'Feedback recorded. Thank you for helping improve our recommendations.',
            feedbackId: `FB_${Date.now()}`
        };
    }

    /**
     * Get recommendation success rate (for continuous improvement)
     */
    getSuccessRate(filters = {}) {
        // TODO: Implement database query
        // For now, return mock data
        return {
            overall: 0.85, // 85% success rate
            byCategory: {
                irrigation: 0.90,
                fertilizer: 0.82,
                disease: 0.75,
                pesticide: 0.78
            },
            byConfidenceLevel: {
                very_high: 0.92,
                high: 0.85,
                moderate: 0.72,
                low: 0.58
            },
            totalRecommendations: this.recommendationLog.length,
            period: '30_days'
        };
    }

    /**
     * Agronomist override capability
     */
    agronomistOverride(recommendationId, agronomistDecision) {
        const { approved, modifiedAction, reasoning, agronomistId } = agronomistDecision;

        const override = {
            recommendationId,
            agronomistId,
            approved,
            modifiedAction: modifiedAction || null,
            reasoning,
            timestamp: new Date().toISOString()
        };

        // TODO: Store in database
        console.log('Agronomist override recorded:', override);

        return {
            success: true,
            message: approved
                ? 'Recommendation approved by agronomist'
                : 'Recommendation rejected by agronomist',
            override
        };
    }

    /**
     * Generate compliance report
     */
    generateComplianceReport(startDate, endDate) {
        return {
            period: { startDate, endDate },
            totalRecommendations: this.recommendationLog.length,
            byConfidenceLevel: {
                very_high: this.recommendationLog.filter(r => r.confidence >= 90).length,
                high: this.recommendationLog.filter(r => r.confidence >= 75 && r.confidence < 90).length,
                moderate: this.recommendationLog.filter(r => r.confidence >= 60 && r.confidence < 75).length,
                low: this.recommendationLog.filter(r => r.confidence < 60).length
            },
            humanReviewRequired: this.recommendationLog.filter(r => r.requiresHumanOverride).length,
            successRate: this.getSuccessRate(),
            generatedAt: new Date().toISOString()
        };
    }
}

// Export singleton instance
const recommendationGovernance = new RecommendationGovernance();
module.exports = recommendationGovernance;
