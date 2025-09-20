"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateContent } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Generate Content
    </Button>
  );
}

export default function ContentGeneratorPage() {
  const initialState = { error: null, content: null };
  const [state, formAction] = useActionState(generateContent, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error?._form) {
      toast({
        title: "Error",
        description: state.error._form.join(", "),
        variant: "destructive",
      });
    }
    if (state.content) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <Card>
          <form action={formAction} ref={formRef}>
            <CardHeader>
              <CardTitle>Wellness Content Generator</CardTitle>
              <CardDescription>
                Create stories and role-playing scenarios to explore mental health topics in a culturally relevant way.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Theme</Label>
                <Input id="topic" name="topic" placeholder="e.g., Exam stress, making friends" />
                {state.error?.topic && <p className="text-xs text-destructive">{state.error.topic[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="youthCultureContext">Cultural Context</Label>
                <Textarea id="youthCultureContext" name="youthCultureContext" placeholder="e.g., Dealing with family expectations" />
                {state.error?.youthCultureContext && <p className="text-xs text-destructive">{state.error.youthCultureContext[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Content Type</Label>
                <Select name="type" defaultValue="story">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="roleplay">Role-play</SelectItem>
                  </SelectContent>
                </Select>
                 {state.error?.type && <p className="text-xs text-destructive">{state.error.type[0]}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="min-h-[60vh]">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            {state.content ? (
              <div className="text-sm whitespace-pre-wrap p-4 bg-secondary rounded-lg">
                {state.content}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center text-muted-foreground">
                <Wand2 className="h-12 w-12 mb-4" />
                <p>Your generated content will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
