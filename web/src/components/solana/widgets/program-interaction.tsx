import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ProgramInteractionProps {
  programId: string;
  instruction: string;
  className?: string;
}

export function ProgramInteraction({ programId, instruction, className }: ProgramInteractionProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  async function handleInteraction() {
    if (!publicKey || !programId) return;

    try {
      setLoading(true);
      
      // Parse the instruction data
      let instructionData: Buffer;
      try {
        instructionData = Buffer.from(JSON.parse(instruction));
      } catch {
        instructionData = Buffer.from([]);
      }

      const programPubkey = new PublicKey(programId);
      
      const transaction = new Transaction().add(
        new TransactionInstruction({
          keys: [
            {
              pubkey: publicKey,
              isSigner: true,
              isWritable: true,
            },
          ],
          programId: programPubkey,
          data: instructionData,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      console.log("Program interaction successful:", signature);
    } catch (error) {
      console.error("Program interaction failed:", error);
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
        <Textarea
          value={instruction}
          placeholder="Instruction Data (JSON)"
          disabled
          className="h-24"
        />
      </div>
      <Button
        onClick={handleInteraction}
        disabled={loading || !programId}
        className="w-full"
      >
        {loading ? "Processing..." : "Send Instruction"}
      </Button>
    </div>
  );
}
