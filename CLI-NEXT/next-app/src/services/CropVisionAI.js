import aiService from "./aiService";

/**
 * CropVisionAI Service
 * Optional visual analysis for crop health supporting signals
 */
class CropVisionAI {
    async analyzePlantPhoto(base64Image) {
        if (!base64Image) return null;

        const prompt = `
Analyze this crop image strictly based on visual evidence. Ignore all geographic or environmental context. 
Your goal is to provide the 'Visual Truth' of the plant health.

Return a JSON object with:
{
  "detectedIssues": ["list of visible anomalies/diseases"],
  "symptoms": ["e.g., yellowing at tips", "circular brown spots"],
  "visualDiagnosis": "Purely visual conclusion (e.g., Nitrogen deficiency signals)",
  "confidence": 0.0-1.0,
  "image_quality": "excellent | good | fair | poor",
  "is_valid_crop": true | false,
  "observedStage": "Visible growth stage based on image"
}
Only return JSON.
RULE: If the image is not a plant or crop, set is_valid_crop: false and confidence: 0.0.
`;

        try {
            const result = await aiService.generateWithImage(prompt, base64Image);
            const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            console.log(`[CropVisionAI] Analysis completed using: ${result.provider}`);
            return parsed;
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

const cropVisionAI = new CropVisionAI();
export default cropVisionAI;

