import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeToggle } from "../ui/theme-toggle";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Input } from "../ui/input";

export function Navbar() {
  return (
    <header className="h-16 bg-white dark:bg-[#121212] text-black dark:text-white border-b border-border px-6 flex items-center justify-between">
      {/* Left - Logo Placeholder */}
      <div />

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, files, or team members..."
            className="pl-9 bg-muted/50 text-white placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="relative text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="sm" className="text-white">
          <HelpCircle className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-white"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="/api/placeholder/24/24" alt="John Doe" />
                <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">
                  john.doe@company.com
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
