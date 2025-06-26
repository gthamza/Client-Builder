import React, { useState, useEffect } from "react";
import {
  Plus,
  MoreHorizontal,
  Calendar as CalendarIcon,
  X,
  ListChecks,
  Layout,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Event as CalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Types
const statusOrder = ["Pending", "In Progress", "Completed", "Launched"];
const statusColors = {
  Pending: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  "In Progress":
    "bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700",
  Completed:
    "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700",
  Launched: "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700",
};
const statusDot = {
  Pending: "bg-gray-400",
  "In Progress": "bg-yellow-400",
  Completed: "bg-green-400",
  Launched: "bg-blue-400",
};
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "text-red-500 border-red-500";
    case "Normal":
      return "text-blue-500 border-blue-500";
    case "Low":
    default:
      return "text-gray-500 border-gray-500";
  }
};
const isOverdue = (due) => {
  const date = new Date(due);
  return !isNaN(date.getTime()) && date.getTime() < Date.now();
};
const localizer = momentLocalizer(moment);

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [dragged, setDragged] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    due: "",
    priority: "Normal",
    status: "Pending",
  });
  const [formDate, setFormDate] = useState(null);
  const [view, setView] = useState("board");
  const [todoInput, setTodoInput] = useState("");
  const [todoDate, setTodoDate] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!form.title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: form.title.trim(),
      due: formDate?.toISOString() || "",
      priority: form.priority,
      status: form.status,
    };
    setTasks((p) => [...p, newTask]);
    setForm({ title: "", due: "", priority: "Normal", status: "Pending" });
    setFormDate(null);
    setShowForm(false);
  };

  const onDragStart = (t) => setDragged(t);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (status) => {
    if (!dragged) return;
    setTasks((p) => p.map((t) => (t.id === dragged.id ? { ...t, status } : t)));
    setDragged(null);
  };

  const filteredTasks = tasks.filter((t) => {
    const due = new Date(t.due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (filter === "today") return due >= today && due < tomorrow;
    if (filter === "overdue") return due < today;
    if (filter === "upcoming") return due >= tomorrow;
    return true;
  });

  const calendarEvents = filteredTasks.map((t) => ({
    title: `${t.title} (${t.priority})`,
    start: new Date(t.due),
    end: new Date(t.due),
  }));

  const grouped = {
    Pending: [],
    "In Progress": [],
    Completed: [],
    Launched: [],
  };
  filteredTasks.forEach((t) => grouped[t.status].push(t));

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 text-black dark:text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          {["board", "todo", "calendar"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded ${
                view === v
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
              }`}
            >
              {v === "board" ? (
                <Layout />
              ) : v === "todo" ? (
                <ListChecks />
              ) : (
                <CalendarIcon />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["all", "today", "upcoming", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {view === "calendar" && (
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      )}

      {view === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusOrder.map((s) => (
            <div
              key={s}
              onDragOver={onDragOver}
              onDrop={() => onDrop(s)}
              className={`flex-1 min-w-[200px] border rounded p-3 ${statusColors[s]}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDot[s]}`} />
                  <span>{s}</span>
                  <span className="text-xs text-gray-400">
                    {grouped[s].length}
                  </span>
                </div>
                <MoreHorizontal />
              </div>
              <div className="space-y-2">
                {grouped[s].map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={() => onDragStart(t)}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded cursor-move"
                  >
                    <div className="flex justify-between">
                      <span>{t.title}</span>
                      <span
                        className={`text-xs px-2 rounded-full border ${getPriorityColor(
                          t.priority
                        )}`}
                      >
                        {t.priority}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-400 text-xs">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(t.due).toLocaleString()}
                      {isOverdue(t.due) && (
                        <span className="ml-2 text-red-500">⚠ Overdue</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-blue-500 text-xs"
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>
      )}

      {view === "todo" && (
        <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-900 p-4 rounded shadow">
          <h2 className="flex items-center mb-4">
            <ListChecks className="mr-2" /> Todo List
          </h2>
          <form
            className="flex gap-2 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!todoInput.trim()) return;
              setTasks((p) => [
                ...p,
                {
                  id: Date.now().toString(),
                  title: todoInput.trim(),
                  due: todoDate?.toISOString() || "",
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
              placeholder="Quick add"
              className="flex-1 p-2 bg-white dark:bg-gray-800 rounded"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <DatePicker
              selected={todoDate}
              onChange={(d) => setTodoDate(d)}
              showTimeSelect
              dateFormat="Pp"
              className="w-36 p-2 bg-white dark:bg-gray-800 rounded"
            />
            <button className="bg-blue-600 px-4 rounded text-white">Add</button>
          </form>
          {filteredTasks.length === 0 && (
            <p className="text-gray-500 text-center py-8">No tasks found.</p>
          )}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((t) => (
              <li key={t.id} className="py-2 flex gap-3">
                <span
                  className={`mt-1 w-2 h-2 rounded-full ${statusDot[t.status]}`}
                />
                <div>
                  <div className="flex justify-between">
                    <span>{t.title}</span>
                    <span
                      className={`text-xs px-2 rounded-full border ${getPriorityColor(
                        t.priority
                      )}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1 flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {new Date(t.due).toLocaleString()}
                    {isOverdue(t.due) && (
                      <span className="ml-2 text-red-500">⚠ Overdue</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        aria-label="Add Task"
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg text-white"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg max-w-sm w-full text-black dark:text-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Add New Task</h2>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 mb-2 bg-white dark:bg-gray-800 rounded"
            />
            <DatePicker
              selected={formDate}
              onChange={(d) => setFormDate(d)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full p-2 mb-2 bg-white dark:bg-gray-800 rounded"
              placeholderText="Due Date"
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full p-2 mb-2 bg-white dark:bg-gray-800 rounded"
            >
              <option>High</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 mb-2 bg-white dark:bg-gray-800 rounded"
            >
              {statusOrder.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleAddTask}
              className="bg-blue-600 w-full py-2 rounded text-white"
            >
              Save Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
