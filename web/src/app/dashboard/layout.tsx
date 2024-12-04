import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserNav } from '@/components/dashboard/user-nav';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardNavbar } from '@/components/dashboard-navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-background">
          {/* <div className="flex h-16 items-center border-b px-4">
            <div className="flex flex-1 items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <DashboardNavbar />
              </div>
            </div>
          </div> */}
          <div className="flex-1 space-y-4 p-8 pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
