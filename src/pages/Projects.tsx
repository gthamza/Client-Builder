import { useEffect, useState } from "react";
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
import { Plus, Calendar, DollarSign, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function Projects() {
  const { toast } = useToast();
  const { userId } = useAuth();

  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        client:clients (
          id,
          name
        )
      `
      )
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error.message);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Review":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleSaveProject = async (
    projectData: ProjectFormData & { id?: number }
  ) => {
    if (!userId) return;

    const payload = {
      ...projectData,
      client_id: projectData.clientId,
      clerk_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    delete payload.clientId;

    if (projectData.id) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectData.id)
        .eq("clerk_id", userId);

      if (!error) {
        toast({
          title: "Project Updated",
          description: `${projectData.name} was updated.`,
        });
        fetchProjects();
      } else {
        console.error("Update error:", error.message);
      }
    } else {
      const { error } = await supabase.from("projects").insert(payload);

      if (!error) {
        toast({
          title: "Project Created",
          description: `${projectData.name} was created.`,
        });
        fetchProjects();
      } else {
        console.error("Insert error:", error.message);
      }
    }

    setSelectedProject(null);
    setShowAddProject(false);
  };

  const handleEdit = (project: any) => {
    setSelectedProject({
      ...project,
      clientId: project.client_id,
      deadline: project.deadline ? new Date(project.deadline) : undefined,
    });
    setShowAddProject(true);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("clerk_id", userId);

    if (!error) {
      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      });
      fetchProjects();
    } else {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Overview of all your active and completed projects
          </p>
        </div>
        <Button onClick={() => setShowAddProject(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {projects.filter((p) => p.status === "In Progress").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.status === "Completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {projects.filter((p) => p.status === "Review").length}
            </div>
            <div className="text-sm text-muted-foreground">Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground">
                  {project.client?.name || "No Client"}
                </p>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 p-1"
                    onClick={() => handleEdit(project)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 p-1"
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

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

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
                  <span className="font-medium">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString("en-CA")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onSubmit={handleSaveProject}
        initialData={selectedProject}
      />
    </div>
  );
}
