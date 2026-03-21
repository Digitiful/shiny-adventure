
import { z } from 'zod';

export const GeneralQueryInputSchema = z.object({
  query: z.string().describe('The user\'s question or message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The previous conversation history.'),
});
export type GeneralQueryInput = z.infer<typeof GeneralQueryInputSchema>;

export const GeneralQueryOutputSchema = z.object({
  answer: z.string().describe('A helpful and thematic response.'),
});
export type GeneralQueryOutput = z.infer<typeof GeneralQueryOutputSchema>;
