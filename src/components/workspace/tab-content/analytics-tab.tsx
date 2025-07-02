import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Progress } from "../../ui/progress";
import { Badge } from "../../ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Activity,
  Zap,
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

  // Chart data for workspace analytics
  const weeklyProgress = [
    { week: "Week 1", completed: 5, pending: 8 },
    { week: "Week 2", completed: 8, pending: 6 },
    { week: "Week 3", completed: 12, pending: 4 },
    { week: "Week 4", completed: 15, pending: 3 },
    { week: "Week 5", completed: 18, pending: 2 },
    { week: "Week 6", completed: 24, pending: 1 },
  ];

  const teamEfficiency = [
    { name: "Sarah", tasks: 12, hours: 42, efficiency: 95 },
    { name: "Mike", tasks: 8, hours: 38, efficiency: 88 },
    { name: "Lisa", tasks: 10, hours: 35, efficiency: 92 },
  ];

  const workloadData = [
    { name: "Design", value: 40, color: "#3b82f6" },
    { name: "Development", value: 35, color: "#10b981" },
    { name: "Testing", value: 15, color: "#f59e0b" },
    { name: "Documentation", value: 10, color: "#8b5cf6" },
  ];

  const timeTrackingData = [
    { day: "Mon", planned: 8, actual: 7.5 },
    { day: "Tue", planned: 8, actual: 8.2 },
    { day: "Wed", planned: 8, actual: 7.8 },
    { day: "Thu", planned: 8, actual: 8.5 },
    { day: "Fri", planned: 8, actual: 7.2 },
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Pending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workload Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Workload Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={workloadData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workloadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time Tracking vs Planning */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Time Tracking vs Planning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeTrackingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="planned" fill="#3b82f6" name="Planned Hours" />
              <Bar dataKey="actual" fill="#10b981" name="Actual Hours" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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

      {/* Team Efficiency Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Team Efficiency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teamEfficiency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#3b82f6" name="Tasks Completed" />
              <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
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
    </div>
  );
}
