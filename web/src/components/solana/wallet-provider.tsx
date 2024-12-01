"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useEffect, useMemo, useState } from "react";
import { networkConfig, SOLANA_NETWORK } from "@/lib/solana/config";
import { clusterApiUrl, Connection } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = SOLANA_NETWORK as "devnet" | "testnet" | "mainnet-beta";
  const [endpoint, setEndpoint] = useState<string>(networkConfig.endpoint);
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        const connection = new Connection(networkConfig.endpoint);
        await connection.getVersion();
        setEndpoint(networkConfig.endpoint);
      } catch (error) {
        console.error("Failed to connect to SOON RPC:", error);
        setEndpoint(clusterApiUrl(network));
      }
    };
    
    testConnection();
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
