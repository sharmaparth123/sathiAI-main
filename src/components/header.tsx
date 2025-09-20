"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from './ui/sidebar';

export function AppHeader() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'AI Companion';
      case '/mood-tracker':
        return 'Mood Tracker';
      case '/wellness-exercises':
        return 'Wellness Exercises';
      case '/content-generator':
        return 'Content Generator';
      case '/resources':
        return 'Resources';
      default:
        return 'Saathi AI';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
    </header>
  );
}
