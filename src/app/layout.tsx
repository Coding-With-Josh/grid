import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import "./globals.css";
require("@solana/wallet-adapter-react-ui/styles.css");

const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

export const metadata: Metadata = {
  title: "Grid - Solana Community Hub",
  description: "A unified platform for the Solana community to connect, collaborate, and create.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <ClerkProvider>
          <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                {children}
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
