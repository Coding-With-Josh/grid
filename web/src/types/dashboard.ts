import { LucideIcon } from 'lucide-react';

export type UserRole = 'developer' | 'designer' | 'creator' | 'admin';

export interface SidebarItem {
  title: string;
  href: string;
  icon: JSX.Element;
  badge?: string;
  roles?: UserRole[];
}

export interface SidebarSection {
  section: string;
  items: SidebarItem[];
  roles?: UserRole[];
}
