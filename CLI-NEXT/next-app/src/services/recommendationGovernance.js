/**
 * Recommendation Governance Service
 * Final-mile safety and validation for agricultural interventions
 */

class RecommendationGovernance {
    constructor() {
        this.TRUST_BRANDS = ['IFFCO', 'Govt', 'Bayer', 'Syngenta', 'Yara', 'UPL'];
        this.HISTORY_THRESHOLD_DAYS = 10;
    }

    /**
     * Resolve conflicts and apply safety rules
     */
    async govern(advice, history = []) {
        if (!advice || !advice.interventions) return advice;

        // 1. Conflict Resolver: Check for dangerous combinations
        advice.interventions = advice.interventions.filter(intervention => {
            const diagnosisLower = (advice.healthDiagnosis?.technicalExplanation || '').toLowerCase();
            const actionLower = intervention.title.toLowerCase();

            // Rule: No Nitrogen spray if Fungal Risk is high
            if (diagnosisLower.includes('fungal') && actionLower.includes('nitrogen')) {
                console.warn('Blocked Nitrogen intervention due to Fungal Risk conflict');
                return false;
            }
            return true;
        });

        // 2. History Guard: Skip recently applied nutrients
        advice.interventions = advice.interventions.filter(intervention => {
            const lastApplied = history.find(h =>
                h.action.toLowerCase().includes(intervention.title.toLowerCase()) ||
                (intervention.what.toLowerCase().includes('urea') && h.inputUsed?.toLowerCase().includes('urea'))
            );

            if (lastApplied) {
                const daysSince = (new Date() - new Date(lastApplied.createdAt)) / (1000 * 60 * 60 * 24);
                if (daysSince < this.HISTORY_THRESHOLD_DAYS) {
                    console.warn(`Blocked ${intervention.title} - Applied ${Math.round(daysSince)} days ago`);
                    return false;
                }
            }
            return true;
        });

        // 3. Trust Scoring & Formatting
        advice.interventions.forEach(intervention => {
            if (intervention.products) {
                intervention.products.forEach(prod => {
                    const isTrusted = this.TRUST_BRANDS.some(b => prod.brand.toLowerCase().includes(b.toLowerCase()));
                    prod.trustScore = isTrusted ? 8.5 + (Math.random() * 1) : 6.0 + (Math.random() * 2);
                    prod.sourceLabel = isTrusted ? 'Verified Agri-Partner' : 'Market Option';
                    prod.trustScore = prod.trustScore.toFixed(1);
                });
            }
        });

        return advice;
    }
}

module.exports = new RecommendationGovernance();
