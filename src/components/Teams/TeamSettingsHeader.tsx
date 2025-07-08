import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { UserPlus, ChevronDown, Users } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  memberCount: number;
}

interface TeamSettingsHeaderProps {
  onInviteClick: () => void;
  projects: Project[];
  selectedProjectId: string | null;
  onProjectChange: (projectId: string) => void;
}

export function TeamSettingsHeader({
  onInviteClick,
  projects,
  selectedProjectId,
  onProjectChange,
}: TeamSettingsHeaderProps) {
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "completed":
        return "bg-primary/10 text-primary";
      case "on-hold":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground line-clamp-1 max-w-[300px]">
                {selectedProject
                  ? `${selectedProject.name}`
                  : "Team Settings"}
              </h1>
            </div>
            {selectedProject && (
              <Badge
                variant="secondary"
                className={getStatusColor(selectedProject.status)}
              >
                {selectedProject.status}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {selectedProject
              ? `Manage team members and permissions for ${selectedProject.name}`
              : "Select a project to manage team members and their permissions"}
          </p>
        </div>

        {/* Right: Select + Button */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedProjectId || ""}
            onValueChange={onProjectChange}
          >
            <SelectTrigger className="w-52 truncate">
              <SelectValue
                placeholder="Select project"
                className="truncate text-left"
              />
              <ChevronDown className="w-4 h-4 ml-2" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <span className="truncate block max-w-full">
                    {project.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={onInviteClick}
            className="bg-primary hover:bg-primary-600"
            disabled={!selectedProjectId}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>
    </div>
  );
}
