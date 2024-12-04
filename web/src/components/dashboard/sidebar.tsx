'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft } from 'lucide-react';
import { sidebarItems } from '@/config/dashboard';
import type { SidebarItem } from '@/types/dashboard';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'group/sidebar relative flex h-full flex-col overflow-hidden border-r bg-background duration-300',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="text-lg font-semibold">Grid</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              isCollapsed && 'rotate-180'
            )}
          />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-hidden">
        <div className={cn('flex flex-col gap-4 p-4')}>
          {sidebarItems.map((section, i) => {
            // Filter items based on user role if needed
            const visibleItems = section.items;

            if (!visibleItems.length) return null;

            return (
              <div key={i} className="flex flex-col gap-2">
                {!isCollapsed && (
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    {section.section}
                  </h4>
                )}
                <div className="flex flex-col gap-1">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <TooltipProvider key={item.href}>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                'group/item flex h-9 w-full items-center justify-start rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                                isCollapsed && 'justify-center px-2'
                              )}
                            >
                              <span className={cn(
                                'flex items-center',
                                isCollapsed ? 'w-5 h-5' : 'w-full'
                              )}>
                                {item.icon}
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <Badge variant="outline" className="ml-auto">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </span>
                            </Link>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" className="flex items-center gap-4">
                              {item.title}
                              {item.badge && (
                                <Badge variant="outline">{item.badge}</Badge>
                              )}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
