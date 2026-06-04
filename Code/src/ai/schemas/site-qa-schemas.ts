
import { z } from 'zod';

export const SiteQueryInputSchema = z.object({
  query: z.string().describe('The user\'s question about the company, its services, or its technology stack.'),
  userName: z.string().optional().describe('The name of the user, if they are logged in.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The previous conversation history.'),
});
export type SiteQueryInput = z.infer<typeof SiteQueryInputSchema>;

export const SiteQueryOutputSchema = z.object({
  answer: z.string().describe('A helpful and concise answer to the user\'s question.'),
});
export type SiteQueryOutput = z.infer<typeof SiteQueryOutputSchema>;
