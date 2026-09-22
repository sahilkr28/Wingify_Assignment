import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export type DreamClassification = 'Good' | 'Bad';

export class GeminiDreamClassifier {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured.');
        }

        this.ai = new GoogleGenAI({
            apiKey,
        });
    }

    async classifyDreams(
        dreamNames: string[]
    ): Promise<Record<string, DreamClassification>> {
        const prompt = `
Classify each dream below as exactly one of:
Good
Bad

Return ONLY a valid JSON object where:
- each key is the exact dream name
- each value is either "Good" or "Bad"
- do not include markdown or explanations

Dreams:
${dreamNames.map((dream, index) => `${index + 1}. ${dream}`).join('\n')}
`;

        let response;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await this.ai.models.generateContent({
                    model: 'gemini-3.6-flash',
                    contents: prompt,
                });

                break;
            } catch (error: any) {
                const status = error?.status;

                if (status !== 503 || attempt === 3) {
                    throw error;
                }

                console.log(
                    `Gemini temporarily unavailable. Retrying (${attempt}/3)...`
                );

                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (!response) {
            throw new Error('Gemini did not return a response.');
        }

        const result = response.text?.trim();

        if (!result) {
            throw new Error('Gemini returned an empty response.');
        }

        let classifications: Record<string, DreamClassification>;

        try {
            classifications = JSON.parse(result);
        } catch {
            throw new Error(
                `Gemini returned invalid JSON: ${result}`
            );
        }

        for (const dreamName of dreamNames) {
            const classification = classifications[dreamName];

            if (classification !== 'Good' && classification !== 'Bad') {
                throw new Error(
                    `Invalid classification for "${dreamName}": ${classification}`
                );
            }
        }

        return classifications;
    }
}