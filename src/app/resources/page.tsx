import { resources } from '@/lib/content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Globe } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  const helplines = resources.filter(r => r.type === 'helpline');
  const organizations = resources.filter(r => r.type === 'organization');

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-primary-foreground bg-primary p-4 rounded-lg">
          Emergency Helplines
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {helplines.map((resource) => (
            <Card key={resource.name}>
              <CardHeader>
                <CardTitle>{resource.name}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resource.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${resource.phone}`} className="hover:underline">
                      {resource.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Organizations & Professionals</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {organizations.map((resource) => (
            <Card key={resource.name}>
              <CardHeader>
                <CardTitle>{resource.name}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resource.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${resource.phone}`} className="hover:underline">
                      {resource.phone}
                    </a>
                  </div>
                )}
                {resource.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    <Link href={resource.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      Visit Website
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
