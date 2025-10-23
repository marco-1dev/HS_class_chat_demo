import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 2000,
    temperature: 0.7,
    topP: 0.6,
    topK: 16,
  };
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig});

export async function POST(request: NextRequest) {
	const {messages} = await request.json();
	const prompt = messages[messages.length - 1].content;
	
  const result = await model.generateContent(prompt);
	const responseText = result.response.text();
	
	return new Response(responseText, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}