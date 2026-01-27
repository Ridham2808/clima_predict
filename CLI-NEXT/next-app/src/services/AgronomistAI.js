const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * AgronomistAI Service
 * Expert precision agriculture decision support system
 */
class AgronomistAI {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    /**
     * Get expert agronomist recommendations based on real-time data
     */
    async getExpertAdvice(params) {
        const {
            cropType,
            growthStage,
            location,
            soilData,
            weather,
            pestsRisk,
            history = [],
            constraints = {}
        } = params;

        const prompt = `
You are an Expert Precision Agriculture AI Agronomist designed for real-world farming decisions.
Your output must be accurate, dynamic, actionable, and crop-specific.

INPUT DATA:
- Crop: ${cropType} (${params.variety || 'standard variety'})
- Growth Stage: ${growthStage}
- Location: Lat ${location?.lat}, Lon ${location?.lon}
- Soil Data: ${JSON.stringify(soilData)}
- Weather (7-14 day forecast): ${JSON.stringify(weather)}
- Pest & Disease Risk: ${JSON.stringify(pestsRisk)}
- Farmer History (Previous actions): ${JSON.stringify(history)}
- Constraints: ${JSON.stringify(constraints)}

MANDATORY OUTPUT FORMAT (JSON ONLY):
{
  "healthDiagnosis": {
    "currentScore": 0-100,
    "keyStressFactors": ["soil", "weather", "pest", "nutrition"],
    "rootCauseAnalysis": "Deep technical explanation of the primary issue"
  },
  "actionableInsights": [
    {
      "action": "Specific technical action",
      "reason": "Why it helps",
      "dose": "Precise quantity (e.g., kg/acre)",
      "time": "Specific timing (e.g., Early morning)",
      "expectedBenefit": "Percentage yield improvement"
    }
  ],
  "inputsAndTools": [
    {
      "productName": "Name",
      "type": "Fertilizer/Pesticide/Tool",
      "activeIngredient": "Chemical/Bio component",
      "pros": "Advantages",
      "cons": "Disadvantages",
      "riskWarning": "Safety info",
      "compatibility": "Mixability info"
    }
  ],
  "buyingGuidance": {
    "bestValue": { "name": "Product", "link": "Direct link", "price": "Approx price" },
    "premiumOption": { "name": "Product", "link": "Direct link", "price": "Approx price" },
    "budgetOption": { "name": "Product", "link": "Direct link", "price": "Approx price" }
  },
  "cropCalendar": {
    "applyNow": ["Action 1", "Action 2"],
    "applyNext": ["Action 3"],
    "avoidNow": ["Action to avoid"],
    "adjustmentLogic": "Weather-based reasoning"
  },
  "impactPrediction": {
    "yieldChange": "+/- %",
    "qualityImprovement": "Size, Color, Shelf life details",
    "riskIfIgnored": "Probability of crop loss"
  },
  "decisionLogic": [
    "Fact-based reasoning step 1",
    "Fact-based reasoning step 2"
  ]
}

RULES:
- No generic advice.
- If confidence < 85%, add a "lowConfidenceWarning" field.
- Use metric units.
- Everything must be live, recalculated, and adaptive.
- Do not add any markdown fluff, only return the JSON object.
`;

        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text().trim();

            // Clean JSON string (in case of markdown blocks)
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error('AgronomistAI Error:', error);
            throw new Error('Failed to generate expert advice');
        }
    }
}

module.exports = new AgronomistAI();
