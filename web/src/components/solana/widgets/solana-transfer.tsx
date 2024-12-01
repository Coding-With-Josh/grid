import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SolanaTransferProps {
  recipient: string;
  amount: string;
  mint?: string;  // If provided, transfer SPL token. If not, transfer SOL
  className?: string;
}

export function SolanaTransfer({ recipient, amount, mint, className }: SolanaTransferProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  async function handleTransfer() {
    if (!publicKey || !recipient || !amount) return;

    try {
      setLoading(true);
      const recipientPubkey = new PublicKey(recipient);
      const transaction = new Transaction();

      if (mint) {
        // SPL Token Transfer
        const mintPubkey = new PublicKey(mint);
        const senderATA = await getAssociatedTokenAddress(mintPubkey, publicKey);
        const recipientATA = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

        transaction.add(
          createTransferInstruction(
            senderATA,
            recipientATA,
            publicKey,
            BigInt(amount)
          )
        );
      } else {
        // SOL Transfer
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports: LAMPORTS_PER_SOL * parseFloat(amount)
          })
        );
      }

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      // Show success message
      console.log("Transfer successful:", signature);
    } catch (error) {
      console.error("Transfer failed:", error);
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
      <div className="space-y-2">
        <Input
          value={recipient}
          placeholder="Recipient Address"
          disabled
        />
        <Input
          value={amount}
          placeholder="Amount"
          type="number"
          disabled
        />
      </div>
      <Button
        onClick={handleTransfer}
        disabled={loading || !recipient || !amount}
        className="w-full"
      >
        {loading ? "Processing..." : `Send ${mint ? "Tokens" : "SOL"}`}
      </Button>
    </div>
  );
}
