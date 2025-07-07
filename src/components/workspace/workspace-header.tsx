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
import { supabase } from "../../lib/supabase";
import { useUser } from "@clerk/clerk-react";

export function WorkspaceHeader() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useUser();
  const userId = user?.id;

  const selectedProject = projects.find(
    (p) => p.id.toString() === selectedProjectId
  );

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

  // ✅ Fetch user's real projects from Supabase
  const fetchProjects = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error.message);
      toast({
        title: "Error",
        description: "Could not load projects.",
        variant: "destructive",
      });
      return;
    }

    setProjects(data || []);
    if (data && data.length > 0) {
      setSelectedProjectId(data[0].id.toString());
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  // ✅ Create new project and store it in Supabase
  const handleCreateProject = async (data: ProjectFormData) => {
    if (!userId) return;

    const { error, data: created } = await supabase
      .from("projects")
      .insert([
        {
          name: data.name,
          description: data.description || "",
          status: data.status || "Not Started",
          clerk_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding project:", error.message);
      toast({
        title: "Error",
        description: "Could not create project.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Created",
      description: `${data.name} has been added.`,
    });

    setProjects((prev) => [created, ...prev]);
    setSelectedProjectId(created.id.toString());
    setShowAddProject(false);
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
                  <SelectItem key={project.id} value={project.id.toString()}>
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
