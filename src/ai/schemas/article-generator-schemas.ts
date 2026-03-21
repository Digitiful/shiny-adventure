
import { z } from 'genkit';

export const ContentAnalyzerInputSchema = z.object({
  textToAnalyze: z.string().describe('The block of text to be analyzed.'),
});
export type ContentAnalyzerInput = z.infer<typeof ContentAnalyzerInputSchema>;

export const ContentAnalysisSchema = z.object({
  humanScore: z.number().min(0).max(100).describe('A percentage score from 0 to 100 indicating the likelihood that the text was written by a human. 100 is definitively human, 0 is definitively machine-generated.'),
  analysis: z.string().describe('A brief, bulleted-point analysis explaining the reasoning behind the score. Identify patterns, phrasing, or artifacts that suggest machine or human origin.'),
  isAiGenerated: z.boolean().describe('A simple boolean indicating if the content is likely machine-generated (true) or human-written (false), based on a threshold of your choice (e.g., humanScore < 60).'),
});
export type ContentAnalysis = z.infer<typeof ContentAnalysisSchema>;
