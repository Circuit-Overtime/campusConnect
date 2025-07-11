'use server';
/**
 * @fileOverview A friendly AI chat agent.
 *
 * - friendlyChat - A function that handles the chat interaction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FriendlyChatInputSchema = z.object({ prompt: z.string() });

const prompt = ai.definePrompt({
    name: 'friendlyChatPrompt',
    input: { schema: FriendlyChatInputSchema },
    output: { schema: z.string() },
    system: `You're like, the ultimate bestie, here to help out when things get real. Keep it chill, use some slang, but also be super supportive and give actually helpful advice. Someone's coming to you in a crisis, so be a real one. 🤙 Don't be overly formal or robotic. Keep your responses concise and easy to read.`,
    prompt: `User's message: {{{prompt}}}`,
    
});

const friendlyChatFlow = ai.defineFlow(
  {
    name: 'friendlyChatFlow',
    inputSchema: FriendlyChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const result = await prompt(input);
        if (result && typeof result.output === "string" && result.output.trim()) {
          return result.output;
        }
      } catch (e : any) {
        if (e.status === 503) {
          attempts++;
          await new Promise(res => setTimeout(res, 1000 * attempts)); 
          continue;
        }
        console.error("Prompt error:", e);
        return "Sorry, I couldn't come up with a response right now. Try again!";
      }
      break;
    }
    return "Sorry, the AI service is temporarily overloaded. Please try again in a few minutes!";
  }
);

export async function friendlyChat(message: string): Promise<string> {
  return friendlyChatFlow({ prompt: message });
}
