import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  Receipt,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  collapsed,
  setCollapsed,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "clients", label: "Clients", icon: Users },
    { id: "files", label: "Files", icon: FileText },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`fixed left-0 top-17 h-full bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
