"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { createGreetingAccount } from "@/lib/solana/program";
import { SoonUtils } from "@/lib/solana/soon-utils";

export function ProgramInteraction() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleInteraction = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      // Create greeting account
      const result = await createGreetingAccount(publicKey);
      
      // Get transaction status
      const status = await SoonUtils.getTransactionStatus(result.signature);
      
      toast.success(
        <div className="space-y-2">
          <p>Transaction successful!</p>
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            View on Explorer
          </a>
        </div>
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to interact with the program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Program Interaction</h3>
      <Button
        onClick={handleInteraction}
        disabled={!connected || loading}
        className="w-full"
      >
        {loading ? "Processing..." : "Create Greeting Account"}
      </Button>
      {!connected && (
        <p className="text-sm text-muted-foreground mt-2">
          Connect your wallet to interact with the program
        </p>
      )}
    </Card>
  );
}
