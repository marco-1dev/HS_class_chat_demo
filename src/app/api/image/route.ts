import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // Extract image data from response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;

        return new Response(JSON.stringify({
          success: true,
          imageData: imageData,
          mimeType: part.inlineData.mimeType || 'image/png'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    // If no image was generated
    return new Response(JSON.stringify({
      success: false,
      error: 'No image was generated'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
