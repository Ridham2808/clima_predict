const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * CropVisionAI Service
 * Optional visual analysis for crop health supporting signals
 */
class CropVisionAI {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    /**
     * Analyze crop image for health signals
     * @param {string} base64Image - Base64 encoded image data
     * @returns {Object} Vision analysis results
     */
    async analyzePlantPhoto(base64Image) {
        if (!base64Image) return null;

        const prompt = `
Analyze this crop image and identify health signals. 
Return a JSON object with:
{
  "detectedIssues": ["list of visible issues"],
  "symptoms": ["e.g., yellowing", "leaf spots"],
  "healthScore": 0-100,
  "confidence": 0-100,
  "visualObservations": "Short description"
}
Only return JSON.
`;

        try {
            const result = await this.model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image.split(',')[1] || base64Image,
                        mimeType: "image/jpeg"
                    }
                }
            ]);

            const responseText = result.response.text().trim();
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error('CropVisionAI Error:', error);
            // Return safe fallback for optional module
            return {
                detectedIssues: [],
                symptoms: [],
                healthScore: 50,
                confidence: 0,
                visualObservations: "Failed to analyze image"
            };
        }
    }
}

module.exports = new CropVisionAI();
