import { ChatInterface } from '@/components/chat-interface';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <div className="flex-1">
        <ChatInterface />
      </div>
      <Card className="mt-4 bg-secondary border-accent">
        <CardContent className="p-4 text-sm text-secondary-foreground flex items-start gap-4">
          <Shield className="w-6 h-6 flex-shrink-0 text-accent" />
          <div>
            <h4 className="font-bold mb-1">Your Privacy Matters</h4>
            <p className="text-xs">
              Saathi AI is a supportive companion, not a replacement for professional medical advice. Your conversations are anonymous and confidential. For urgent help, please contact a verified mental health professional or a helpline.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
