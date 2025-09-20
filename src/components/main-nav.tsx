"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Bot, LineChart, BookHeart, Wand2, LifeBuoy } from 'lucide-react';

const navItems = [
  { href: '/', label: 'AI Companion', icon: Bot },
  { href: '/mood-tracker', label: 'Mood Tracker', icon: LineChart },
  { href: '/wellness-exercises', label: 'Wellness Exercises', icon: BookHeart },
  { href: '/content-generator', label: 'Content Generator', icon: Wand2 },
  { href: '/resources', label: 'Resources', icon: LifeBuoy },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
