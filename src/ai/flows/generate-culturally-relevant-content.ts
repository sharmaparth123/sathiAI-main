'use server';
/**
 * @fileOverview Generates culturally relevant stories and role-playing scenarios for Indian youth.
 *
 * - generateCulturallyRelevantContent - A function that generates culturally relevant content.
 * - GenerateCulturallyRelevantContentInput - The input type for the generateCulturallyRelevantContent function.
 * - GenerateCulturallyRelevantContentOutput - The return type for the generateCulturallyRelevantContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCulturallyRelevantContentInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic or theme for the story or role-playing scenario.'),
  youthCultureContext: z
    .string()
    .describe(
      'The specific context of Indian youth culture to consider when generating the content, e.g., academic pressure, family expectations, social media influence.'
    ),
  type: z.enum(['story', 'roleplay']).describe('The type of content to generate.'),
});
export type GenerateCulturallyRelevantContentInput = z.infer<
  typeof GenerateCulturallyRelevantContentInputSchema
>;

const GenerateCulturallyRelevantContentOutputSchema = z.object({
  content: z
    .string()
    .describe(
      'The generated story or role-playing scenario, tailored to Indian youth culture and the specified topic.'
    ),
});
export type GenerateCulturallyRelevantContentOutput = z.infer<
  typeof GenerateCulturallyRelevantContentOutputSchema
>;

export async function generateCulturallyRelevantContent(
  input: GenerateCulturallyRelevantContentInput
): Promise<GenerateCulturallyRelevantContentOutput> {
  return generateCulturallyRelevantContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCulturallyRelevantContentPrompt',
  input: {schema: GenerateCulturallyRelevantContentInputSchema},
  output: {schema: GenerateCulturallyRelevantContentOutputSchema},
  prompt: `You are a creative content generator specializing in mental wellness for Indian youth.

You will generate a {{type}} that normalizes mental health conversations within the context of Indian youth culture.

The {{type}} should address the following topic: {{{topic}}}

It should also be relevant to this aspect of Indian youth culture: {{{youthCultureContext}}}

Ensure the generated content is engaging, relatable, and culturally sensitive.

Output:
`,
});

const generateCulturallyRelevantContentFlow = ai.defineFlow(
  {
    name: 'generateCulturallyRelevantContentFlow',
    inputSchema: GenerateCulturallyRelevantContentInputSchema,
    outputSchema: GenerateCulturallyRelevantContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
