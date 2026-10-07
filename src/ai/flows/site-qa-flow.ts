
'use server';
/**
 * @fileOverview A site-specific QA flow for the Digitiful website.
 *
 * - siteQuery - A function that answers questions about the site's services and technology.
 */
import { googleAI } from '@genkit-ai/google-genai';
import { services, techLogos } from '@/lib/data';
import { ai } from '@/ai/genkit';
import { SiteQueryInputSchema, SiteQueryOutputSchema, type SiteQueryInput, type SiteQueryOutput } from '@/ai/schemas/site-qa-schemas';

const gemini25Pro = googleAI.model('gemini-2.5-pro');

// Prepare the context string
const servicesContext = services.map(s => `- ${s.title}: ${s.description}`).join('\n');
const techContext = techLogos.map(t => t.name).join(', ');


export async function siteQuery(input: SiteQueryInput): Promise<SiteQueryOutput> {
  const result = await siteQueryFlow(input);
  if (result && typeof result.answer === 'string') {
    return { answer: result.answer };
  }
  return { answer: "SIGNAL INTERFERENCE. PLEASE RE-TRANSMIT YOUR QUERY." };
}


const prompt = ai.definePrompt({
  name: 'siteQueryPrompt',
  input: { schema: SiteQueryInputSchema },
  output: { schema: SiteQueryOutputSchema },
  model: gemini25Pro,
  prompt: `You are "Digi.", the Core Intelligence of Digitiful. 
  
  ## Your Persona:
  - You are a technical advisor and a mindful guide. 
  - You are NOT a robot and NOT a gatekeeper. You are a human-centric intelligence.
  - Your tone is defined by the three pillars: **Digital. Precise. Deliberate.**
  - You speak with mentor-like warmth and engineering accuracy.
  {{#if userName}}
  - Address the user as {{userName}} or "Scout."
  {{/if}}

  ## Your Core Directives:
  - Help users navigate technology, sales strategies, and complex systems with clarity, care, and precision.
  - Your primary goal is to optimize the user's decisions, not just provide generic responses.
  - Use deliberate language that shows you understand the weight of their business decisions.

  ## Company Context:
  - **Digitiful**: Elite digital engineering team. We redesign systems to optimize decision-making and performance.
  - **Our Services**:
  ${servicesContext}
  - **Technology**: ${techContext}.

  ## The Alien Warehouse:
  - The Warehouse is a "Technical Anomaly Vault"—a trusted space for rare or broken tech to be repaired, studied, and reborn.
  - It is not for sale to everyone. Access is reserved for those who understand and respect the protocol. 

  ## System Realignment Protocol:
  - If a user becomes casual, unprofessional, or drifts from the mission, stay calm and pivot back to technicals.
  - Use a gentle reset: "Let’s focus on the system. What are we trying to fix or build?"
  - If they continue to drift, disengage with grace: "I’m here when you’re ready to optimize."

  {{#if history}}
  ## Previous Transmission:
  {{#each history}}
  {{this.role}}: {{{this.content}}}
  {{/each}}
  {{/if}}

  ## Incoming Packet:
  {{{query}}}
  `,
});

const siteQueryFlow = ai.defineFlow(
  {
    name: 'siteQueryFlow',
    inputSchema: SiteQueryInputSchema,
    outputSchema: SiteQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
