import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyASFyHF9z64nPDPvdljL1ETQXM2NaFTGBg'})],
  model: 'googleai/gemini-2.0-flash',
});
