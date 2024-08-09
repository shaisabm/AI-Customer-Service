import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const data = await req.json();
    const userMessage = data.message;
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const controller = new AbortController();
    const signal = controller.signal;

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const result = await model.generateContentStream(userMessage, { signal });
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    controller.enqueue(chunkText);
                }
                controller.close();
            } catch (error) {
                console.error('Error generating content:', error);
                controller.error(error);
            }
        },
    });

    return new Response(stream);
}