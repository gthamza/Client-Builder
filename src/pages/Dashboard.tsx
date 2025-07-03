import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import { Badge } from "./../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./../components/ui/avatar";
import { Progress } from "./../components/ui/progress";
import { useUser } from "@clerk/clerk-react";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      change: "+2 from last month",
      icon: BarChart3,
      color: "text-primary",
    },
    {
      title: "Active Clients",
      value: "8",
      change: "+1 from last month",
      icon: Users,
      color: "text-black dark:text-white",
    },
    {
      title: "Revenue",
      value: "$24,500",
      change: "+15% from last month",
      icon: DollarSign,
      color: "text-success",
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+3% from last month",
      icon: TrendingUp,
      color: "text-warning",
    },
  ];

  const recentProjects = [
    {
      name: "E-commerce Redesign",
      client: "TechCorp Inc.",
      progress: 65,
      status: "In Progress",
    },
    {
      name: "Mobile App UI",
      client: "StartupCo",
      progress: 90,
      status: "Review",
    },
    {
      name: "Brand Guidelines",
      client: "DesignStudio",
      progress: 100,
      status: "Completed",
    },
  ];

  const { user } = useUser();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome {user?.fullName || "back"}! Here's an overview of your workspace.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Recent Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-xl"
              >
                <div className="space-y-2">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {project.client}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={project.progress} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    project.status === "Completed"
                      ? "bg-success/10 text-success"
                      : project.status === "Review"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Team */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Team Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" alt="Sarah" />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  SJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Sarah completed wireframes
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" alt="Mike" />
                <AvatarFallback className="bg-accent-100 text-accent-700">
                  MC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Mike uploaded new designs</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" alt="Lisa" />
                <AvatarFallback className="bg-success/20 text-success">
                  LR
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Lisa sent client feedback</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
