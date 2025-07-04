import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useToast } from "../hooks/use-toast";
import {
  AddProjectModal,
  ProjectFormData,
} from "../components/workspace/add-project-modal";
import {
  Plus,
  Calendar,
  DollarSign,
  Trash2,
  Pencil,
} from "lucide-react";
import { useSupabaseClient } from "../lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";

export default function Projects() {
  const [showAddProject, setShowAddProject] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { getClient } = useSupabaseClient();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<
    (ProjectFormData & { id?: number }) | null
  >(null);

  // ✅ Fetch projects from Supabase
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
      }
    };

    fetchProjects();
  }, [user]);

  // ✅ Handle Create Project
  const handleSaveProject = async (
    projectData: ProjectFormData & { id?: number }
  ) => {
    const supabase = await getClient();
    if (!user) return;

    let response;

    if (projectData.id) {
      response = await supabase
        .from("projects")
        .update({
          name: projectData.name,
          description: projectData.description,
          client_id: projectData.client_id,
          client_name: projectData.client_name,
          status: projectData.status,
          deadline: projectData.deadline
            ? projectData.deadline.toISOString().split("T")[0]
            : null,
          budget: projectData.budget,
          priority: projectData.priority,
          progress: projectData.progress,
        })
        .eq("id", projectData.id)
        .select("*");
    } else {
      response = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            client_id: projectData.client_id,
            client_name: projectData.client_name,
            status: projectData.status,
            deadline: projectData.deadline
              ? projectData.deadline.toISOString().split("T")[0]
              : null,
            budget: projectData.budget,
            priority: projectData.priority,
            progress: projectData.progress,
            clerk_id: user.id,
          },
        ])
        .select("*");
    }

    const { data, error } = response;

    if (error) {
      toast({
        title: `Failed to ${projectData.id ? "update" : "create"} project`,
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Project ${projectData.id ? "Updated" : "Created"}`,
      description: `${projectData.name} has been ${
        projectData.id ? "updated" : "created"
      } successfully.`,
    });

    if (data && data.length > 0) {
      const newProject = data[0];
      setProjects((prev) =>
        projectData.id
          ? prev.map((p) => (p.id === newProject.id ? newProject : p))
          : [newProject, ...prev]
      );
    }

    setSelectedProject(null);
  };
  
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-primary/10 text-primary";
      case "Review":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async (id: number) => {
    const supabase = await getClient();

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      });
      setProjects((prev) => prev.filter((project) => project.id !== id));
    }
  };
  

  function handleEdit(project: any): void {
    setSelectedProject({
      id: project.id,
      name: project.name,
      client_id: project.client_id,
      client_name: project.client_name,
      description: project.description,
      progress: project.progress,
      status: project.status,
      budget: project.budget,
      deadline: project.deadline ? new Date(project.deadline) : undefined,
      priority: project.priority || "medium",
    });
    setShowAddProject(true);
  }
  
  

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Overview of all your active and completed projects
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600"
          onClick={() => setShowAddProject(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {projects.filter((p) => p.status === "In Progress").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {projects.filter((p) => p.status === "Completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {projects.filter((p) => p.status === "Review").length}
            </div>
            <div className="text-sm text-muted-foreground">Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge
                  variant="secondary"
                  className={getStatusColor(project.status)}
                >
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground">
                  {project.client_name || "No Client"}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground text-blue-600 p-1"
                    onClick={() => handleEdit(project)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground text-red-600 p-1"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2" />
              </div>

              {/* Budget & Deadline */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Budget</span>
                  </div>
                  <span className="font-medium">{project.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline</span>
                  </div>
                  <span className="font-medium">{project.deadline}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onSubmit={handleSaveProject}
        initialData={selectedProject}
      />
    </div>
  );
}
