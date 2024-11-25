'use client';

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  PlusSquare,
  Folder,
  UserCircle
} from "lucide-react";

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Profile',
    icon: UserCircle,
    href: '/dashboard/profile',
  },
  {
    label: 'Projects',
    icon: Folder,
    href: '/projects',
  },
  {
    label: 'Create',
    icon: PlusSquare,
    href: '/create',
  },
  {
    label: 'Community',
    icon: Users,
    href: '/community',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background/50 backdrop-blur-sm border-r border-border/40">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center gap-2 mb-14 pl-3">
          <Image
            src="/logo.svg"
            alt="Grid Logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-[#9945FF] font-bold text-xl">
            Grid
          </span>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                pathname.startsWith(route.href) && route.href !== '/dashboard' ? "bg-primary/10 text-primary" : ""
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn(
                  "h-5 w-5 mr-3", 
                  pathname === route.href || (pathname.startsWith(route.href) && route.href !== '/dashboard') 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
