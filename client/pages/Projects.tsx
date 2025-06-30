import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  AddProjectModal,
  ProjectFormData,
} from "@/components/workspace/add-project-modal";
import { Plus, Calendar, Users, DollarSign } from "lucide-react";

export default function Projects() {
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
  const projects = [
    {
      id: 1,
      name: "E-commerce Redesign",
      client: "TechCorp Inc.",
      description: "Complete redesign of the online store interface",
      progress: 65,
      status: "In Progress",
      budget: "$15,000",
      deadline: "Mar 15, 2024",
      team: [
        { name: "Sarah Johnson", initials: "SJ" },
        { name: "Mike Chen", initials: "MC" },
        { name: "Lisa Rodriguez", initials: "LR" },
      ],
    },
    {
      id: 2,
      name: "Mobile App UI",
      client: "StartupCo",
      description: "Native mobile app user interface design",
      progress: 90,
      status: "Review",
      budget: "$12,000",
      deadline: "Mar 10, 2024",
      team: [
        { name: "Mike Chen", initials: "MC" },
        { name: "Lisa Rodriguez", initials: "LR" },
      ],
    },
    {
      id: 3,
      name: "Brand Guidelines",
      client: "DesignStudio",
      description: "Complete brand identity and guidelines",
      progress: 100,
      status: "Completed",
      budget: "$8,000",
      deadline: "Feb 28, 2024",
      team: [{ name: "Sarah Johnson", initials: "SJ" }],
    },
  ];

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Overview of all your active and completed projects
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">7</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">5</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-muted-foreground">Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
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
              <p className="text-sm text-muted-foreground">{project.client}</p>
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

              {/* Project Details */}
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

              {/* Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </div>
                <div className="flex -space-x-2">
                  {project.team.map((member, index) => (
                    <Avatar
                      key={index}
                      className="w-6 h-6 border-2 border-background"
                    >
                      <AvatarImage src="/api/placeholder/24/24" />
                      <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
