import { UserNav } from "@/components/dashboard/user-nav";
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          className="mr-2 px-2 hover:bg-transparent lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Grid AI Platform
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <NotificationsDropdown />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
