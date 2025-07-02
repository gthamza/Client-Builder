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
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient";

export function WorkspaceHeader() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // 🔁 Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = await getClient();
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("clerk_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Failed to load projects",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id); // default selection
        }
      }
    };

    fetchProjects();
  }, [user]);

  // ✅ Handle Create Project
  const handleCreateProject = async (projectData: ProjectFormData) => {
    const supabase = await getClient();
    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name: projectData.name,
          description: projectData.description,
          client: projectData.client,
          status: projectData.status,
          deadline: projectData.deadline
            ? projectData.deadline.toISOString().split("T")[0]
            : null,
          budget: projectData.budget,
          progress: projectData.progress,
          priority: projectData.priority,
          clerk_id: user.id,
        },
      ])
      .select("*");

    if (error) {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project Created",
        description: `${projectData.name} has been created successfully.`,
      });
      if (data && data.length > 0) {
        setProjects((prev) => [data[0], ...prev]);
        setSelectedProjectId(data[0].id);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-primary/10 text-primary";
      case "Review":
        return "bg-warning/10 text-warning";
      case "Not Started":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
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
