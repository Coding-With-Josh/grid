"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  Keypair,
  SYSVAR_RENT_PUBKEY,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction
} from "@solana/spl-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

interface TokenMintProps {
  className?: string;
}

export function TokenMint({ className }: TokenMintProps) {
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  const [supply, setSupply] = useState("1000000");
  const [decimals, setDecimals] = useState("9");
  const [isLoading, setIsLoading] = useState(false);

  const handleMint = async () => {
    if (!publicKey || !signTransaction) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to mint tokens",
      });
      return;
    }

    try {
      setIsLoading(true);
      toast({
        title: "Creating token...",
        description: "Please approve the transaction in your wallet",
      });

      // Connect to devnet
      const connection = new Connection("https://rpc.devnet.soo.network/rpc");

      // Generate a new mint keypair
      const mintKeypair = Keypair.generate();
      const mintPubkey = mintKeypair.publicKey;

      // Get minimum lamports for mint account
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // Create transaction for token mint
      const transaction = new Transaction();

      // Add instruction to create account for mint
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintPubkey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Add instruction to initialize mint
      transaction.add(
        createInitializeMintInstruction(
          mintPubkey,
          Number(decimals),
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      // Get associated token account for the mint and owner
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      );

      // Add instruction to create associated token account if it doesn't exist
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintPubkey
        )
      );

      // Add instruction to mint tokens
      transaction.add(
        createMintToInstruction(
          mintPubkey,
          associatedTokenAccount,
          publicKey,
          Number(supply) * (10 ** Number(decimals))
        )
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      const signedTx = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      
      toast({
        title: "Transaction sent",
        description: "Confirming transaction...",
      });
      
      await connection.confirmTransaction(signature);

      toast({
        title: "Token created successfully!",
        description: (
          <div className="flex flex-col space-y-2">
            <p>Token mint address:</p>
            <div className="flex items-center space-x-2 text-xs">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono">
                {mintPubkey.toString()}
              </code>
              <a
                href={`https://solscan.io/token/${mintPubkey.toString()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ),
      });

    } catch (error) {
      console.error("Error minting token:", error);
      toast({
        variant: "destructive",
        title: "Error creating token",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Supply</Label>
          <Input
            type="number"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            placeholder="Enter token supply"
          />
        </div>
        <div className="space-y-2">
          <Label>Decimals</Label>
          <Input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            placeholder="Enter decimals (0-9)"
            min="0"
            max="9"
          />
        </div>
        <Button 
          onClick={handleMint} 
          disabled={isLoading || !publicKey}
          className="w-full"
        >
          {isLoading ? "Creating Token..." : "Create Token"}
        </Button>
      </div>
    </div>
  );
}
