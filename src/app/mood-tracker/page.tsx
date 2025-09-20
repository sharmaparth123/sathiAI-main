"use client";

import { useState, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Smile, Frown, Meh, Laugh, Angry, LineChart } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartTooltipContent,
  ChartContainer,
} from "@/components/ui/chart"
import { format, subDays, startOfDay } from 'date-fns';

type Mood = {
  id: number;
  label: string;
  icon: React.ElementType;
  color: string;
};

const moods: Mood[] = [
  { id: 1, label: 'Angry', icon: Angry, color: 'hsl(var(--destructive))' },
  { id: 2, label: 'Sad', icon: Frown, color: 'hsl(var(--chart-4))' },
  { id: 3, label: 'Neutral', icon: Meh, color: 'hsl(var(--muted-foreground))' },
  { id: 4, label: 'Happy', icon: Smile, color: 'hsl(var(--chart-2))' },
  { id: 5, label: 'Excited', icon: Laugh, color: 'hsl(var(--chart-1))' },
];

type MoodEntry = {
  moodId: number;
  timestamp: string;
};

export default function MoodTrackerPage() {
  const [moodLog, setMoodLog] = useLocalStorage<MoodEntry[]>('moodLog', []);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
  };

  const handleSaveMood = () => {
    if (selectedMood !== null) {
      const newEntry: MoodEntry = {
        moodId: selectedMood,
        timestamp: new Date().toISOString(),
      };
      setMoodLog([...moodLog, newEntry]);
      setSelectedMood(null);
    }
  };

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => startOfDay(subDays(new Date(), i))).reverse();
    
    return last7Days.map(day => {
        const dayString = format(day, 'yyyy-MM-dd');
        const moodsOnDay = moodLog.filter(entry => format(new Date(entry.timestamp), 'yyyy-MM-dd') === dayString);

        if (moodsOnDay.length === 0) {
            return { date: format(day, 'MMM d'), mood: 0 };
        }
        
        const avgMood = moodsOnDay.reduce((sum, entry) => sum + entry.moodId, 0) / moodsOnDay.length;
        return { date: format(day, 'MMM d'), mood: parseFloat(avgMood.toFixed(2)) };
    });
  }, [moodLog]);

  const chartConfig = {
    mood: {
      label: "Mood",
    },
  };
  
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling right now?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-5 gap-4 w-full max-w-md">
            {moods.map((mood) => (
              <Button
                key={mood.id}
                variant="ghost"
                className={cn(
                  'flex flex-col h-24 w-full items-center justify-center gap-2 rounded-lg border-2',
                  selectedMood === mood.id
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent'
                )}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <mood.icon className="h-8 w-8" style={{ color: mood.color }} />
                <span className="text-xs font-medium">{mood.label}</span>
              </Button>
            ))}
          </div>
          <Button onClick={handleSaveMood} disabled={selectedMood === null} size="lg">
            Save Mood
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Mood Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
            {moodLog.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis domain={[0, 5]} tickLine={false} axisLine={false} ticks={[1, 2, 3, 4, 5]} tickFormatter={(value) => moods.find(m => m.id === value)?.label || ''} />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    formatter={(value) => [`${Number(value).toFixed(2)}`, "Average Mood"]}
                    indicator="dot"
                  />}
                />
                <Bar dataKey="mood" radius={8}>
                    {chartData.map((entry, index) => {
                        const moodId = Math.round(entry.mood);
                        const color = moods.find(m => m.id === moodId)?.color || 'hsl(var(--muted))';
                        return <div key={`cell-${index}`} style={{ backgroundColor: color }} />;
                    })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <LineChart className="h-12 w-12 mb-4" />
                <p>Log your mood to see your trends here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
