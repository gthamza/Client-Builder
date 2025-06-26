import React, { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  X,
  ListChecks,
  Layout,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TaskType = {
  id: string;
  title: string;
  due: string;
  priority: "High" | "Normal" | "Low";
  status: Status;
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
      return "text-red-400 border-red-400";
    case "Normal":
      return "text-blue-400 border-blue-400";
    case "Low":
      return "text-gray-400 border-gray-400";
    default:
      return "text-gray-400 border-gray-400";
  }
};

const isOverdue = (due: string) => {
  if (!due) return false;
  const date = new Date(due);
  if (isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
};

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [dragged, setDragged] = useState<TaskType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<TaskType, "id">>({
    title: "",
    due: "",
    priority: "Normal",
    status: "Pending",
  });
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [view, setView] = useState<"board" | "todo">("board");
  const [todoInput, setTodoInput] = useState(""); // For quick add in Todo view
  const [todoDate, setTodoDate] = useState<Date | null>(null);

  // Floating button for mobile/desktop
  const FloatingAddButton = (
    <button
      aria-label="Add Task"
      onClick={() => setShowForm(true)}
      className="fixed z-40 bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <Plus className="w-6 h-6" />
    </button>
  );

  const handleAddTask = () => {
    if (!form.title.trim()) return;
    const newTask: TaskType = {
      id: Date.now().toString(),
      ...form,
      due: formDate ? formDate.toISOString() : "",
    };
    setTasks((prev) => [...prev, newTask]);
    setForm({
      title: "",
      due: "",
      priority: "Normal",
      status: "Pending",
    });
    setFormDate(null);
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

  // Todo List View with quick add
  const TodoList = (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded-xl shadow-md p-4 mt-4">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ListChecks className="w-5 h-5" /> Todo List
      </h2>
      {/* Quick add input */}
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!todoInput.trim()) return;
          setTasks((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              title: todoInput,
              due: todoDate ? todoDate.toISOString() : "",
              priority: "Normal",
              status: "Pending",
            },
          ]);
          setTodoInput("");
          setTodoDate(null);
        }}
      >
        <input
          type="text"
          className="flex-1 border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm"
          placeholder="Quick add task..."
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          aria-label="Quick add task"
        />
        <DatePicker
          selected={todoDate}
          onChange={(date) => setTodoDate(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Due date"
          className="border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm w-36"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm"
        >
          Add
        </button>
      </form>
      {tasks.length === 0 && (
        <div className="text-gray-500 text-sm italic text-center py-8">
          No tasks
        </div>
      )}
      <ul className="divide-y divide-gray-800">
        {tasks.map((task) => (
          <li key={task.id} className="py-3 flex items-start gap-3">
            <span
              className={`mt-1 w-2 h-2 rounded-full ${statusDot[task.status]}`}
              title={task.status}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">
                  {task.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                    task.priority
                  )} bg-opacity-10`}
                >
                  {task.priority}
                </span>
                <span className="text-xs text-gray-400">{task.status}</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3" />
                {task.due ? new Date(task.due).toLocaleString() : ""}
                {isOverdue(task.due) && (
                  <span className="bg-red-900 text-red-300 px-2 rounded text-xs font-bold ml-2">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Kanban Board View
  const KanbanBoard = (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusOrder.map((status) => (
        <div
          key={status}
          className={`flex-1 min-w-[210px] max-w-xs rounded-xl border ${statusColors[status]} border shadow-md flex flex-col p-3`}
          onDragOver={onDragOver}
          onDrop={() => onDrop(status)}
          style={{ minHeight: 260 }}
          aria-label={`${status} column`}
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
                aria-grabbed={dragged?.id === task.id}
                onDragStart={() => onDragStart(task)}
                onDragEnd={() => setDragged(null)}
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white text-sm">
                    {task.title}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                      task.priority
                    )} bg-opacity-10`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3" />
                  {task.due ? new Date(task.due).toLocaleString() : ""}
                  {isOverdue(task.due) && (
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
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto px-2 md:px-4 py-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <p className="text-gray-400 mt-1">Manage your project tasks</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded flex items-center gap-1 text-xs font-semibold ${
              view === "board"
                ? "bg-blue-600 text-white"
                : "bg-blue-900 text-blue-200"
            }`}
            onClick={() => setView("board")}
            aria-pressed={view === "board"}
          >
            <Layout className="w-4 h-4" />
            Board
          </button>
          <button
            className={`px-3 py-1 rounded flex items-center gap-1 text-xs font-semibold ${
              view === "todo"
                ? "bg-blue-600 text-white"
                : "bg-blue-900 text-blue-200"
            }`}
            onClick={() => setView("todo")}
            aria-pressed={view === "todo"}
          >
            <ListChecks className="w-4 h-4" />
            Todo List
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="hidden md:flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {view === "board" ? KanbanBoard : TodoList}

      {/* Floating Add Button (mobile/desktop) */}
      {FloatingAddButton}

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-w-xs md:max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Add New Task</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded hover:bg-gray-800"
                aria-label="Close"
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
                aria-label="Task title"
              />
              <DatePicker
                selected={formDate}
                onChange={(date) => setFormDate(date)}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Due date"
                className="border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white text-sm w-full"
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
                aria-label="Priority"
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
                aria-label="Status"
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
