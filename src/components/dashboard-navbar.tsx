'use client';

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import "@/styles/wallet.css";

export function DashboardNavbar() {
  return (
    <>
      <nav className="fixed top-0 right-0 w-[calc(100%-256px)] border-b border-border/40 bg-background/45 backdrop-blur supports-[backdrop-filter]:bg-background/35 z-50">
        <div className="flex h-16 items-center justify-between px-8 bg-background/45 backdrop-blur supports-[backdrop-filter]:bg-background/35">
          <Link href="/dashboard" className="flex items-center gap-2">
          {/* <Image
              src="/logo.png"
              alt="Grid Logo"
              width={32}
              height={32}
              className="rounded-full"
            /> */}
            {/* <span className="font-bold text-xl">Grid</span> */}
          </Link>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <WalletMultiButton />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-[32px] h-[32px]",
                },
              }}
            />
          </div>
        </div>
      </nav>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
    </>
  );
}
