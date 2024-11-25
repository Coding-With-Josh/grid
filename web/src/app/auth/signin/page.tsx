'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import { ButtonLoader } from "@/components/ui/button-loader";
import { toast } from "sonner";

function SignInContent() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/onboarding';

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(provider);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-[#14F195]/10">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-primary">
              Welcome to Grid
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to get started
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full border-border/40 hover:border-[#14F195] hover:bg-[#14F195]/10 hover:text-[#14F195] transition-colors"
            onClick={() => handleSignIn('github')}
            disabled={!!isLoading}
          >
            {isLoading === 'github' ? (
              <ButtonLoader text="Connecting to GitHub..." />
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                Continue with Github
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            className="w-full border-border/40 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
            onClick={() => handleSignIn('google')}
            disabled={!!isLoading}
          >
            {isLoading === 'google' ? (
              <ButtonLoader text="Connecting to Google..." />
            ) : (
              <>
                <Image src="/icons/google.svg" alt="Google" width={16} height={16} className="mr-2" />
                Continue with Google
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            className="w-full border-border/40 hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-400 transition-colors"
            onClick={() => handleSignIn('twitter')}
            disabled={!!isLoading}
          >
            {isLoading === 'twitter' ? (
              <ButtonLoader text="Connecting to X..." />
            ) : (
              <>
                <Twitter className="mr-2 h-4 w-4" />
                Continue with X (Twitter)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <ButtonLoader text="Loading..." />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
