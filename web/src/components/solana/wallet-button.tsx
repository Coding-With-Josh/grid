"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { publicKey, disconnect } = useWallet();

  if (!publicKey) {
    return <WalletMultiButton className="btn" />;
  }

  return (
    <Button
      onClick={() => disconnect()}
      className="px-4 py-2"
    >
      Disconnect {publicKey.toBase58().slice(0, 4)}...
      {publicKey.toBase58().slice(-4)}
    </Button>
  );
}
