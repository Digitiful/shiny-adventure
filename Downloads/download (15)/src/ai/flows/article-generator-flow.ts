
'use server';
/**
 * @fileOverview An AI flow for analyzing text to determine if it was written by an AI.
 *
 * - analyzeContent - A function that analyzes text content.
 * - ContentAnalyzerInput - The input type for the analyzeContent function.
 * - ContentAnalysis - The return type for the analyzeContent function.
 */
import { googleAI } from '@genkit-ai/google-genai';
import { ai } from '@/ai/genkit';
import { ContentAnalyzerInputSchema, ContentAnalysisSchema, type ContentAnalyzerInput, type ContentAnalysis } from '@/ai/schemas/article-generator-schemas';

const gemini25Pro = googleAI.model('gemini-2.5-pro');

export async function analyzeContent(input: ContentAnalyzerInput): Promise<ContentAnalysis> {
  return contentAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentAnalyzerPrompt',
  input: { schema: ContentAnalyzerInputSchema },
  output: { schema: ContentAnalysisSchema },
  model: gemini25Pro,
  prompt: `You are an expert in computational linguistics, like the tool "Humanize AI". Your task is to analyze the provided text and determine the likelihood that it was written by a human versus a machine learning model.

  ## Directives:
  - Carefully examine the text for common machine-learning writing patterns: overly formal tone, repetitive sentence structures, lack of personal voice, use of "weasel words", and unnaturally perfect grammar.
  - Also look for signs of human writing: varied sentence length, use of idioms, personal anecdotes, minor imperfections, and a clear, distinct voice.
  - Based on your analysis, provide a 'humanScore' from 0 to 100. A score of 100 means you are certain it's human-written. A score of 0 means you are certain it's machine-generated.
  - Provide a concise, bulleted 'analysis' that justifies your score.
  - Set the 'isAiGenerated' boolean to true if you believe the human score is below 60.

  ## Text to Analyze:
  {{{textToAnalyze}}}
  `,
});

const contentAnalyzerFlow = ai.defineFlow(
  {
    name: 'contentAnalyzerFlow',
    inputSchema: ContentAnalyzerInputSchema,
    outputSchema: ContentAnalysisSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
