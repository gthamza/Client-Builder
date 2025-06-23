import React, { useState } from "react";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";

interface NavbarProps {
  onSignOut?: () => void;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignOut, setCurrentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 🔁 Clickable logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
          onClick={() => setCurrentPage("dashboard")}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CP</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Client Portal</h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <UserButton />
            <span className="text-sm font-medium text-gray-700">
              {user?.fullName ||
                user?.primaryEmailAddress?.emailAddress ||
                "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setCurrentPage("settings");
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={async () => {
                  setDropdownOpen(false);
                  await signOut();
                  window.location.replace("/"); // Full page reload
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
