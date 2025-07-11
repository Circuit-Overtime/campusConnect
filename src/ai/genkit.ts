import { genkit } from 'genkit';
import { googleAI, gemini } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini('gemini-1.5-flash'),
});