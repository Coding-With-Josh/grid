'use client';

import { UserButton } from "@clerk/nextjs";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const WalletButton = () => {
  return <WalletMultiButton />;
};

const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Community', href: '/dashboard/community', icon: Users },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform
        lg:translate-x-0 border-r border-border bg-card/50 backdrop-blur-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/dashboard" className="text-xl font-bold">
              Grid
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                    transition-colors hover:bg-accent
                    ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
                  `}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-4">
            <div className="flex items-center gap-4">
              <WalletButton />
              <ThemeToggle />
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        lg:ml-64 min-h-screen
        transition-[margin] duration-200
      `}>
        <div className="container p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
