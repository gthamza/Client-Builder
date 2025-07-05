import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { ChevronDown, Plus } from "lucide-react";
import {
  AddProjectModal,
  ProjectFormData,
} from "../../components/workspace/add-project-modal";

export function WorkspaceHeader() {
  const [showAddProject, setShowAddProject] = useState(false);

  // 🧪 Dummy projects
  const [projects, setProjects] = useState<any[]>([
    {
      id: "1",
      name: "Dummy Project A",
      status: "In Progress",
      description: "This is a sample project in progress.",
    },
    {
      id: "2",
      name: "Dummy Project B",
      status: "Completed",
      description: "This project is done.",
    },
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    "1"
  );
  const { toast } = useToast();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Review":
        return "bg-yellow-100 text-yellow-700";
      case "Not Started":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Dummy project submit handler
  const handleCreateProject = (data: ProjectFormData) => {
    const newProject = {
      id: (projects.length + 1).toString(),
      name: data.name,
      description: data.description || "No description",
      status: data.status || "Not Started",
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setShowAddProject(false);

    toast({
      title: "Project Created",
      description: `${data.name} has been added.`,
    });
  };

  return (
    <>
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                {selectedProject?.name || "No Project Selected"}
              </h1>
              {selectedProject?.status && (
                <Badge
                  variant="secondary"
                  className={getStatusColor(selectedProject.status)}
                >
                  {selectedProject.status}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {selectedProject?.description ||
                "Select a project to view details"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              value={selectedProjectId || ""}
              onValueChange={(value) => setSelectedProjectId(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select project" />
                <ChevronDown className="w-4 h-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="bg-primary hover:bg-primary-600"
              onClick={() => setShowAddProject(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          </div>
        </div>
      </div>

      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onSubmit={handleCreateProject}
      />
    </>
  );
}
