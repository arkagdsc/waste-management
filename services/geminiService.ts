
import { GoogleGenAI, Type } from "@google/genai";

export type ModelVariant = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface WasteAnalysis {
  category: 'DRY' | 'WET' | 'HAZARDOUS' | 'UNKNOWN';
  confidence: number;
  reasoning: string;
  instruction: string;
}

/**
 * Provides general waste management advice using text models.
 */
export const getWasteAdvice = async (query: string, model: ModelVariant = 'gemini-3-flash-preview') => {
  try {
    // Initialize exactly when needed to use the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `User query: ${query}. 
      Context: India generates 1.7L TPD of waste. 54% is treated. 
      Task: Provide concise, actionable advice for an Indian household on source segregation, home composting, or circular reuse.`,
      config: {
        systemInstruction: "You are a professional Waste Management Consultant for India's Swachh Bharat initiative.",
        thinkingConfig: model === 'gemini-3-pro-preview' ? { thinkingBudget: 4000 } : undefined
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini API Text Error:", error);
    return `I encountered an error: ${error.message || 'Unknown connection issue'}. Please check your API configuration.`;
  }
};

/**
 * Identifies waste category from an image with high precision.
 */
export const identifyWaste = async (base64Image: string, model: ModelVariant = 'gemini-3-flash-preview'): Promise<WasteAnalysis> => {
  try {
    // Access key directly from environment
    const apiKey = process.env.API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        {
          text: "Identify the waste in this image. Is it WET (food/bio), DRY (plastic/paper/metal), or HAZARDOUS (sanitary/medical/e-waste)? Consider common Indian items: milk pouches, biscuit wrappers, coconut shells, vegetable peels, batteries, or sanitary waste."
        }
      ],
      config: {
        systemInstruction: `You are an expert waste classification AI for an Indian Municipal Corporation. 
        Classification Rules (SWM 2016):
        - WET: Fruit/veg peels, food leftovers, tea bags, eggshells, garden waste, stale flowers.
        - DRY: Plastic covers, PET bottles, multi-layered packaging (wrappers), paper, cartons, metal tins, dry rags.
        - HAZARDOUS: Diapers, napkins, used masks/gloves, syringes, batteries, insecticide cans, paint tins.
        
        Analyze visual features like gloss (plastic), texture (organic), or labels. If the item is mixed (e.g., food in plastic), classify as DRY but mention the contamination in reasoning. 
        Always return JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING, 
              enum: ['DRY', 'WET', 'HAZARDOUS', 'UNKNOWN'],
            },
            confidence: { 
              type: Type.NUMBER, 
            },
            reasoning: { 
              type: Type.STRING, 
              description: "Technical observation (e.g., 'Identified high-density polyethylene texture typical of milk pouches')."
            },
            instruction: { 
              type: Type.STRING, 
              description: "1-sentence Indian disposal rule (e.g., 'Rinse, dry, and place in the Blue bin')."
            }
          },
          required: ["category", "confidence", "reasoning", "instruction"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("API returned an empty response. Image might be too large or malformed.");

    const result = JSON.parse(textOutput);
    return {
      category: result.category || 'UNKNOWN',
      confidence: result.confidence || 0,
      reasoning: result.reasoning || 'AI processed the image but could not determine a specific category.',
      instruction: result.instruction || 'Please segregate manually or take a clearer, brighter photo.'
    };
  } catch (error: any) {
    console.error("Vision Analysis Error:", error);
    
    // Extract meaningful error messages
    let errorDetail = error.message || "An unexpected error occurred.";
    if (errorDetail.includes("API_KEY_INVALID") || errorDetail.includes("key is missing")) {
      errorDetail = "API Key not detected or invalid. Please use the 'Configure AI' button.";
    }

    return {
      category: 'UNKNOWN',
      confidence: 0,
      reasoning: `Analysis Failed: ${errorDetail}`,
      instruction: "Ensure your project has a valid Gemini API key and the image is not blurry."
    };
  }
};
