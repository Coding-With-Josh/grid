import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero Section */}
        <div className="hidden md:flex flex-col gap-6 p-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              Join the Grid Community
            </h1>
            <p className="text-muted-foreground text-lg">
              Connect, collaborate, and create with the Solana ecosystem.
            </p>
          </div>
          
          {/* Role selection */}
          <div className="space-y-4 mt-8">
            <RoleCard
              title="Developer"
              description="Build smart contracts, dApps, and blockchain integrations"
              icon="👨‍💻"
            />
            <RoleCard
              title="Designer"
              description="Create stunning UI/UX for web3 projects"
              icon="🎨"
            />
            <RoleCard
              title="Creator"
              description="Mint NFTs, share content, and build your audience"
              icon="✨"
            />
            <RoleCard
              title="Writer"
              description="Create technical content and documentation"
              icon="✍️"
            />
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="bg-card border border-border p-8 rounded-xl shadow-2xl">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                card: "bg-transparent shadow-none",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: 
                  "bg-card border border-border text-foreground hover:bg-muted",
                formFieldLabel: "text-foreground",
                formFieldInput: 
                  "bg-background border border-border text-foreground",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                footer: "hidden"
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex gap-4 items-start group cursor-pointer">
      <div className="mt-1 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
