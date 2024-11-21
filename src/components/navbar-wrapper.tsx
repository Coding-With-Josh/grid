'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { DashboardNavbar } from './dashboard-navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbarPaths = ['/onboarding'];
  
  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  if (pathname.startsWith('/dashboard')) {
    return <DashboardNavbar />;
  }
  
  return <Navbar />;
}
