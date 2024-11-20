import { UserButton } from "@clerk/nextjs";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold">
              Grid
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/dashboard/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                Explore
              </Link>
              <Link href="/dashboard/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                Learn
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <WalletMultiButton className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
