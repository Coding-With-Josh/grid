'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { DashboardNavbar } from './dashboard-navbar';

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashpo = pathname.startsWith("/dashboard/dev/projects")
  const hideNavbarPaths = ['/onboarding'];

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
      {pathname.includes("/dashboard/dev/projects") ? (
        <>
          {children}
        </>
      ) : (
        <>
          <Navbar />
          {children}
        </>
      )}

    </>
  );
}
