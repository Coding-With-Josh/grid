'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Community' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <nav className="container flex h-16 items-center px-8">
        <div className="mr-4 flex">
          <Link 
            href="/" 
            className="mr-6 flex items-center space-x-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-primary"
          >
            GRID
          </Link>

          <div className="hidden md:flex space-x-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-[#14F195] ${
                  pathname === route.href
                    ? 'text-[#14F195]'
                    : 'text-foreground/60'
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hover:text-[#14F195] hover:bg-[#14F195]/10">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium"
            >
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden hover:bg-[#14F195]/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border/40">
              <nav className="flex flex-col space-y-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-[#14F195] ${
                      pathname === route.href
                        ? 'text-[#14F195]'
                        : 'text-foreground/60'
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="w-full hover:text-[#14F195] hover:bg-[#14F195]/10"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium"
                  >
                    <Link href="/onboarding">Get Started</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
