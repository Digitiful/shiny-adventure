
import { z } from 'genkit';

export const TagSuggesterInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task for which to suggest tags.'),
});
export type TagSuggesterInput = z.infer<typeof TagSuggesterInputSchema>;

export const TagSuggesterOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of 1 to 4 relevant tags.'),
});
export type TagSuggesterOutput = z.infer<typeof TagSuggesterOutputSchema>;
