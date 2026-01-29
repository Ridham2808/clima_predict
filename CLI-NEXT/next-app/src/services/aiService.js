import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Centralized AI Service with Automatic Fallback & Key Rotation
 * Primary: Google Gemini (Key 1 -> Key 2)
 * Fallback: OpenAI GPT-4
 */
class AIService {
    constructor() {
        this.geminiKeys = [
            (process.env.GEMINI_API_KEY || "").trim(),
            (process.env.GEMINI_API_KEY_2 || "").trim()
        ].filter(k => k); // Only keep valid keys

        this.currentGeminiIndex = 0;
        this.openaiKey = (process.env.OPENAI_API_KEY || "").trim();
        this.lastUsedProvider = null;
    }

    /**
     * Check if error is a rate limit error
     */
    isRateLimitError(error) {
        const errorStr = error?.message?.toLowerCase() || error?.toString()?.toLowerCase() || '';
        return (
            errorStr.includes('429') ||
            errorStr.includes('rate limit') ||
            errorStr.includes('quota') ||
            errorStr.includes('resource exhausted') ||
            error?.status === 429
        );
    }

    /**
     * Get next Gemini key using round-robin or on-demand rotation
     */
    getNextGeminiKey() {
        this.currentGeminiIndex = (this.currentGeminiIndex + 1) % this.geminiKeys.length;
        return this.geminiKeys[this.currentGeminiIndex];
    }

    /**
     * Initialize Gemini client with a specific key
     */
    getGeminiClient(keyIndex) {
        const key = this.geminiKeys[keyIndex];
        return new GoogleGenerativeAI(key);
    }

    /**
     * Generate text using AI with automatic fallback & rotation
     * @param {string} prompt - The prompt to send
     * @param {object} options - Additional options (model, temperature, etc.)
     * @returns {Promise<{text: string, provider: string}>}
     */
    async generateText(prompt, options = {}) {
        const { model = "gemini-2.5-flash", temperature = 0.7 } = options;

        // Try Gemini Keys
        for (let i = 0; i < this.geminiKeys.length; i++) {
            // Use current key based on rotation
            const keyIndex = (this.currentGeminiIndex + i) % this.geminiKeys.length;
            const currentKey = this.geminiKeys[keyIndex];

            // Skip if key is empty
            if (!currentKey) continue;

            try {
                // If it's a retry with a different key, log it
                if (i > 0) console.log(`[AIService] 🔄 Rotating to Gemini Key #${keyIndex + 1}...`);
                else console.log(`[AIService] Attempting with Gemini Key #${keyIndex + 1}...`);

                const genAI = new GoogleGenerativeAI(currentKey);
                const geminiModel = genAI.getGenerativeModel({ model });

                const result = await geminiModel.generateContent(prompt);
                const text = result.response.text();

                this.lastUsedProvider = `gemini-key-${keyIndex + 1}`;
                console.log(`[AIService] ✅ Success with Gemini Key #${keyIndex + 1}`);

                // Update rotation index to distribute load
                this.currentGeminiIndex = (keyIndex + 1) % this.geminiKeys.length;

                return { text, provider: 'gemini' };

            } catch (error) {
                console.error(`[AIService] Gemini Key #${keyIndex + 1} error:`, error.message);

                if (this.isRateLimitError(error)) {
                    // Try next key
                    continue;
                } else {
                    // Non-rate limit errors might be fatal, but let's try next key just in case
                    console.warn(`[AIService] Non-rate limit error, but trying next key...`);
                    continue;
                }
            }
        }

        // Fallback to OpenAI
        if (this.openaiKey) {
            try {
                console.log('[AIService] ⚠️ All Gemini keys exhausted. Falling back to OpenAI...');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.openaiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        temperature
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();
                const text = data.choices[0]?.message?.content || '';

                this.lastUsedProvider = 'openai';
                console.log('[AIService] ✅ Success with OpenAI (fallback)');
                return { text, provider: 'openai' };
            } catch (error) {
                console.error('[AIService] OpenAI error:', error.message);
                throw new Error(`All AI providers failed. Last error: ${error.message}`);
            }
        }

        throw new Error('All Gemini keys failed and no OpenAI key configured.');
    }

    /**
     * Generate content with image/vision analysis
     * @param {string} prompt - The prompt to send
     * @param {string} base64Image - Base64 encoded image
     * @param {object} options - Additional options
     * @returns {Promise<{text: string, provider: string}>}
     */
    async generateWithImage(prompt, base64Image, options = {}) {
        const { model = "gemini-2.5-flash", temperature = 0.7 } = options;

        // Clean base64 image (remove data:image/... prefix if present)
        const cleanBase64 = base64Image.includes(',')
            ? base64Image.split(',')[1]
            : base64Image;

        // Try Gemini Keys
        for (let i = 0; i < this.geminiKeys.length; i++) {
            const keyIndex = (this.currentGeminiIndex + i) % this.geminiKeys.length;
            const currentKey = this.geminiKeys[keyIndex];

            // Skip if key is empty
            if (!currentKey) continue;

            try {
                if (i > 0) console.log(`[AIService] 🔄 Rotating to Gemini Vision Key #${keyIndex + 1}...`);
                else console.log(`[AIService] Attempting vision with Gemini Key #${keyIndex + 1}...`);

                const genAI = new GoogleGenerativeAI(currentKey);
                const geminiModel = genAI.getGenerativeModel({ model });

                const result = await geminiModel.generateContent([
                    prompt,
                    { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }
                ]);

                const text = result.response.text();
                this.lastUsedProvider = `gemini-key-${keyIndex + 1}`;
                console.log(`[AIService] ✅ Vision success with Gemini Key #${keyIndex + 1}`);

                // Update rotation index
                this.currentGeminiIndex = (keyIndex + 1) % this.geminiKeys.length;

                return { text, provider: 'gemini' };

            } catch (error) {
                console.error(`[AIService] Gemini Vision Key #${keyIndex + 1} error:`, error.message);
                if (this.isRateLimitError(error)) continue;
                else continue;
            }
        }

        // Fallback to OpenAI Vision
        if (this.openaiKey) {
            try {
                console.log('[AIService] ⚠️ All Gemini keys exhausted. Falling back to OpenAI Vision...');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.openaiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    { type: 'text', text: prompt },
                                    { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${cleanBase64}` } }
                                ]
                            }
                        ],
                        temperature
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`OpenAI Vision error: ${response.status} - ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();
                const text = data.choices[0]?.message?.content || '';

                this.lastUsedProvider = 'openai';
                console.log('[AIService] ✅ Vision success with OpenAI (fallback)');
                return { text, provider: 'openai' };
            } catch (error) {
                console.error('[AIService] OpenAI vision error:', error.message);
                throw new Error(`All AI vision providers failed. Last error: ${error.message}`);
            }
        }

        throw new Error('All Gemini keys failed and no OpenAI vision configured.');
    }

    /**
     * Get the last used provider
     */
    getLastProvider() {
        return this.lastUsedProvider;
    }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;
