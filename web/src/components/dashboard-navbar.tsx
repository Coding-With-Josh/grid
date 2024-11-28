'use client';

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import "@/styles/wallet.css";
import { ProfileDropdown } from "./profile-dropdown";
import { NotificationsDropdown } from "./notifications-dropdown";
import Image from "next/image";

export function DashboardNavbar() {
  return (
    <>
      <nav className="fixed top-0 right-0 w-[calc(100%-256px)] border-b border-border/40 bg-background/45 backdrop-blur supports-[backdrop-filter]:bg-background/35 z-50 ">
        <div className="container flex h-20 items-center justify-between px-6">
        <div className="px-6 py-4"> 
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="Grid Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-[#9945FF] font-bold text-xl">
                    Grid
                  </span>
                </Link>
              </div>
          <div className="ml-auto flex items-center h-full justify-center gap-6">
            <NotificationsDropdown/>
            <ModeToggle />
            <WalletMultiButton />
            <ProfileDropdown/>
          </div>
        </div>
      </nav>
      <div className="h-20" /> {/* Increased spacer height to match navbar */}
    </>
  );
}
