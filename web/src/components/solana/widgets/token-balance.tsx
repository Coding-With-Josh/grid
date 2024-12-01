import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { cn } from "@/lib/utils";

interface TokenBalanceProps {
  mint: string;
  showSymbol?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function TokenBalance({ mint, showSymbol = true, showIcon = true, className }: TokenBalanceProps) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTokenBalance() {
      if (!publicKey || !mint) return;

      try {
        setLoading(true);
        const mintPubkey = new PublicKey(mint);
        const tokenAccount = await getAssociatedTokenAddress(mintPubkey, publicKey);
        const account = await getAccount(connection, tokenAccount);
        
        // Get token metadata for symbol
        // This is a simplified version - you might want to use Metaplex for full metadata
        setBalance(account.amount.toString());
        setSymbol("TOKEN"); // Replace with actual token symbol lookup
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setBalance("0");
      } finally {
        setLoading(false);
      }
    }

    getTokenBalance();
  }, [connection, publicKey, mint]);

  if (!publicKey) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        Please connect your wallet
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        Loading...
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {showIcon && <div className="w-5 h-5 rounded-full bg-primary/20" />}
      <span>{balance}</span>
      {showSymbol && <span>{symbol}</span>}
    </div>
  );
}
