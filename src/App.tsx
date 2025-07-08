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
import TeamSettings from "./pages/TeamSettings";
export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const { getClient } = useSupabaseClient();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  // ✅ Sync Clerk user to Supabase
  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const supabase = await getClient();
        const clerkId = user.id.split(":")[0];

        // Safely get the user
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkId);

        if (fetchError) throw new Error(fetchError.message);

        const existingUser = data?.[0];

        if (existingUser) {
          // Update user
          const { error: updateError } = await supabase
            .from("users")
            .update({
              name: user.fullName || "",
              email: user.primaryEmailAddress?.emailAddress || "",
              image_url: user.imageUrl || "",
            })
            .eq("clerk_id", clerkId);

          if (updateError) throw new Error(updateError.message);
        } else {
          // Insert user
          const { error: insertError } = await supabase.from("users").insert({
            clerk_id: clerkId,
            name: user.fullName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
            image_url: user.imageUrl || "",
          });

          if (insertError) throw new Error(insertError.message);
        }

        console.log("✅ User synced to Supabase");
      } catch (err: any) {
        console.error("❌ Failed to sync user to Supabase:", err.message);
        setError("Failed to sync user. Please try again later.");
      } finally {
        setIsLoading(false);
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
      case "team":
        return <TeamSettings />;
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
