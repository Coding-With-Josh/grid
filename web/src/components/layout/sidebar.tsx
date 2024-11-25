'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Settings, 
  Users, 
  MessageSquare,
  Image as ImageIcon,
  FileText,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  isOpen: boolean;
}

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Projects',
    icon: FolderGit2,
    href: '/dashboard/projects',
    color: 'text-violet-500',
  },
  {
    label: 'Repository',
    icon: FolderGit2,
    href: '/dashboard/dev/repos',
    color: 'text-pink-700',
  },
  {
    label: 'Assets',
    icon: ImageIcon,
    href: '/dashboard/assets',
    color: 'text-orange-700',
  },
  {
    label: 'Content',
    icon: FileText,
    href: '/dashboard/content',
    color: 'text-emerald-500',
  },
  {
    label: 'Community',
    icon: Users,
    href: '/dashboard/community',
    color: 'text-green-700',
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
    color: 'text-blue-700',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-[#111827] text-white transition-all duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      "w-[300px]"
    )}>
      <div className="flex-1 px-3 py-4">
        <Link href="/dashboard" className="flex items-center mb-10">
          <div className="relative w-12 h-12 mr-4">
            <div className="absolute inset-0 bg-gradient-to-br from-[#14F195] to-primary rounded-xl" />
            <div className="absolute inset-[2px] bg-[#111827] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-[#14F195]">G</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            Grid
          </h1>
        </Link>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                  pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400',
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 mt-auto border-t border-zinc-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
