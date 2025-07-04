import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "./lib/supabaseClient";

import { Sidebar } from "./components/ui/sidebar";
import { Navbar } from "./components/ui/navbar";
import { FloatingActionButton } from "./components/ui/floating-action-button";
import { WorkspaceHeader } from "./components/workspace/workspace-header";
import { WorkspaceTabs } from "./components/workspace/workspace-tabs";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import Files from "./pages/Files";
import Invoices from "./pages/Invoices";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const { getClient } = useSupabaseClient();
  const { user } = useUser();

  // ✅ Sync Clerk user to Supabase
  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const supabase = await getClient(); // 👈 correctly await the client

      const { error } = await supabase.from("users").upsert({
        clerk_id: user.id,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        image_url: user.imageUrl || "",
      });

      if (error) {
        console.error("❌ Failed to sync user to Supabase:", error.message);
      } else {
        console.log("✅ User synced to Supabase");
      }
    };

    syncUser();
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <Tasks />;
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
      case "profile":
        return <Profile />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      case "workspace":
        return (
          <>
            <WorkspaceHeader />
            <div className="flex-1 overflow-auto">
              <WorkspaceTabs />
            </div>
          </>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex flex-col flex-1 min-w-0 border-l border-border">
        <Navbar onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
        <FloatingActionButton />
      </div>
    </div>
  );
}
