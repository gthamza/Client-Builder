import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useSignIn,
  useUser,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./components/pages/Dashboard";
import Projects from "./components/pages/Projects";
import Clients from "./components/pages/Clients";
import Files from "./components/pages/Files";
import Invoices from "./components/pages/Invoices";
import Chat from "./components/pages/Chat";
import Settings from "./components/pages/Settings";

import { useSupabaseClient } from "./lib/supabaseClient";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const { handleRedirectCallback } = useSignIn();
  const { user } = useUser();
  const { getClient } = useSupabaseClient(); // ✅ Clerk-authenticated Supabase

  // ✅ Handle OAuth redirect
  useEffect(() => {
    const completeOAuth = async () => {
      if (window.location.search.includes("__clerk")) {
        try {
          const result = await handleRedirectCallback();
          console.log("✅ OAuth complete:", result);
          window.history.replaceState({}, document.title, "/");
        } catch (err) {
          console.error("❌ OAuth redirect error:", err);
        }
      }
    };

    completeOAuth();
  }, [handleRedirectCallback]);

  // ✅ Sync Clerk user to Supabase
  useEffect(() => {
    const insertUserToSupabase = async () => {
      if (!user) return;

      const supabase = await getClient();

      const clerkId = user.id.trim();
      const name = user.firstName || "";
      const email = user.primaryEmailAddress?.emailAddress || "";

      try {
        const { error: insertError } = await supabase.from("users").upsert(
          [
            {
              clerk_id: clerkId,
              name,
              email,
            },
          ],
          { onConflict: "clerk_id" }
        );

        if (insertError) {
          console.error("❌ Supabase upsert error:", insertError.message);
        } else {
          console.log("✅ User synced to Supabase");
        }
      } catch (error) {
        console.error("❌ Supabase user sync error:", error);
      }
    };

    insertUserToSupabase();
  }, [user, getClient]);

  // ✅ Render current page based on sidebar
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "projects":
        return <Projects />;
      case "clients":
        return <Clients />;
      case "files":
        return <Files />;
      case "invoices":
        return <Invoices />;
      case "chat":
        return <Chat />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <SignedOut>
        {authMode === "signin" ? (
          <SignIn
            routing="path"
            path="/sign-in"
            redirectUrl="/"
            afterSignIn={() => setAuthMode("signin")}
            appearance={{ variables: { colorPrimary: "#3b82f6" } }}
          />
        ) : (
          <SignUp
            routing="path"
            path="/sign-up"
            redirectUrl="/"
            afterSignUp={() => setAuthMode("signin")}
            appearance={{ variables: { colorPrimary: "#3b82f6" } }}
          />
        )}
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <Navbar onSignOut={() => window.location.reload()} />
          <div className="flex">
            <Sidebar
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
            <main
              className={`flex-1 transition-all duration-300 ${
                sidebarCollapsed ? "ml-16" : "ml-64"
              }`}
            >
              <div className="p-6">{renderCurrentPage()}</div>
            </main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default App;
