import { SignIn } from "@clerk/nextjs";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12">
          <h1 className="text-6xl font-bold text-foreground tracking-tight">
            Grid
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            A unified platform for the Solana community. Connect, collaborate, and create with developers, designers, writers, and creators.
          </p>
          
          <div className="flex gap-4">
            <WalletMultiButton className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" />
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              title="For Developers"
              description="Build smart contracts, dApps, and blockchain integrations. Collaborate with designers and creators."
            />
            <FeatureCard
              title="For Designers"
              description="Create stunning UI/UX designs for web3 projects. Work directly with developers and creators."
            />
            <FeatureCard
              title="For Creators"
              description="Monetize your NFTs, digital art, music, and videos. Connect with the right audience."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
