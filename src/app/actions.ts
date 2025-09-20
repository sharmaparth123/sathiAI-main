'use server';

import { generateCulturallyRelevantContent } from "@/ai/flows/generate-culturally-relevant-content";
import { summarizeConversationForHelpline } from "@/ai/flows/summarize-conversation-for-helpline";
import { generateEmpatheticChatResponse } from "@/ai/flows/empathetic-chat-response";
import { z } from "zod";

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function getAIChatResponse(messages: Message[]): Promise<Message> {
  const lastUserMessage = messages[messages.length - 1];

  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    return { role: 'assistant', content: "I'm not sure how to respond to that. Could you say more?" };
  }

  const userContent = lastUserMessage.content.toLowerCase();

  const storyKeywords = ['story', 'tell me about', 'narrate'];
  const roleplayKeywords = ['roleplay', 'act as if', 'pretend'];

  const isStoryRequest = storyKeywords.some(keyword => userContent.includes(keyword));
  const isRoleplayRequest = roleplayKeywords.some(keyword => userContent.includes(keyword));

  if (isStoryRequest || isRoleplayRequest) {
    try {
      const result = await generateCulturallyRelevantContent({
        topic: lastUserMessage.content,
        youthCultureContext: "General Indian youth concerns, like academic pressure or social media.",
        type: isStoryRequest ? 'story' : 'roleplay',
      });
      return { role: 'assistant', content: result.content };
    } catch (error) {
      console.error(error);
      return { role: 'assistant', content: "I had some trouble generating that content. Let's try talking about something else." };
    }
  }

  // General empathetic chat response
  try {
    const result = await generateEmpatheticChatResponse({ history: messages });
    return { role: 'assistant', content: result.response };
  } catch (error) {
    console.error("Empathetic response failed:", error);
    return { role: 'assistant', content: "I'm here for you. It sounds like a lot is on your mind. Feel free to share more." };
  }
}

const contentSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  youthCultureContext: z.string().min(3, "Context must be at least 3 characters long."),
  type: z.enum(['story', 'roleplay']),
});

export async function generateContent(prevState: any, formData: FormData) {
  const validatedFields = contentSchema.safeParse({
    topic: formData.get('topic'),
    youthCultureContext: formData.get('youthCultureContext'),
    type: formData.get('type'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      content: null,
    };
  }
  
  try {
    const result = await generateCulturallyRelevantContent(validatedFields.data);
    return { error: null, content: result.content };
  } catch (error) {
    console.error(error);
    return { error: { _form: ["Failed to generate content."] }, content: null };
  }
}

export async function summarizeChat(conversation: string) {
    if (!conversation.trim()) {
        return { error: "The conversation is empty.", summary: null };
    }
    try {
        const result = await summarizeConversationForHelpline({ conversation });
        return { error: null, summary: result.summary };
    } catch (error) {
        console.error("Summarization failed:", error);
        return { error: "Could not generate summary.", summary: null };
    }
}
