import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import TopNavbar from "./top-navbar";
import {
  Home,
  Link as LinkIcon,
  PlusCircle,
  PieChart,
  Settings,
  RefreshCcw,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        onClick={onClick}
        className={cn(
          "flex items-center px-2 py-2 text-sm font-medium rounded-md",
          isActive
            ? "bg-primary-50 text-primary-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <span className={cn("mr-3", isActive ? "text-primary-500" : "text-gray-500")}>{icon}</span>
        {label}
      </a>
    </Link>
  );
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : user?.username?.substring(0, 2).toUpperCase() || "U";

  const navItems = [
    { href: "/", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/linked-accounts", icon: <LinkIcon size={20} />, label: "Linked Accounts" },
    { href: "/transactions", icon: <RefreshCcw size={20} />, label: "Transactions" },
    { href: "/investments", icon: <TrendingUp size={20} />, label: "Investments" },
    { href: "/account-setup", icon: <PlusCircle size={20} />, label: "Add Account" },
    { href: "/reports", icon: <PieChart size={20} />, label: "Reports & Insights" },
    { href: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const supportNavItems = [
    { href: "#", icon: <HelpCircle size={20} />, label: "Help Center" },
    { href: "#", icon: <ShieldAlert size={20} />, label: "Security" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar 
        onMobileMenuToggle={toggleMobileMenu} 
        userInitials={userInitials} 
        username={user?.firstName || user?.username || ""} 
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <ScrollArea className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={location === item.href}
                  />
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Support
                  </h3>
                  {supportNavItems.map((item) => (
                    <NavItem
                      key={item.label}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={location === item.href}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobileMenu}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={closeMobileMenu}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="flex items-center">
                    <div className="bg-primary-500 rounded-full p-2 mr-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary">{userInitials}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="font-semibold text-lg">Financial Aggregator</span>
                  </div>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={location === item.href}
                      onClick={closeMobileMenu}
                    />
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary">{userInitials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">{user?.firstName} {user?.lastName || ""}</p>
                    <p className="text-sm font-medium text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
