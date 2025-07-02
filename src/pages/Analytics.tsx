import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react";

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Sample data for charts
  const projectProgressData = [
    { month: "Jan", completed: 4, inProgress: 6, planning: 2 },
    { month: "Feb", completed: 6, inProgress: 8, planning: 3 },
    { month: "Mar", completed: 8, inProgress: 5, planning: 4 },
    { month: "Apr", completed: 10, inProgress: 7, planning: 2 },
    { month: "May", completed: 12, inProgress: 9, planning: 5 },
    { month: "Jun", completed: 15, inProgress: 6, planning: 3 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
    { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
    { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
    { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
    { month: "Jun", revenue: 67000, expenses: 40000, profit: 27000 },
  ];

  const teamPerformanceData = [
    {
      name: "Sarah Johnson",
      tasksCompleted: 24,
      hoursWorked: 160,
      efficiency: 95,
    },
    { name: "Mike Chen", tasksCompleted: 18, hoursWorked: 155, efficiency: 88 },
    {
      name: "Lisa Rodriguez",
      tasksCompleted: 21,
      hoursWorked: 148,
      efficiency: 92,
    },
    {
      name: "John Smith",
      tasksCompleted: 15,
      hoursWorked: 140,
      efficiency: 85,
    },
    {
      name: "Emma Wilson",
      tasksCompleted: 19,
      hoursWorked: 145,
      efficiency: 90,
    },
  ];

  const clientSatisfactionData = [
    { name: "Excellent", value: 45, color: "#10b981" },
    { name: "Good", value: 30, color: "#3b82f6" },
    { name: "Average", value: 20, color: "#f59e0b" },
    { name: "Poor", value: 5, color: "#ef4444" },
  ];

  const workloadDistribution = [
    { category: "Design", hours: 120, percentage: 30 },
    { category: "Development", hours: 160, percentage: 40 },
    { category: "Testing", hours: 60, percentage: 15 },
    { category: "Meetings", hours: 40, percentage: 10 },
    { category: "Documentation", hours: 20, percentage: 5 },
  ];

  const kpiData = [
    {
      title: "Project Completion Rate",
      value: "94%",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-success",
    },
    {
      title: "Client Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Average Project Duration",
      value: "6.2 weeks",
      change: "-1.1 weeks",
      trend: "down",
      icon: Clock,
      color: "text-accent",
    },
    {
      title: "Revenue Growth",
      value: "$67k",
      change: "+22%",
      trend: "up",
      icon: DollarSign,
      color: "text-warning",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className="flex items-center mt-1">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-success mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-success mr-1" />
                      )}
                      <span className="text-sm text-success font-medium">
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Progress Trend */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Project Progress Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={projectProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="inProgress"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="planning"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Client Satisfaction */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientSatisfactionData}
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
                      {clientSatisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Workload Distribution */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workloadDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Project Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                  <Bar dataKey="planning" fill="#f59e0b" name="Planning" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="tasksCompleted"
                    fill="#3b82f6"
                    name="Tasks Completed"
                  />
                  <Bar
                    dataKey="efficiency"
                    fill="#10b981"
                    name="Efficiency %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
