import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string
});

export async function POST(request: NextRequest) {
	const {messages} = await request.json();
	const prompt = messages[messages.length - 1].content;

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: prompt,
		config: {
			stopSequences: ["red"],
			maxOutputTokens: 2000,
			temperature: 0.7,
			topP: 0.6,
			topK: 16,
		}
	});

	const responseText = response.text;

	return new Response(responseText, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}