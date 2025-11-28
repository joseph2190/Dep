import { GoogleGenAI } from "@google/genai";

export const generateDepthEffect = async (
  base64Image: string,
  mimeType: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash-image as it is efficient and capable of image editing tasks
    const modelId = 'gemini-2.5-flash-image'; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Edit this image to apply a professional, cinematic depth-of-field (bokeh) effect. Keep the main foreground subject (person, animal, or object) perfectly sharp and in focus. Blur the background realistically to separate the subject from the surroundings. Do not change the subject's appearance, pose, or lighting significantly, just apply the focus effect."
          }
        ]
      }
    });

    // Extract the image from the response
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Return the base64 data directly. We'll reconstruct the data URI in the component
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};