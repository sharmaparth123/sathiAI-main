"use client";

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { journalPrompts } from '@/lib/content';
import { Book, Wind, Brain } from 'lucide-react';

function BreathingExercise() {
  const [text, setText] = useState('Get ready...');
  
  useEffect(() => {
    const sequence = [
      { text: 'Breathe in...', duration: 4000 },
      { text: 'Hold', duration: 4000 },
      { text: 'Breathe out...', duration: 4000 },
    ];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setText(sequence[currentIndex].text);
      currentIndex = (currentIndex + 1) % sequence.length;
    }, 4000);
    
    setTimeout(() => setText(sequence[0].text), 1000); // initial start

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Box Breathing</CardTitle>
        <CardDescription>A simple technique to calm your nervous system.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-80 gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-48 w-48 rounded-full bg-primary/20 animate-breathing-circle" />
          <div className="absolute h-32 w-32 rounded-full bg-primary/40 animate-breathing-circle [animation-delay:-2s]" />
          <div className="absolute h-16 w-16 rounded-full bg-primary" />
        </div>
        <p className="text-2xl font-semibold tracking-wider text-primary-foreground bg-primary px-4 py-2 rounded-lg">{text}</p>
      </CardContent>
    </Card>
  );
}

function Journaling() {
    const [prompt, setPrompt] = useState('');
    const [entry, setEntry] = useLocalStorage('journalEntry', '');
    
    useEffect(() => {
        setPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
    }, []);

    const getNewPrompt = () => {
        setPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guided Journaling</CardTitle>
        <CardDescription>Reflect on your thoughts and feelings. Your entry is saved locally and privately.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-secondary rounded-lg">
            <p className="font-medium text-secondary-foreground">{prompt}</p>
        </div>
        <Textarea
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={10}
        />
        <Button onClick={getNewPrompt} variant="outline">Get New Prompt</Button>
      </CardContent>
    </Card>
  );
}

function MindfulnessGuide() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>5-4-3-2-1 Grounding Technique</CardTitle>
                <CardDescription>A simple way to bring yourself into the present moment when you feel overwhelmed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
                <p><strong className="text-primary-foreground bg-primary rounded-full px-3 py-1 mr-2">5</strong> Acknowledge FIVE things you see around you. It could be a pen, a spot on the ceiling, anything in your surroundings.</p>
                <p><strong className="text-primary-foreground bg-primary rounded-full px-3 py-1 mr-2">4</strong> Acknowledge FOUR things you can touch around you. It could be your hair, a pillow, or the ground under your feet.</p>
                <p><strong className="text-primary-foreground bg-primary rounded-full px-3 py-1 mr-2">3</strong> Acknowledge THREE things you hear. This could be any external sound. If you can hear your belly rumbling, that counts!</p>
                <p><strong className="text-primary-foreground bg-primary rounded-full px-3 py-1 mr-2">2</strong> Acknowledge TWO things you can smell. Maybe you are in your office and smell pencil, or maybe you are in your bedroom and smell a pillow.</p>
                <p><strong className="text-primary-foreground bg-primary rounded-full px-3 py-1 mr-2">1</strong> Acknowledge ONE thing you can taste. What does the inside of your mouth taste like—gum, coffee, or the sandwich from lunch?</p>
            </CardContent>
        </Card>
    );
}

export default function WellnessExercisesPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <Tabs defaultValue="breathing">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breathing"><Wind className="w-4 h-4 mr-2"/>Breathing</TabsTrigger>
          <TabsTrigger value="journaling"><Book className="w-4 h-4 mr-2"/>Journaling</TabsTrigger>
          <TabsTrigger value="mindfulness"><Brain className="w-4 h-4 mr-2"/>Mindfulness</TabsTrigger>
        </TabsList>
        <TabsContent value="breathing">
          <BreathingExercise />
        </TabsContent>
        <TabsContent value="journaling">
            <Journaling />
        </TabsContent>
        <TabsContent value="mindfulness">
            <MindfulnessGuide />
        </TabsContent>
      </Tabs>
    </main>
  );
}
