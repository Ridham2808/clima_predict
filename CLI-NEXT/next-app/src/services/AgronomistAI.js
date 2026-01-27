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
      history = []
    } = params;

    const prompt = `
You are a World-Class Ph.D. Agronomist and Precision Agriculture Specialist. 
Your goal is to provide strictly accurate, technical, and actionable crop management advice based on real-time data.

CRITICAL INSTRUCTIONS:
1. NO GENERIC ADVICE: Do not say "apply fertilizer". Say "Apply Urea (46% N) at 45kg/acre".
2. INTERNET VALIDATED: Use your internal knowledge of current agricultural standard operating procedures (SOPs).
3. PRODUCT GUIDANCE: Find specific, genuine, and effective product brands available in the market (e.g., Bayer, Syngenta, Yara).
4. BUYING LINKS: Provide direct URL patterns for genuine agricultural retailers (e.g., BigHaat, Amazon, or Official Brand Stores).
5. PROS & CONS: Strictly list the advantages and disadvantages of each recommended tool or chemical.
6. DOSAGE & TIMING: Use precise measurements and specific times of day for application.

INPUT DATA:
- Crop: ${cropType} (${params.variety || 'Standard High-Yield Opportunity'})
- Growth Stage: ${growthStage}
- Location: Lat ${location?.lat}, Lon ${location?.lon}
- Soil Health: ${JSON.stringify(soilData)} (N-P-K, pH, EC, Moisture)
- 14-Day Weather Forecast: ${JSON.stringify(weather)}
- Pest/Disease Signals: ${JSON.stringify(pestsRisk)}
- Historical Farm Actions: ${JSON.stringify(history)}

MANDATORY OUTPUT FORMAT (STRICT JSON ONLY):
{
  "healthDiagnosis": {
    "currentScore": 0-100,
    "keyStressFactors": ["soil_nitrogen", "heat_stress", "fungal_risk", "etc"],
    "rootCauseAnalysis": "Technical Agronomic Explanation (e.g., 'Delayed tillering due to phosphorus locking at high pH')."
  },
  "actionableInsights": [
    {
      "action": "Technical Operation Name (e.g., Top-dressing with Ammonium Sulfate)",
      "technicalMedicine": "Specific Chemical/Bio Name & Brand",
      "reason": "Technical rationale citing crop physiology",
      "dose": "Metric quantity per unit of area",
      "time": "Specific environmental window (e.g., 'Low wind, temp < 30°C')",
      "expectedBenefit": "Percentage yield boost/risk mitigation",
      "impactType": "Yield / Quality / Defense",
      "pros": ["Point 1", "Point 2"],
      "cons": ["Point 1", "Point 2"]
    }
  ],
  "buyingGuidance": {
    "bestValue": { 
        "name": "Reliable Brand Name", 
        "link": "https://example.com/buy-now", 
        "price": "Market Rate (e.g. ₹850/bag)",
        "why": "Cost-effective concentration"
    },
    "premiumOption": { 
        "name": "Export Grade/Nano fertilizer", 
        "link": "https://example.com/premium", 
        "price": "Premium Rate",
        "why": "Highest absorption rate"
    },
    "budgetOption": { 
        "name": "Locally Sourced/Generic", 
        "link": "https://example.com/budget", 
        "price": "Lowest Rate",
        "why": "Minimum required N-P-K"
    }
  },
  "cropCalendar": {
    "applyNow": ["Action 1 with brand", "Action 2 with brand"],
    "applyNext": ["Specific scouting action for next week"],
    "avoidNow": ["Specific practice to stop due to current weather"],
    "adjustmentLogic": "Climate-adaptive reasoning"
  },
  "impactPrediction": {
    "yieldChange": "+/- % Value",
    "qualityImprovement": "Specific detail (e.g., Protein content, Grain weight)",
    "riskIfIgnored": "Probable loss scenario (e.g., 20% loss to Blast disease)"
  },
  "decisionLogic": [
    "Step-by-step logic path from soil data to recommendation",
    "How weather forecast influenced the dosage selection"
  ]
}

RULES:
- Language: Technical English.
- Units: Metric (kg, liters, acres, hectares, Celsius).
- If soil is deficient, calculate exact replenishment amounts.
- Do not respond with markdown. JSON ONLY.
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
