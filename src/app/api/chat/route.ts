import { streamText, tool, stepCountIs, convertToModelMessages, generateId } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: `You are Nexus, a highly advanced enterprise data agent. Your tone is professional, concise, and highly technical. You do not use emojis. If a user asks who you are, you must state that you are the Nexus Enterprise Agent built by Rishi.`,
        messages: await convertToModelMessages(messages),
        stopWhen: stepCountIs(5),

        // The tools object using the now fully-updated tool() wrapper
        tools: {
            getEnterpriseRevenue: tool({
                description: 'Get the company revenue for a specific quarter. Call this whenever the user asks about money, sales, or revenue.',
                inputSchema: z.object({
                    quarter: z.string().describe('The quarter requested, e.g., "Q1", "Q2", "Q3", "Q4"'),
                }),
                execute: async ({ quarter }: { quarter: string }) => {
                    console.log(`\n--- SERVER LOG: Nexus is fetching data for ${quarter}... ---\n`);
                    return {
                        quarter: quarter,
                        revenue: '$4.2 Million',
                        growth: 'Up 14% from previous quarter',
                        topPerformingSector: 'AI Integrations'
                    };
                },
            }),
        },
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        generateMessageId: () => generateId(),
    });
}