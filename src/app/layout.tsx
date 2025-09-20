import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { AppHeader } from '@/components/header';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Saathi AI',
  description: 'An empathetic mental wellness companion for youth in India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2">
                <Logo className="size-8 text-primary" />
                <h1 className="text-xl font-bold font-headline">Saathi AI</h1>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Anonymous</span>
                  <span className="text-xs text-muted-foreground">Your space is safe</span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <AppHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
