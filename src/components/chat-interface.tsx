"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import type { Message } from '@/app/actions';
import { getAIChatResponse, summarizeChat } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, AlertTriangle, Send, User, Loader2 } from 'lucide-react';
import { resources } from '@/lib/content';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Separator } from './ui/separator';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSummarize = () => {
    startSummaryTransition(async () => {
      const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const result = await summarizeChat(conversation);
      if (result.summary) {
        setSummary(result.summary);
      } else if (result.error) {
        setSummary(`Error summarizing: ${result.error}`);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      const aiResponse = await getAIChatResponse(newMessages);
      setMessages(prev => [...prev, aiResponse]);
    });
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-15rem)]">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-16">
                <Bot className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-2xl font-semibold">Welcome to Saathi AI</h2>
                <p>How are you feeling today? Share anything on your mind.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-xl px-4 py-3 text-sm shadow',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-xl px-4 py-3 text-sm shadow bg-card flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-background">
          <div className="relative">
            <form onSubmit={handleSubmit}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Talk about anything..."
                className="pr-28"
                disabled={isPending}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button variant="ghost" size="icon" type="button" onClick={() => setHelpModalOpen(true)}>
                   <AlertTriangle className="text-destructive h-5 w-5" />
                </Button>
                <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Dialog open={isHelpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Urgent Help</DialogTitle>
            <DialogDescription>
              If you are in distress, please reach out. You are not alone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <Button onClick={handleSummarize} disabled={isSummarizing || messages.length === 0} className="w-full mb-4">
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Prepare Summary for Helpline
              </Button>
              {summary && (
                <div className="p-3 bg-secondary rounded-md text-sm text-secondary-foreground mb-4">
                  <h4 className="font-bold mb-2">Conversation Summary:</h4>
                  <p className="whitespace-pre-wrap">{summary}</p>
                </div>
              )}
            <h3 className="font-semibold text-foreground mb-2">Helplines in India</h3>
            <Separator className="mb-2" />
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {resources.filter(r => r.type === 'helpline').map((helpline) => (
                  <div key={helpline.name} className="text-sm">
                    <p className="font-semibold">{helpline.name}</p>
                    <p className="text-muted-foreground">{helpline.phone}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button onClick={() => setHelpModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
