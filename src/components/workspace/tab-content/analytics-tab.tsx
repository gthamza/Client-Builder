import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";

export function AnalyticsTab() {
  const milestones = [
    {
      title: "Project Kickoff",
      date: "Jan 15, 2024",
      status: "completed",
      description: "Initial planning and requirements gathering",
    },
    {
      title: "Wireframes & Prototypes",
      date: "Feb 1, 2024",
      status: "completed",
      description: "Low-fidelity wireframes and interactive prototypes",
    },
    {
      title: "UI Design",
      date: "Feb 20, 2024",
      status: "in-progress",
      description: "High-fidelity designs and design system",
    },
    {
      title: "Frontend Development",
      date: "Mar 5, 2024",
      status: "pending",
      description: "Implementation of the user interface",
    },
    {
      title: "Testing & Launch",
      date: "Mar 15, 2024",
      status: "pending",
      description: "Quality assurance and production deployment",
    },
  ];

  const taskStats = [
    { label: "Completed", count: 24, total: 45, color: "text-success" },
    { label: "In Progress", count: 8, total: 45, color: "text-primary" },
    { label: "Pending", count: 13, total: 45, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Hours Logged
                </div>
                <div className="text-2xl font-bold">187.5h</div>
                <div className="text-xs text-muted-foreground">
                  This month: 45h
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Tasks Completed
                </div>
                <div className="text-2xl font-bold">24/45</div>
                <div className="text-xs text-muted-foreground">53% done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Project Progress
                </div>
                <div className="text-2xl font-bold">65%</div>
                <div className="text-xs text-muted-foreground">On track</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Project Progress</span>
              <span className="font-medium">65%</span>
            </div>
            <Progress value={65} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {taskStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={stat.color}>{stat.label}</span>
                  <span className="font-medium">
                    {stat.count}/{stat.total}
                  </span>
                </div>
                <Progress
                  value={(stat.count / stat.total) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Timeline */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Project Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      milestone.status === "completed"
                        ? "bg-success border-success"
                        : milestone.status === "in-progress"
                          ? "bg-primary border-primary"
                          : "bg-muted border-muted-foreground"
                    }`}
                  ></div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-12 bg-border mt-2"></div>
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <Badge
                      variant="secondary"
                      className={
                        milestone.status === "completed"
                          ? "bg-success/10 text-success"
                          : milestone.status === "in-progress"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {milestone.status === "in-progress"
                        ? "In Progress"
                        : milestone.status.charAt(0).toUpperCase() +
                          milestone.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {milestone.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {milestone.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Team Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                  SJ
                </div>
                <div>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">
                    Lead Designer
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">42h</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center text-accent-700 font-medium text-sm">
                  MC
                </div>
                <div>
                  <div className="font-medium">Mike Chen</div>
                  <div className="text-sm text-muted-foreground">
                    Frontend Dev
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">38h</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success font-medium text-sm">
                  LR
                </div>
                <div>
                  <div className="font-medium">Lisa Rodriguez</div>
                  <div className="text-sm text-muted-foreground">
                    UX Designer
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">35h</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
