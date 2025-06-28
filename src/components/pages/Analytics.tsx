import { useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  MessageCircle,
  BarChart2,
  PieChart,
  Download,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

// Constants
const radius = 45;
const circumference = 2 * Math.PI * radius;

// Dummy data
const project = {
  name: "Website Redesign",
  status: "On Track",
  lastUpdated: "2025-06-25T10:30:00Z",
  milestones: [
    { id: 1, name: "Discovery", due: "2025-06-10", status: "completed" },
    { id: 2, name: "Wireframes", due: "2025-06-15", status: "completed" },
    { id: 3, name: "Design", due: "2025-06-20", status: "in_progress" },
    { id: 4, name: "Development", due: "2025-07-01", status: "pending" },
    { id: 5, name: "QA & Launch", due: "2025-07-10", status: "pending" },
  ],
  projectedCompletion: "2025-07-10",
  tasksCompleted: 18,
  filesUploaded: 7,
  comments: 12,
  summary:
    "The project is progressing well. Design phase is underway and development is scheduled to start soon.",
  feedback: {
    mood: "😊",
    nps: 9,
    latestComment: "Loving the progress so far! Keep it up.",
  },
  taskTypes: [
    { type: "Design", count: 7 },
    { type: "Development", count: 6 },
    { type: "QA", count: 3 },
    { type: "Other", count: 2 },
  ],
  milestoneHistory: [
    { date: "2025-06-10", completed: 1 },
    { date: "2025-06-15", completed: 2 },
    { date: "2025-06-20", completed: 2 },
    { date: "2025-06-25", completed: 3 },
  ],
};

const statusColors = {
  "On Track": "bg-green-100 text-green-700",
  "At Risk": "bg-yellow-100 text-yellow-700",
  Delayed: "bg-red-100 text-red-700",
};

const milestoneStatus = {
  completed: {
    color: "bg-green-500",
    icon: <CheckCircle className="w-4 h-4 text-white" />,
  },
  in_progress: {
    color: "bg-yellow-400",
    icon: <AlertTriangle className="w-4 h-4 text-white" />,
  },
  pending: {
    color: "bg-gray-300",
    icon: <XCircle className="w-4 h-4 text-white" />,
  },
};

const timeRanges = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "All time", value: "all" },
];

export default function ProjectAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[0].value);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const percentComplete = Math.round(
    (completedMilestones / totalMilestones) * 100
  );

  const barChartData = project.milestoneHistory.map((h) => ({
    date: h.date,
    completed: h.completed,
  }));
  const pieChartData = project.taskTypes;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{project.name}</h1>
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-semibold",
                statusColors[project.status]
              )}
            >
              {project.status}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300">
              Last updated:{" "}
              {new Date(project.lastUpdated).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {timeRanges.find((r) => r.value === selectedRange)?.label}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedRange(range.value);
                    setDropdownOpen(false);
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                    selectedRange === range.value
                      ? "font-semibold text-blue-600 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-600"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - percentComplete / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
                style={{ transition: "stroke-dashoffset 0.5s" }}
              />
              <text
                x="50"
                y="54"
                textAnchor="middle"
                className="text-2xl font-bold fill-blue-600"
              >
                {percentComplete}%
              </text>
            </svg>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {completedMilestones} / {totalMilestones} milestones
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Projected completion:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(project.projectedCompletion).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Activity Summary</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />{" "}
              {project.tasksCompleted} tasks completed
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />{" "}
              {project.filesUploaded} files uploaded
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-purple-500" />{" "}
              {project.comments} comments/messages
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            {project.summary}
          </p>
        </div>

        {/* Feedback Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <PieChart className="w-5 h-5 text-pink-500" />
            <span className="font-semibold">Feedback Trends</span>
          </div>
          <div className="flex items-center gap-2 text-3xl mb-2">
            <span>{project.feedback.mood}</span>
            <span className="text-lg text-gray-500 dark:text-gray-300">
              NPS
            </span>
            <span className="font-bold text-blue-600">
              {project.feedback.nps}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
            Latest:{" "}
            <span className="italic">"{project.feedback.latestComment}"</span>
          </p>
        </div>
      </div>

      {/* Timeline + Charts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Milestone Timeline</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ol className="relative border-l-4 border-blue-200 dark:border-blue-900 ml-4">
              {project.milestones.map((m) => (
                <li key={m.id} className="mb-8 ml-6">
                  <span
                    className={clsx(
                      "absolute -left-6 flex items-center justify-center w-8 h-8 rounded-full ring-8 ring-white dark:ring-gray-900",
                      milestoneStatus[m.status].color
                    )}
                  >
                    {milestoneStatus[m.status].icon}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {m.name}
                    </span>
                    <span
                      className={clsx(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        m.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : m.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      )}
                    >
                      {m.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    Due: {new Date(m.due).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex-1">
            <h3 className="text-md font-semibold mb-2">
              Milestone Completion Over Time
            </h3>
            <div className="w-full h-40 flex items-end gap-2">
              {barChartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${d.completed * 30}px`,
                      width: "24px",
                      transition: "height 0.3s",
                    }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-300">
                    {new Date(d.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
            <h3 className="text-md font-semibold mt-6 mb-2">Task Types</h3>
            <div className="flex items-center gap-4">
              {pieChartData.map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "w-6 h-6 rounded-full",
                      t.type === "Design"
                        ? "bg-pink-400"
                        : t.type === "Development"
                        ? "bg-blue-400"
                        : t.type === "QA"
                        ? "bg-green-400"
                        : "bg-gray-400"
                    )}
                  ></div>
                  <span className="text-xs mt-1">{t.type}</span>
                  <span className="text-xs font-semibold">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
          <Sparkles className="w-4 h-4" /> Generate AI Summary
        </button>
        <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>
    </div>
  );
}
