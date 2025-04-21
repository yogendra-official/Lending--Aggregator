import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, ChevronDown } from "lucide-react";

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
  userInitials: string;
  username: string;
  onLogout: () => void;
}

export default function TopNavbar({ 
  onMobileMenuToggle, 
  userInitials, 
  username, 
  onLogout 
}: TopNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onMobileMenuToggle}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <div className="bg-primary rounded-full p-2 mr-2">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18.97 19.757a1 1 0 0 1-1.213.727l-3.5-1.166a1 1 0 0 0-.632 0l-3.5 1.166a1 1 0 0 1-1.213-.727l-.544-2.722a1 1 0 0 0-.3-.51L6.03 14.242a1 1 0 0 1 0-1.484l2.039-2.083a1 1 0 0 0 .3-.51l.544-2.722a1 1 0 0 1 1.213-.727l3.5 1.166a1 1 0 0 0 .632 0l3.5-1.166a1 1 0 0 1 1.213.727l.544 2.722a1 1 0 0 0 .3.51l2.039 2.083a1 1 0 0 1 0 1.484l-2.039 2.083a1 1 0 0 0-.3.51l-.544 2.722Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="font-semibold text-lg hidden sm:block">Financial Aggregator</span>
                </div>
              </a>
            </Link>
          </div>

          {/* User dropdown and notifications */}
          <div className="flex items-center">
            {/* Notifications */}
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto py-2">
                  <Link href="/notifications">
                    <a className="px-4 py-2 text-sm hover:bg-gray-100 block">
                      <div className="font-medium">Account synced</div>
                      <div className="text-gray-500 text-xs mt-1">Your Chase account was successfully synced</div>
                    </a>
                  </Link>
                  <Link href="/notifications">
                    <a className="px-4 py-2 text-sm hover:bg-gray-100 block">
                      <div className="font-medium">Large transaction detected</div>
                      <div className="text-gray-500 text-xs mt-1">A transaction over $500 was recorded</div>
                    </a>
                  </Link>
                </div>
                <DropdownMenuSeparator />
                <Link href="/notifications">
                  <a className="px-4 py-2 text-sm text-primary hover:bg-gray-100 block text-center">
                    View all notifications
                  </a>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User dropdown */}
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarFallback className="bg-primary text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">
                      {username}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      Your Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
