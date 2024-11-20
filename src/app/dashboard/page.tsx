import { UserProfile } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Welcome to Grid</h1>
          <p className="text-muted-foreground">
            Your hub for Solana community collaboration. Get started by completing
            your profile and exploring projects.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Projects" value="0" />
            <StatCard title="Collaborations" value="0" />
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
