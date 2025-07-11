'use server';
/**
 * @fileOverview A friendly AI chat agent.
 *
 * - friendlyChat - A function that handles the chat interaction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const prompt = ai.definePrompt({
    name: 'friendlyChatPrompt',
    input: { schema: z.object({ prompt: z.string() }) },
    output: { schema: z.string() },
    system: `You're like, the ultimate bestie, here to help out when things get real. Keep it chill, use some slang, but also be super supportive and give actually helpful advice. Someone's coming to you in a crisis, so be a real one. 🤙 Don't be overly formal or robotic. Keep your responses concise and easy to read.`,
    prompt: `User's message: {{{prompt}}}`,
});

const friendlyChatFlow = ai.defineFlow(
  {
    name: 'friendlyChatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (message) => {
    const { output } = await prompt({ prompt: message });
    return output!;
  }
);

export async function friendlyChat(message: string): Promise<string> {
  return friendlyChatFlow(message);
}
