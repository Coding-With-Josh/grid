import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TokenMintProps {
  mintAuthority: string;
  decimals: string;
  className?: string;
}

export function TokenMint({ mintAuthority, decimals, className }: TokenMintProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  async function handleMint() {
    if (!publicKey || !signTransaction) return;

    try {
      setLoading(true);
      
      const mint = await createMint(
        connection,
        {
          publicKey,
          signTransaction
        },
        new PublicKey(mintAuthority || publicKey.toString()),
        null, // freeze authority
        parseInt(decimals)
      );

      setMintAddress(mint.toString());
      console.log("Token mint created:", mint.toString());
    } catch (error) {
      console.error("Failed to create mint:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!publicKey) {
    return (
      <div className="text-sm text-muted-foreground">
        Please connect your wallet
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {mintAddress ? (
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm font-medium">Mint Address:</div>
          <div className="text-xs break-all">{mintAddress}</div>
        </div>
      ) : (
        <Button
          onClick={handleMint}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Token Mint"}
        </Button>
      )}
    </div>
  );
}
