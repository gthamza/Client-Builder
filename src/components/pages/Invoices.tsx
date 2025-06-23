import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Download, Eye, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient";

const Invoices = () => {
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    client: "",
    amount: "",
    status: "Draft",
    dueDate: "",
    issueDate: "",
    paidDate: "",
  });

  // Helper to parse currency string to number
  const parseAmount = (amount: string) =>
    Number(amount.replace(/[^0-9.-]+/g, ""));

  // Fetch invoices from Supabase
  const fetchInvoices = async () => {
    if (!user) return;
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("clerk_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setInvoices(
        (data || []).map((inv: any) => ({
          ...inv,
          amount: `$${Number(inv.amount).toLocaleString()}`,
          dueDate: inv.due_date,
          issueDate: inv.issue_date,
          paidDate: inv.paid_date,
        }))
      );
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Calculations
  const totalOutstanding = invoices
    .filter((inv) => inv.status === "Pending" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  const paidThisMonth = invoices
    .filter(
      (inv) =>
        inv.status === "Paid" &&
        inv.paidDate &&
        inv.paidDate.startsWith("2024-01")
    )
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  const overdue = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  const totalInvoices = invoices.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add invoice to Supabase
  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const supabase = await getClient();

    // Insert invoice
    const { error } = await supabase.from("invoices").insert([
      {
        id: form.id,
        client: form.client,
        amount: parseAmount(form.amount),
        status: form.status,
        issue_date: form.issueDate,
        due_date: form.dueDate,
        paid_date: form.status === "Paid" ? form.paidDate : null,
        clerk_id: user.id,
      },
    ]);
    if (error) {
      alert("Error adding invoice: " + error.message);
      return;
    }
    setForm({
      id: "",
      client: "",
      amount: "",
      status: "Draft",
      dueDate: "",
      issueDate: "",
      paidDate: "",
    });
    setShowModal(false);
    fetchInvoices();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Track and manage your client invoices</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Create Invoice</h2>
            <form onSubmit={handleAddInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invoice ID
                </label>
                <input
                  type="text"
                  name="id"
                  value={form.id}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client
                </label>
                <input
                  type="text"
                  name="client"
                  value={form.client}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  value={form.amount}
                  onChange={handleInputChange}
                  required
                  placeholder="$0.00"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              {form.status === "Paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Paid Date
                  </label>
                  <input
                    type="date"
                    name="paidDate"
                    value={form.paidDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-600">
            ${totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Paid This Month</p>
          <p className="text-2xl font-bold text-green-600">
            ${paidThisMonth.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            ${overdue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.client}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;