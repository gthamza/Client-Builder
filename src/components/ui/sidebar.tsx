import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  Settings,
  User,
  LogOut,
  ChevronRight,
  CheckSquare,
  Users,
  Upload,
  Receipt,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import {
  AddProjectModal,
  ProjectFormData,
} from "../workspace/add-project-modal";
import { useToast } from "../../hooks/use-toast";
import { useUser, useClerk } from "@clerk/clerk-react";

interface SidebarProps {
  className?: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { name: "Workspace", icon: FolderKanban, key: "workspace" },
  { name: "Add Project", icon: Plus, key: "add-project", isAction: true },
  { name: "Tasks", icon: CheckSquare, key: "tasks" },
  { name: "Projects", icon: FolderKanban, key: "projects" },
  { name: "Clients", icon: Users, key: "clients" },
  { name: "Files", icon: Upload, key: "files" },
  { name: "Invoices", icon: Receipt, key: "invoices" },
  { name: "Chat", icon: MessageSquare, key: "chat" },
  { name: "Analytics", icon: BarChart3, key: "analytics" },
  { name: "Settings", icon: Settings, key: "settings" },
];

export function Sidebar({
  className,
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const { toast } = useToast();

  // Clerk hooks to get user info and sign out function
  const { user } = useUser();
  const { signOut } = useClerk();
  // use user.imageUrl() to get profile picture URL
  const profileImageUrl = user?.imageUrl;

  const handleCreateProject = async (projectData: ProjectFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Project Created",
      description: `${projectData.name} has been created successfully.`,
    });

    console.log("Created project:", projectData);
  };

  const handleNavClick = (item: any) => {
    if (item.isAction && item.key === "add-project") {
      setShowAddProject(true);
    } else {
      onSectionChange(item.key);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 min-h-0",
        collapsed ? "w-16" : "w-80",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
  {!collapsed && (
    <div className="flex items-center gap-x-2">
      <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
        <FolderKanban className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="font-semibold text-lg select-none">ClientHub</span>
    </div>
  )}
  <Button
    variant="ghost"
    size="icon"
    className="text-sidebar-foreground hover:bg-sidebar-accent p-1 h-8 w-8"
    onClick={() => setCollapsed(!collapsed)}
    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    <ChevronRight
      className={cn(
        "w-4 h-4 transition-transform",
        collapsed ? "rotate-0" : "rotate-180"
      )}
    />
  </Button>
</div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center space-x-0"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>
      {/* User Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center space-x-3",
            collapsed && "justify-center space-x-0"
          )}
        >
          {!collapsed && profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={user?.fullName || "User avatar"}
              className="w-10 h-10 rounded-full object-cover select-none"
            />
          ) : (
            <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center select-none">
              <User className="w-5 h-5 text-primary-700" />
            </div>
          )}

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium text-sidebar-foreground truncate"
                title={user?.fullName || user?.firstName || "User"}
              >
                {user?.fullName || user?.firstName || "User"}
              </div>
              <div
                className="text-xs text-sidebar-foreground/70 truncate"
                title={user?.emailAddresses?.[0]?.emailAddress || ""}
              >
                {user?.emailAddresses?.[0]?.emailAddress || ""}
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            className="w-full mt-3 justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        )}
      </div>

      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
