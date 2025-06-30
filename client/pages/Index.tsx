import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceTabs } from "@/components/workspace/workspace-tabs";
import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
import Projects from "./Projects";
import Clients from "./Clients";
import Files from "./Files";
import Invoices from "./Invoices";
import Chat from "./Chat";
import Analytics from "./Analytics";
import Settings from "./Settings";

export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">{renderContent()}</div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
