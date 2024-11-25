import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero Section */}
        <div className="hidden md:flex flex-col gap-6 p-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back to Grid
            </h1>
            <p className="text-muted-foreground text-lg">
              Connect with the Solana community. Build, design, and create together.
            </p>
          </div>
          
          {/* Feature list */}
          <div className="space-y-4 mt-8">
            <FeatureItem
              title="Web3 Native"
              description="Sign in with your Solana wallet or traditional methods"
            />
            <FeatureItem
              title="Community Driven"
              description="Join a thriving ecosystem of creators and builders"
            />
            <FeatureItem
              title="Secure & Trustless"
              description="Your data and assets are always under your control"
            />
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div className="bg-card border border-border p-8 rounded-xl shadow-2xl">
          <SignIn 
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

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 p-2 rounded-full bg-primary/10">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
