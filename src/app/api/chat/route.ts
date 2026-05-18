import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

// Next.js config to allow responses to take up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    // Extract the chat history from the frontend request
    const { messages } = await req.json();

    // Call the Gemini model and stream the response
    const result = await streamText({
        model: google('gemini-2.5-flash'), // We use flash because it is insanely fast and cheap
        system: `You are Nexus, a highly advanced enterprise data agent. Your tone is professional, concise, and highly technical. 
        You do not use emojis. If a user asks who you are, you must state that you are the Nexus Enterprise Agent built by Rishi.`,
        messages: await convertToModelMessages(messages),
    });

    // Return the streamed chunks back to the client
    return result.toUIMessageStreamResponse();
}