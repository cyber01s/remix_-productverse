import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface EnrichedData {
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  expertReview: string;
  scores: {
    performance: number;
    value: number;
    design: number;
    overall: number;
  };
}

export const enrichProductData = async (productName: string, description: string): Promise<EnrichedData> => {
  try {
    const prompt = `ENCODE DETAILED TECHNICAL METADATA FOR: "${productName}"
    RAW DATA: "${description}"
    
    CRITICAL INSTRUCTION:
    1. Your analysis MUST be strictly tethered to the actual product metadata provided. 
    2. If the raw data is sparse, do NOT hallucinate fictional features. Instead, derive technical implications based on the product category and name (e.g., if it's a "Razer Mouse", prioritize DPI, weight, and sensor type based on known Razer tech standards if details are missing, but explicitly state if data is an estimate).
    3. If you cannot find relevant technical data, stick to the provided description and indicate 'Standard Specification'. No deception.
    4. Format the review as a professional lead editor in a tech/lifestyle journal. 2-3 concise paragraphs.
    5. Overall score must be an integer between 60-98, reflecting the product's actual competitiveness in the market.
    
    Return ONLY JSON.`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            specs: {
              type: Type.OBJECT,
              properties: {
                "Material": { type: Type.STRING },
                "Dimensions": { type: Type.STRING },
                "Weight": { type: Type.STRING },
                "Compatibility": { type: Type.STRING },
                "BatteryLife": { type: Type.STRING },
                "Interface": { type: Type.STRING },
                "Warranty": { type: Type.STRING },
              }
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            expertReview: {
              type: Type.STRING,
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                performance: { type: Type.NUMBER },
                value: { type: Type.NUMBER },
                design: { type: Type.NUMBER },
                overall: { type: Type.NUMBER }
              }
            }
          },
          required: ["specs", "pros", "cons", "expertReview", "scores"]
        }
      }
    });

    const text = result.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Enrichment failed:", error);
    return {
      specs: { "Name": productName, "Category": "Tech" },
      pros: ["High quality build", "Official warranty"],
      cons: ["May require setup"],
      expertReview: description || "A solid choice in its category, offering a balance of features and performance that suits most professional users.",
      scores: { performance: 85, value: 80, design: 90, overall: 85 }
    };
  }
};
