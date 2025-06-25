import React, { useState } from "react";
import { Plus, MoreHorizontal, Calendar, X } from "lucide-react";

type TaskType = {
  id: string;
  title: string;
  assignees?: string[];
  due: string;
  priority: "High" | "Normal" | "Low";
  status: Status;
  overdue?: boolean;
};

type Status = "Pending" | "In Progress" | "Completed" | "Launched";

const statusOrder: Status[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Launched",
];

const statusColors: Record<Status, string> = {
  Pending: "bg-gray-900 border-gray-700",
  "In Progress": "bg-yellow-900 border-yellow-700",
  Completed: "bg-green-900 border-green-700",
  Launched: "bg-blue-900 border-blue-700",
};

const statusDot: Record<Status, string> = {
  Pending: "bg-gray-400",
  "In Progress": "bg-yellow-400",
  Completed: "bg-green-400",
  Launched: "bg-blue-400",
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "text-red-400";
    case "Normal":
      return "text-blue-400";
    case "Low":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
};

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [dragged, setDragged] = useState<TaskType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<TaskType, "id">>({
    title: "",
    assignees: [],
    due: "",
    priority: "Normal",
    status: "Pending",
  });

  const handleAddTask = () => {
    if (!form.title.trim()) return;
    const newTask: TaskType = {
      id: Date.now().toString(),
      ...form,
    };
    setTasks((prev) => [...prev, newTask]);
    setForm({
      title: "",
      assignees: [],
      due: "",
      priority: "Normal",
      status: "Pending",
    });
    setShowForm(false);
  };

  const onDragStart = (task: TaskType) => setDragged(task);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (status: Status) => {
    if (!dragged) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === dragged.id ? { ...t, status } : t))
    );
    setDragged(null);
  };

  const grouped: Record<Status, TaskType[]> = {
    Pending: [],
    "In Progress": [],
    Completed: [],
    Launched: [],
  };
  tasks.forEach((t) => grouped[t.status].push(t));

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto px-2 md:px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <p className="text-gray-400 mt-1">Manage your project tasks</p>
      </div>

      {/* Board Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-blue-900 text-blue-200 text-xs font-semibold">
            Board
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Task Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusOrder.map((status) => (
          <div
            key={status}
            className={`flex-1 min-w-[210px] max-w-xs rounded-xl border ${statusColors[status]} border shadow-md flex flex-col p-3`}
            onDragOver={onDragOver}
            onDrop={() => onDrop(status)}
            style={{ minHeight: 260 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
                <span className="font-semibold text-white">{status}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {grouped[status].length}
                </span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </div>

            <div className="flex flex-col gap-2">
              {grouped[status].length === 0 && (
                <div className="text-gray-500 text-xs italic text-center py-6">
                  No tasks
                </div>
              )}
              {grouped[status].map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-move shadow hover:shadow-lg transition-shadow"
                  draggable
                  onDragStart={() => onDragStart(task)}
                  onDragEnd={() => setDragged(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-white text-sm">
                      {task.title}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                        task.priority
                      )} border-current bg-opacity-10`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-2">
                    <Calendar className="w-3 h-3" />
                    {task.due}
                    {task.overdue && (
                      <span className="bg-red-900 text-red-300 px-2 rounded text-xs font-bold ml-2">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-1 text-xs text-blue-400 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-w-xs md:max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Add New Task</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Task title"
                className="border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Due date (e.g., March 25 - 10:00AM)"
                className="border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
              />
              <select
                className="border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as TaskType["priority"],
                  })
                }
              >
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
              <select
                className="border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Status })
                }
              >
                {statusOrder.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddTask}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold text-sm"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Task;
