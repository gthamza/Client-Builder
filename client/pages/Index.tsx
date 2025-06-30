import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceTabs } from "@/components/workspace/workspace-tabs";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Workspace Header */}
          <WorkspaceHeader />

          {/* Workspace Content */}
          <div className="flex-1 overflow-auto">
            <WorkspaceTabs />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
