'use client';

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import "@/styles/wallet.css";
import { ProfileDropdown } from "./profile-dropdown";
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown";
import Image from "next/image";

  /**
   * Renders the navbar for the dashboard.
   *
   * This component is special because it uses the `use client` directive, which
   * allows it to be server-side rendered. This is necessary because the navbar
   * needs to be rendered on the server in order for the wallet adapter to work
   * properly.
   *
   * The navbar is fixed to the top of the page and has a width of `calc(100% -
   * 256px)`, which is the width of the sidebar. It also has a border at the
   * bottom.
   *
   * The navbar contains a logo, a mode toggle, a wallet multi button, and a
   * profile dropdown. The logo is a link to the dashboard, and the other
   * components are rendered in the order they are listed.
   *
   * The navbar also renders a spacer element with a height of 20px, which is
   * necessary to account for the height of the navbar.
   */
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
