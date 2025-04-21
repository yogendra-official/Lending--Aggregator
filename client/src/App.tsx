import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";  // Using original auth page
import SimpleAuthPage from "@/pages/simple-auth";  // Our simplified auth page
import TestForm from "@/pages/test-form";  // Our test form component
import DashboardPage from "@/pages/dashboard-page";
import LinkedAccountsPage from "@/pages/linked-accounts-page";
import TransactionsPage from "@/pages/transactions-page";
import AccountSetupPage from "@/pages/account-setup-page";
import ReportsPage from "@/pages/reports-page";
import SettingsPage from "@/pages/settings-page";
import NotificationsPage from "@/pages/notifications-page";
import InvestmentsPage from "@/pages/investments-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { SpringAuthProvider } from "./hooks/use-spring-auth";
import { CursorEffect } from "@/components/ui/cursor-effect";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={SimpleAuthPage} /> {/* Now using our simplified auth page */}
      <Route path="/original-auth" component={AuthPage} /> {/* Original auth kept as backup */}
      <Route path="/test-form" component={TestForm} /> {/* Our test form - not protected */}
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/linked-accounts" component={LinkedAccountsPage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/account-setup" component={AccountSetupPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/notifications" component={NotificationsPage} />
      <ProtectedRoute path="/investments" component={InvestmentsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check if we should use Spring Boot backend
  const useSpringBoot = import.meta.env.VITE_USE_SPRING_BOOT === 'true';
  
  return (
    <QueryClientProvider client={queryClient}>
      {useSpringBoot ? (
        <SpringAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SpringAuthProvider>
      ) : (
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      )}
    </QueryClientProvider>
  );
}

export default App;
