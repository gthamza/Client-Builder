import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Plus } from "lucide-react";
import {
  AddProjectModal,
  ProjectFormData,
} from "@/components/workspace/add-project-modal";

export function WorkspaceHeader() {
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

  return (
    <>
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                E-commerce Redesign
              </h1>
              <Badge
                variant="secondary"
                className="bg-accent/10 text-accent-700"
              >
                In Progress
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Complete redesign of the online store interface
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Select defaultValue="current">
              <SelectTrigger className="w-48">
                <SelectValue />
                <ChevronDown className="w-4 h-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">E-commerce Redesign</SelectItem>
                <SelectItem value="project2">Mobile App UI</SelectItem>
                <SelectItem value="project3">Brand Guidelines</SelectItem>
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
