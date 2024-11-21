import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { Providers } from "@/providers/providers";
import { ClerkProvider } from "@clerk/nextjs";

const font = Nunito({ subsets: ['latin'] });

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
      <body className={font.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarWrapper />
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
