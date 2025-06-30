import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Clock, User } from "lucide-react";

export default function Tasks() {
  const tasks = [
    {
      id: 1,
      title: "Complete wireframe designs",
      description: "Create low-fidelity wireframes for all main pages",
      assignee: { name: "Sarah Johnson", initials: "SJ" },
      priority: "High",
      dueDate: "Mar 15, 2024",
      status: "In Progress",
      completed: false,
    },
    {
      id: 2,
      title: "Review client feedback",
      description: "Go through the feedback received from TechCorp",
      assignee: { name: "Mike Chen", initials: "MC" },
      priority: "Medium",
      dueDate: "Mar 12, 2024",
      status: "Pending",
      completed: false,
    },
    {
      id: 3,
      title: "Update brand guidelines",
      description: "Finalize the new brand color palette",
      assignee: { name: "Lisa Rodriguez", initials: "LR" },
      priority: "Low",
      dueDate: "Mar 20, 2024",
      status: "Completed",
      completed: true,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "Low":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all project tasks
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">4</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-4 p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={task.completed}
                  className="mt-1"
                  disabled={task.completed}
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${
                        task.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <Avatar className="w-5 h-5">
                        <AvatarImage src="/api/placeholder/20/20" />
                        <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{task.dueDate}</span>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        task.status === "Completed"
                          ? "text-success border-success"
                          : task.status === "In Progress"
                            ? "text-primary border-primary"
                            : "text-muted-foreground"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
