import { useState } from "react";
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

export default function Projects() {
  const { toast } = useToast();
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState<any[]>([
    {
      id: 1,
      name: "E-commerce Redesign",
      client_name: "TechCorp Inc.",
      description: "Complete redesign of the online store interface",
      progress: 65,
      status: "In Progress",
      budget: "$15,000",
      deadline: "2024-08-20",
      priority: "high",
    },
    {
      id: 2,
      name: "Mobile App UI",
      client_name: "StartupCo",
      description: "Native mobile app user interface design",
      progress: 90,
      status: "Review",
      budget: "$12,000",
      deadline: "2024-08-18",
      priority: "medium",
    },
    {
      id: 3,
      name: "Brand Guidelines",
      client_name: "DesignStudio",
      description: "Complete brand identity and guidelines",
      progress: 100,
      status: "Completed",
      budget: "$8,000",
      deadline: "2024-08-10",
      priority: "low",
    },
  ]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

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

  const handleSaveProject = (
    projectData: ProjectFormData & { id?: number }
  ) => {
    if (projectData.id) {
      // Update
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectData.id ? { ...p, ...projectData } : p
        )
      );
      toast({
        title: "Project Updated",
        description: `${projectData.name} was updated.`,
      });
    } else {
      // Create
      const newProject = {
        ...projectData,
        id: Math.floor(Math.random() * 10000),
      };
      setProjects((prev) => [newProject, ...prev]);
      toast({
        title: "Project Created",
        description: `${projectData.name} was created.`,
      });
    }

    setSelectedProject(null);
    setShowAddProject(false);
  };

  const handleEdit = (project: any) => {
    setSelectedProject({
      ...project,
      deadline: project.deadline ? new Date(project.deadline) : undefined,
    });
    setShowAddProject(true);
  };

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    toast({
      title: "Project Deleted",
      description: "The project has been successfully deleted.",
    });
  };

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
                  {project.client_name || "No Client"}
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

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
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
