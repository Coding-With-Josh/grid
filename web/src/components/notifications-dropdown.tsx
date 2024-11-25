'use client';

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Design Assets',
    description: 'Fresh UI kit components are now available',
    time: '5m ago',
    type: 'info',
    read: false,
  },
  {
    id: '2',
    title: 'Project Update',
    description: 'Development milestone achieved',
    time: '1h ago',
    type: 'success',
    read: false,
  },
  {
    id: '3',
    title: 'Security Alert',
    description: 'Unusual login attempt detected',
    time: '2h ago',
    type: 'warning',
    read: true,
  },
];

const typeStyles = {
  success: 'bg-green-500/15 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  error: 'bg-red-500/15 text-red-700 dark:text-red-400',
  info: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
};

export function NotificationsDropdown() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 justify-center bg-red-500 text-white"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notifications</p>
            <p className="text-xs leading-none text-muted-foreground">
              You have {unreadCount} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
              <div className={cn(
                'w-full rounded-lg p-2',
                typeStyles[notification.type],
                !notification.read && 'font-medium'
              )}>
                <div className="flex justify-between gap-4">
                  <span className="text-sm">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center cursor-pointer">
          <span className="w-full text-center text-sm">View all notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
