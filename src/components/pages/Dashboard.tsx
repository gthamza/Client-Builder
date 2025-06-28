import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient";
import { Users, FolderOpen, Receipt, TrendingUp, Sparkles } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await getClient();
      const clerkId = user?.id;
      if (!clerkId) return;

      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("clerk_id", clerkId);
      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("clerk_id", clerkId);
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select("*")
        .eq("clerk_id", clerkId);
      const { data: activityData } = await supabase
        .from("invoices")
        .select("status, id, updated_at")
        .eq("clerk_id", clerkId)
        .order("updated_at", { ascending: false })
        .limit(5);

      setClients(clientData || []);
      setProjects(projectData || []);
      setInvoices(invoiceData || []);
      setRecentActivity(activityData || []);
    };

    fetchData();
  }, [user]);

  const totalRevenue = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "Paid")
        .reduce((sum, inv) => sum + Number(inv.amount), 0),
    [invoices]
  );

  const summaryCards = [
    {
      title: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "bg-blue-500",
      change: "+2 this month",
    },
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status !== "Completed").length,
      icon: FolderOpen,
      color: "bg-green-500",
      change: "+1 this week",
    },
    {
      title: "Total Invoices",
      value: invoices.length,
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
  ];

  const generateAISummary = async () => {
    setLoadingSummary(true);
    setSummary("");
    setSummaryError("");

    try {
      const response = await fetch(
        "https://api-generate-summary.vercel.app/api/generate-summary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to generate summary");
      setSummary(data.summary);
    } catch (err: any) {
      setSummaryError(err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6 transition-colors">
      <h1 className="text-2xl font-bold">
        Welcome back, {user?.firstName || "Guest"}!
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Here's your business overview.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* AI Summary Button + Result */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <button
          onClick={generateAISummary}
          disabled={loadingSummary}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          <Sparkles className="w-4 h-4" />
          {loadingSummary ? "Generating..." : "Generate AI Summary"}
        </button>

        {summary && (
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {summary}
          </div>
        )}

        {summaryError && (
          <div className="text-red-500 text-sm">❌ {summaryError}</div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {recentActivity.length === 0 ? (
            <li className="text-gray-500">No recent activity yet.</li>
          ) : (
            recentActivity.map((act, i) => (
              <li key={i} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1 ${
                    act.status === "Paid"
                      ? "bg-green-500"
                      : act.status === "Overdue"
                      ? "bg-red-500"
                      : act.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                />
                <div className="text-sm">
                  <p>
                    Invoice {act.id} marked as {act.status}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(act.updated_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
