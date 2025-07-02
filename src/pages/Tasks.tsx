import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { useToast } from "../hooks/use-toast";
import { AddTaskModal, TaskFormData } from "../components/modals/add-task-modal";
import {
  Plus,
  Calendar,
  Clock,
  User,
  List,
  CalendarDays,
  Kanban,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

const STORAGE_KEY = "clienthub-tasks";

const getInitialTasks = () => {
  const defaultTasks = [
    {
      id: 1,
      title: "Complete wireframe designs",
      description: "Create low-fidelity wireframes for all main pages",
      assignee: { name: "Sarah Johnson", initials: "SJ" },
      priority: "High",
      dueDate: "2024-03-15",
      status: "In Progress",
      completed: false,
      column: "in-progress",
    },
    {
      id: 2,
      title: "Review client feedback",
      description: "Go through the feedback received from TechCorp",
      assignee: { name: "Mike Chen", initials: "MC" },
      priority: "Medium",
      dueDate: "2024-03-12",
      status: "Pending",
      completed: false,
      column: "todo",
    },
    {
      id: 3,
      title: "Update brand guidelines",
      description: "Finalize the new brand color palette",
      assignee: { name: "Lisa Rodriguez", initials: "LR" },
      priority: "Low",
      dueDate: "2024-03-20",
      status: "Completed",
      completed: true,
      column: "done",
    },
    {
      id: 4,
      title: "Design system documentation",
      description: "Document all design components and patterns",
      assignee: { name: "Sarah Johnson", initials: "SJ" },
      priority: "Medium",
      dueDate: "2024-03-18",
      status: "In Progress",
      completed: false,
      column: "in-progress",
    },
    {
      id: 5,
      title: "User testing sessions",
      description: "Conduct user testing for new features",
      assignee: { name: "Mike Chen", initials: "MC" },
      priority: "High",
      dueDate: "2024-03-14",
      status: "Pending",
      completed: false,
      column: "todo",
    },
    {
      id: 6,
      title: "Client presentation prep",
      description: "Prepare slides for client presentation",
      assignee: { name: "Lisa Rodriguez", initials: "LR" },
      priority: "High",
      dueDate: `${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
      status: "Pending",
      completed: false,
      column: "todo",
    },
  ];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTasks;
  } catch {
    return defaultTasks;
  }
};

export default function Tasks() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("list");
  const [showAddTask, setShowAddTask] = useState(false);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState(getInitialTasks);
  const { toast } = useToast();

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = async (taskData: TaskFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      assignee: {
        name: taskData.assignee,
        initials: taskData.assignee
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      },
      priority:
        taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1),
      dueDate: taskData.dueDate
        ? taskData.dueDate.toISOString().split("T")[0]
        : "",
      status: taskData.status,
      completed: false,
      column:
        taskData.status === "completed"
          ? "done"
          : taskData.status === "in-progress"
          ? "in-progress"
          : "todo",
    };

    setTasks((prev) => [...prev, newTask]);

    toast({
      title: "Task Created",
      description: `${taskData.title} has been created successfully.`,
    });
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newColumn: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.column !== newColumn) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id
            ? {
                ...task,
                column: newColumn,
                status: getStatusFromColumn(newColumn),
              }
            : task
        )
      );

      toast({
        title: "Task Moved",
        description: `${draggedTask.title} moved to ${newColumn.replace(
          "-",
          " "
        )}`,
      });
    }
    setDraggedTask(null);
  };

  const getStatusFromColumn = (column: string) => {
    switch (column) {
      case "todo":
        return "Pending";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Completed";
      default:
        return "Pending";
    }
  };

  // Task management
  const handleEditTask = (task: any) => {
    toast({
      title: "Edit Task",
      description: `Editing ${task.title}`,
    });
    console.log("Edit task:", task);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been deleted successfully",
    });
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "Completed" : "Pending",
              column: !task.completed ? "done" : "todo",
            }
          : task
      )
    );
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return tasks.filter((task) => task.dueDate === dateStr);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const TaskCard = ({
    task,
    showDate = true,
    isDraggable = false,
  }: {
    task: any;
    showDate?: boolean;
    isDraggable?: boolean;
  }) => (
    <div
      className={`p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow ${
        isDraggable ? "cursor-move" : "cursor-pointer"
      }`}
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && handleDragStart(e, task)}
      onClick={() => !isDraggable && setSelectedTask(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <div className="flex items-center space-x-1">
          <Badge
            variant="secondary"
            className={`${getPriorityColor(task.priority)} text-xs`}
          >
            {task.priority}
          </Badge>
          {!isDraggable && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8"
                    onClick={() => handleEditTask(task)}
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Avatar className="w-4 h-4">
            <AvatarFallback className="text-[10px] bg-primary-100 text-primary-700">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {task.assignee.name}
          </span>
        </div>
        {showDate && (
          <span className="text-xs text-muted-foreground">
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all project tasks
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600"
          onClick={() => setShowAddTask(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {tasks.filter((task) => task.status === "In Progress").length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {tasks.filter((task) => task.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {
                tasks.filter(
                  (task) =>
                    new Date(task.dueDate) < new Date() && !task.completed
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Task Views */}
      <Tabs
        value={selectedView}
        onValueChange={setSelectedView}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="list"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <List className="w-4 h-4" />
            <span>Todo List</span>
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger
            value="kanban"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban Board</span>
          </TabsTrigger>
        </TabsList>

        {/* Todo List View */}
        <TabsContent value="list" className="mt-6">
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
                      onCheckedChange={() => handleToggleComplete(task.id)}
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
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-2">
                              <div className="space-y-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-8"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <Edit className="w-3 h-3 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="w-3 h-3 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
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
                          <span>{formatDate(task.dueDate)}</span>
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
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from(
                  { length: getFirstDayOfMonth(currentDate) },
                  (_, i) => (
                    <div key={`empty-${i}`} className="h-24"></div>
                  )
                )}
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                  const date = i + 1;
                  const dayTasks = getTasksForDate(date);
                  const isToday =
                    new Date().toDateString() ===
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      date
                    ).toDateString();

                  return (
                    <div
                      key={date}
                      className={`h-24 p-1 border border-border rounded-lg ${
                        isToday ? "bg-primary/5 border-primary" : "bg-card"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday ? "text-primary" : ""
                        }`}
                      >
                        {date}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded text-white truncate cursor-pointer ${
                              task.priority === "High"
                                ? "bg-destructive"
                                : task.priority === "Medium"
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                            onClick={() => setSelectedTask(task)}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kanban Board View */}
        <TabsContent value="kanban" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <Card
              className="shadow-sm"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "todo")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>To Do</span>
                  <Badge variant="secondary" className="bg-muted">
                    {tasks.filter((task) => task.column === "todo").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 min-h-[200px]">
                {tasks
                  .filter((task) => task.column === "todo")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} isDraggable={true} />
                  ))}
                {tasks.filter((task) => task.column === "todo").length ===
                  0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Drop tasks here
                  </div>
                )}
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card
              className="shadow-sm"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "in-progress")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>In Progress</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {
                      tasks.filter((task) => task.column === "in-progress")
                        .length
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 min-h-[200px]">
                {tasks
                  .filter((task) => task.column === "in-progress")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} isDraggable={true} />
                  ))}
                {tasks.filter((task) => task.column === "in-progress")
                  .length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Drop tasks here
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Done Column */}
            <Card
              className="shadow-sm"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "done")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Done</span>
                  <Badge
                    variant="secondary"
                    className="bg-success/10 text-success"
                  >
                    {tasks.filter((task) => task.column === "done").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 min-h-[200px]">
                {tasks
                  .filter((task) => task.column === "done")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} isDraggable={true} />
                  ))}
                {tasks.filter((task) => task.column === "done").length ===
                  0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Drop tasks here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AddTaskModal
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
