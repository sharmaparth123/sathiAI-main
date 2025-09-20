'use server';
/**
 * @fileOverview Summarizes a conversation for a mental health professional or helpline.
 *
 * - summarizeConversationForHelpline - A function that summarizes the conversation.
 * - SummarizeConversationForHelplineInput - The input type for the summarizeConversationForHelpline function.
 * - SummarizeConversationForHelplineOutput - The return type for the summarizeConversationForHelpline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationForHelplineInputSchema = z.object({
  conversation: z
    .string()
    .describe('The complete conversation between the user and the AI.'),
});
export type SummarizeConversationForHelplineInput =
  z.infer<typeof SummarizeConversationForHelplineInputSchema>;

const SummarizeConversationForHelplineOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the conversation, highlighting key issues, emotional state, and any critical information for a mental health professional or helpline.'
    ),
});
export type SummarizeConversationForHelplineOutput =
  z.infer<typeof SummarizeConversationForHelplineOutputSchema>;

export async function summarizeConversationForHelpline(
  input: SummarizeConversationForHelplineInput
): Promise<SummarizeConversationForHelplineOutput> {
  return summarizeConversationForHelplineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationForHelplinePrompt',
  input: {schema: SummarizeConversationForHelplineInputSchema},
  output: {schema: SummarizeConversationForHelplineOutputSchema},
  prompt: `You are an AI assistant summarizing a conversation between a user and an AI mental health companion for a mental health professional or helpline. The user is in crisis. Provide a concise summary of the conversation, highlighting the key issues discussed, the user's emotional state, and any critical information that would be helpful for the professional or helpline to provide immediate and informed support. Make sure to extract all the key information so that the professional doesn't need to read the entire conversation. Keep the summary as short as possible while still being useful.

Conversation:
{{{conversation}}}`,
});

const summarizeConversationForHelplineFlow = ai.defineFlow(
  {
    name: 'summarizeConversationForHelplineFlow',
    inputSchema: SummarizeConversationForHelplineInputSchema,
    outputSchema: SummarizeConversationForHelplineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
