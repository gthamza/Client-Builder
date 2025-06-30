import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";

// Pages
import Index from "./App"; // Main dashboard after login
import NotFound from "./pages/NotFound";
import CustomSignUp from "./pages/Auth/SignUp";
import CustomSignIn from "./pages/Auth/SignIn";
import Landing from "./pages/Landing";

// Setup Query Client
const queryClient = new QueryClient();

// Clerk Frontend API Key
const clerkFrontendApi =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "your-clerk-frontend-api-key";

// 🔒 Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// 🔄 Landing Redirector Logic
function LandingRedirector() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (isSignedIn) {
    return <Navigate to="/app" replace />;
  }

  return <Landing />;
}

// App Component
const App = () => (
  <ClerkProvider publishableKey={clerkFrontendApi}>
    <ThemeProvider defaultTheme="light" storageKey="clienthub-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingRedirector />} />
              <Route path="/sign-in/*" element={<CustomSignIn />} />
              <Route path="/sign-up/*" element={<CustomSignUp />} />

              {/* Protected Routes */}
              <Route
                path="/app/*"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ClerkProvider>
);

// Render React App
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
