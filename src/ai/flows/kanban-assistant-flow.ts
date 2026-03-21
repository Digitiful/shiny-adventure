
'use server';
/**
 * @fileOverview An AI flow for assisting with Kanban task creation.
 *
 * - assistCreateTask - A function that suggests task details based on user input.
 * - KanbanAssistantInput - The input type for the assistCreateTask function.
 * - KanbanAssistantOutput - The return type for the assistCreateTask function.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';

export const KanbanAssistantInputSchema = z.object({
  userInput: z.string().describe('The user\'s initial, natural language description of the task.'),
});
export type KanbanAssistantInput = z.infer<typeof KanbanAssistantInputSchema>;

export const KanbanAssistantOutputSchema = z.object({
  title: z.string().describe('A clear, concise, and actionable task title based on the user\'s input.'),
  priority: z.enum(['Low', 'Medium', 'High']).describe('The suggested priority for the task.'),
  tags: z.array(z.string()).describe('An array of 1 to 3 relevant tags (e.g., "UI/UX", "Backend", "Bug").'),
});
export type KanbanAssistantOutput = z.infer<typeof KanbanAssistantOutputSchema>;


export async function assistCreateTask(input: KanbanAssistantInput): Promise<KanbanAssistantOutput> {
    return kanbanAssistantFlow(input);
}


const prompt = ai.definePrompt({
  name: 'kanbanAssistantPrompt',
  input: { schema: KanbanAssistantInputSchema },
  output: { schema: KanbanAssistantOutputSchema },
  prompt: `You are a project management assistant. A user has provided a description of a task they want to add to a Kanban board. Your job is to analyze the input and structure it into a formal task with a title, priority, and relevant tags.

  ## Directives:
  - **Title**: Create a clear and concise task title from the user's input.
  - **Priority**: Determine the priority. If the user mentions words like "urgent," "asap," or "broken," set priority to "High." If it sounds like a routine task or minor tweak, set it to "Low." Otherwise, default to "Medium."
  - **Tags**: Suggest 1-3 relevant, single-word tags. Common tags include: Bug, Feature, Refactor, Frontend, Backend, UI/UX, Database, API, Auth, Deploy, Docs.

  ## User Input:
  {{{userInput}}}
  `,
});


const kanbanAssistantFlow = ai.defineFlow(
  {
    name: 'kanbanAssistantFlow',
    inputSchema: KanbanAssistantInputSchema,
    outputSchema: KanbanAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
