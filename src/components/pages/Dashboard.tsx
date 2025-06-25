import { useUser } from "@clerk/clerk-react";
import { Users, FolderOpen, Receipt, TrendingUp } from "lucide-react";
import { useMemo } from "react";

// Example data for calculation
const clients = [
  { id: 1, name: "Acme Corp", createdAt: "2024-06-01" },
  { id: 2, name: "Tech Startup", createdAt: "2024-06-10" },
  { id: 3, name: "Global Industries", createdAt: "2024-05-15" },
];

const projects = [
  { id: 1, name: "Website Redesign", status: "Active" },
  { id: 2, name: "Mobile App", status: "Completed" },
  { id: 3, name: "Branding", status: "Active" },
];

const invoices = [
  { id: 1, client: "Acme Corp", amount: 1200, status: "Paid" },
  { id: 2, client: "Tech Startup", amount: 800, status: "Pending" },
  { id: 3, client: "Global Industries", amount: 1500, status: "Overdue" },
];

const recentActivity = [
  {
    type: "invoice",
    action: "Invoice #INV-003 marked as Overdue",
    time: "2 hours ago",
  },
  {
    type: "file",
    action: "New file uploaded for Tech Startup",
    time: "5 hours ago",
  },
  {
    type: "client",
    action: "Added new client: Tech Startup",
    time: "1 day ago",
  },
  {
    type: "payment",
    action: "Payment received from Acme Corp",
    time: "2 days ago",
  },
];

const Dashboard = () => {
  const { user } = useUser();

  // Calculations for summary cards
  const totalClients = clients.length;
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const summaryCards = useMemo(
    () => [
      {
        title: "Total Clients",
        value: totalClients,
        icon: Users,
        color: "bg-blue-500",
        change: "+2 this month",
      },
      {
        title: "Active Projects",
        value: activeProjects,
        icon: FolderOpen,
        color: "bg-green-500",
        change: "+1 this week",
      },
      {
        title: "Total Invoices",
        value: totalInvoices,
        icon: Receipt,
        color: "bg-purple-500",
        change: "+3 this month",
      },
      {
        title: "Revenue (Paid)",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: TrendingUp,
        color: "bg-yellow-500",
        change: "+$1,200 this month",
      },
    ],
    [totalClients, activeProjects, totalInvoices, totalRevenue]
  );

  return (
    <div className="space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.firstName || user?.username || "Guest"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "invoice"
                      ? "bg-blue-500"
                      : activity.type === "file"
                      ? "bg-green-500"
                      : activity.type === "client"
                      ? "bg-purple-500"
                      : activity.type === "payment"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
