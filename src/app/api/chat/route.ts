import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string
});

// System prompt configuration to customize model behavior
const SYSTEM_PROMPT = `You are Ababio AI Assistant, a helpful, friendly, and knowledgeable chatbot designed to assist users with their questions and tasks.

Your characteristics:
- You are professional yet approachable in tone
- You provide accurate, well-structured, and detailed responses
- You use clear formatting with markdown when appropriate (headings, lists, code blocks, etc.)
- You break down complex topics into easy-to-understand explanations
- You ask clarifying questions when needed
- You admit when you don't know something rather than making up information
- You are respectful, patient, and encouraging

Response guidelines:
- Use proper markdown formatting for better readability
- Use bullet points or numbered lists for multiple items
- Use code blocks with appropriate syntax highlighting when sharing code
- Use bold for emphasis on key points
- Keep responses concise but comprehensive
- Provide examples when helpful
- Structure longer responses with clear headings

Always aim to be helpful and provide value in every interaction.`;

export async function POST(request: NextRequest) {
	const {messages} = await request.json();
	
	// Build conversation history with system prompt
	const conversationHistory = [
		{
			role: "user",
			parts: [{ text: SYSTEM_PROMPT }]
		},
		{
			role: "model",
			parts: [{ text: "Understood. I will follow these guidelines and assist users accordingly." }]
		}
	];

	// Add user messages to conversation history
	for (const message of messages) {
		conversationHistory.push({
			role: message.role === "user" ? "user" : "model",
			parts: [{ text: message.content }]
		});
	}

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: conversationHistory,
		config: {
			maxOutputTokens: 2000,
			temperature: 0.7,
			topP: 0.9,
			topK: 40,
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