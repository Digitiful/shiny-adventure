
'use server';
/**
 * @fileOverview A flow for suggesting relevant tags for a given task title.
 *
 * - suggestTags - A function that suggests tags.
 * - TagSuggesterInput - The input type for the suggestTags function.
 * - TagSuggesterOutput - The return type for the suggestTags function.
 */
import { ai } from '@/ai/genkit';
import { TagSuggesterInputSchema, TagSuggesterOutputSchema, type TagSuggesterInput, type TagSuggesterOutput } from '@/ai/schemas/tag-suggester-schemas';

export async function suggestTags(input: TagSuggesterInput): Promise<TagSuggesterOutput> {
  return tagSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tagSuggesterPrompt',
  input: { schema: TagSuggesterInputSchema },
  output: { schema: TagSuggesterOutputSchema },
  prompt: `You are an expert project manager. Your task is to analyze a task title from a software development project and suggest a few relevant tags.

  ## Directives:
  - The tags should be concise, ideally one or two words (e.g., "Bug", "UI/UX", "Database").
  - Provide between 1 and 4 of the most relevant tags.
  - Common tags include: Bug, Feature, Refactor, Frontend, Backend, UI/UX, Database, API, Authentication, Performance, Testing, Documentation.
  - Analyze the user's task title and determine which of these (or similar) tags are most appropriate.

  ## Task Title:
  {{{taskTitle}}}
  `,
});

const tagSuggesterFlow = ai.defineFlow(
  {
    name: 'tagSuggesterFlow',
    inputSchema: TagSuggesterInputSchema,
    outputSchema: TagSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
