import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { Providers } from "@/providers/providers";
import AuthProvider from '@/components/providers/AuthProvider';
import { SolanaWalletProvider } from "@/components/solana/wallet-provider";
import { CustomWalletProvider } from "@/components/wallet/wallet-provider";

const nunitoSans = localFont({
  src: "./fonts/NunitoSans_7pt-Light.ttf",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: 'Grid - Solana Community Platform',
  description: 'Connect, collaborate, and create with the Solana community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={nunitoSans.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <SolanaWalletProvider>
                <CustomWalletProvider>
                  <NavbarWrapper>{children}</NavbarWrapper>
                </CustomWalletProvider>
              </SolanaWalletProvider>
            </Providers>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
