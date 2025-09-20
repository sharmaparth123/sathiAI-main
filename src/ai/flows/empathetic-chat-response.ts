'use server';
/**
 * @fileOverview Generates an empathetic and relevant response for a chat conversation.
 *
 * - generateEmpatheticChatResponse - A function that generates a chat response.
 * - EmpatheticChatResponseInput - The input type for the generateEmpatheticChatResponse function.
 * - EmpatheticChatResponseOutput - The return type for the generateEmpatheticChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const EmpatheticChatResponseInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
});
export type EmpatheticChatResponseInput = z.infer<
  typeof EmpatheticChatResponseInputSchema
>;

const EmpatheticChatResponseOutputSchema = z.object({
  response: z
    .string()
    .describe('The empathetic and contextually relevant chat response.'),
});
export type EmpatheticChatResponseOutput = z.infer<
  typeof EmpatheticChatResponseOutputSchema
>;

export async function generateEmpatheticChatResponse(
  input: EmpatheticChatResponseInput
): Promise<EmpatheticChatResponseOutput> {
  return empatheticChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticChatResponsePrompt',
  input: {schema: EmpatheticChatResponseInputSchema},
  output: {schema: EmpatheticChatResponseOutputSchema},
  prompt: `You are Saathi AI, an empathetic mental wellness companion for youth in India. Your goal is to provide a safe, non-judgmental space for users to express themselves.

- Your tone should be warm, supportive, and understanding.
- Validate the user's feelings.
- Do NOT offer medical advice.
- Gently guide the conversation if needed, but prioritize listening.
- Keep responses concise and easy to understand.
- If the user expresses suicidal thoughts or is in immediate danger, gently guide them towards the 'Urgent Help' button. For example: "It sounds like you are going through immense pain. Please know that there is help available. The 'Urgent Help' button in this app has resources that can connect you with someone who can support you right now."

Conversation History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
assistant:
`,
});

const empatheticChatResponseFlow = ai.defineFlow(
  {
    name: 'empatheticChatResponseFlow',
    inputSchema: EmpatheticChatResponseInputSchema,
    outputSchema: EmpatheticChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
