'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { DashboardNavbar } from './dashboard-navbar';

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.endsWith('/editor');
  const hideNavbarPaths = ['/onboarding'];

  // Don't show any navigation for editor pages
  if (isEditorPage) {
    return <>{children}</>;
  }

  if (hideNavbarPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (pathname.startsWith('/dashboard')) {
    return (
      <>
        <DashboardNavbar />
        {children}
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
