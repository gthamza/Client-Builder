import React, { useState } from "react";
import { Settings, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import logo from "../public/Images/logo.jpg";

type NavbarProps = {
  onSignOut: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage, dark, setDark }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4 backdrop-blur bg-opacity-90 dark:bg-opacity-90">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
          onClick={() => setCurrentPage("dashboard")}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Client Portal
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <UserButton />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.fullName ||
                  user?.primaryEmailAddress?.emailAddress ||
                  "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setCurrentPage("settings");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                {/* Dark mode toggle between Settings and Logout */}
                <button
                  onClick={() => setDark((d) => !d)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  {dark ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  )}
                  <span>{dark ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await signOut();
                    window.location.replace("/"); // Full page reload
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;