import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  Settings,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import {
  AddProjectModal,
  ProjectFormData,
} from "@/components/workspace/add-project-modal";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "#", active: false },
  { name: "Workspace", icon: FolderKanban, href: "#", active: true },
  { name: "Add Project", icon: Plus, href: "#", active: false, isAction: true },
  { name: "Settings", icon: Settings, href: "#", active: false },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = async (projectData: ProjectFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Project Created",
      description: `${projectData.name} has been created successfully.`,
    });

    console.log("Created project:", projectData);
  };

  const handleNavClick = (item: any) => {
    if (item.isAction && item.name === "Add Project") {
      setShowAddProject(true);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">ClientHub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground hover:bg-sidebar-accent p-1 h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed ? "rotate-0" : "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left",
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center space-x-0",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center space-x-3",
            collapsed && "justify-center space-x-0",
          )}
        >
          <div className="w-8 h-8 bg-primary-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-700" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </div>
              <div className="text-xs text-sidebar-foreground/70 truncate">
                john@example.com
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            className="w-full mt-3 justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
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
