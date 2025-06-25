import { useState, useEffect, useRef } from "react";
import { Plus, Download, X, Trash2, Pencil } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient";
import html2pdf from "html2pdf.js";
import logo from "../../public/Images/logo.jpg"; // Adjust the path as necessary

const Invoices = () => {
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const [showModal, setShowModal] = useState(false);
  interface Invoice {
    id: string;
    client: string;
    amount: string;
    status: string;
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    [key: string]: unknown;
  }
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState({
    client: "",
    amount: "",
    status: "Draft",
    dueDate: "",
    issueDate: "",
    paidDate: "",
  });
  const [editId, setEditId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pdfRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
      .order("id", { ascending: true });
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

  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7); // e.g. "2025-06"

  const paidThisMonth = invoices
    .filter(
      (inv) =>
        inv.status === "Paid" &&
        inv.paidDate &&
        inv.paidDate.slice(0, 7) === thisMonth
    )
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  const overdue = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  const totalInvoices = invoices.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
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

  // Add or update invoice in Supabase
  const handleAddOrUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const supabase = await getClient();

    if (editMode) {
      // Update existing invoice
      const { error } = await supabase
        .from("invoices")
        .update({
          client: form.client,
          amount: parseAmount(form.amount),
          status: form.status,
          issue_date: form.issueDate,
          due_date: form.dueDate,
          paid_date: form.status === "Paid" ? form.paidDate : null,
        })
        .eq("id", editId)
        .eq("clerk_id", user.id);

      if (error) {
        alert("Update error: " + error.message);
        return;
      }

      setEditMode(false);
      setEditId("");
      setShowModal(false);
      setForm({
        client: "",
        amount: "",
        status: "Draft",
        dueDate: "",
        issueDate: "",
        paidDate: "",
      });
      fetchInvoices();
      return;
    }

    // Generate next invoice ID
    const { data: lastInvoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("clerk_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNumber = 1;
    if (lastInvoice?.id) {
      const match = lastInvoice.id.match(/INV-(\d+)/);
      if (match) nextNumber = parseInt(match[1]) + 1;
    }
    const generatedId = `INV-${String(nextNumber).padStart(3, "0")}`;

    // Insert new invoice
    const { error } = await supabase.from("invoices").insert([
      {
        id: generatedId,
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

  // Delete invoice (open modal)
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteId || !user) return;
    const supabase = await getClient();
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", deleteId)
      .eq("clerk_id", user.id);
    if (error) alert("Delete error: " + error.message);
    else fetchInvoices();
    setDeleteId(null);
  };

  // Edit invoice
  const handleEdit = (invoice: Invoice) => {
    setForm({
      client: invoice.client,
      amount: invoice.amount.replace(/[^0-9.]/g, ""),
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paidDate: invoice.paidDate || "",
    });
    setEditId(invoice.id);
    setEditMode(true);
    setShowModal(true);
  };

  // Download invoice as PDF using html2pdf.js
  const handleDownloadPDF = (invoiceId: string) => {
    const element = pdfRefs.current[invoiceId];
    if (!element) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `${invoiceId}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your client invoices
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setEditId("");
            setForm({
              client: "",
              amount: "",
              status: "Draft",
              dueDate: "",
              issueDate: "",
              paidDate: "",
            });
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4 text-center text-red-600 dark:text-red-400">
              Delete Invoice
            </h2>
            <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editMode ? "Edit Invoice" : "Create Invoice"}
            </h2>
            <form onSubmit={handleAddOrUpdateInvoice} className="space-y-4">
              {/* Invoice ID is auto-generated, so not shown in form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Client
                </label>
                <input
                  type="text"
                  name="client"
                  value={form.client}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  value={form.amount}
                  onChange={handleInputChange}
                  required
                  placeholder="$0.00"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>
              {form.status === "Paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Paid Date
                  </label>
                  <input
                    type="date"
                    name="paidDate"
                    value={form.paidDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                {editMode ? "Update Invoice" : "Create Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hidden PDF templates */}
      <div style={{ display: "none" }}>
        {invoices.map((invoice) => (
          <div
            key={`pdf-${invoice.id}`}
            ref={(el) => (pdfRefs.current[invoice.id] = el)}
          >
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                padding: 40,
                width: 600,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <img src={logo} alt="Logo" style={{ height: 60 }} />
                <div style={{ textAlign: "right" }}>
                  <h2 style={{ margin: 0 }}>INVOICE</h2>
                  <small>{new Date().toLocaleDateString()}</small>
                </div>
              </div>
              <hr style={{ margin: "20px 0" }} />
              <div style={{ marginBottom: 20 }}>
                <p>
                  <strong>Invoice ID:</strong> {invoice.id}
                </p>
                <p>
                  <strong>Client:</strong> {invoice.client}
                </p>
                <p>
                  <strong>Status:</strong> {invoice.status}
                </p>
                <p>
                  <strong>Issue Date:</strong> {invoice.issueDate}
                </p>
                <p>
                  <strong>Due Date:</strong> {invoice.dueDate}
                </p>
                {invoice.paidDate && (
                  <p>
                    <strong>Paid Date:</strong> {invoice.paidDate}
                  </p>
                )}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: 5,
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: 5,
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0" }}>
                      Invoice for {invoice.client}
                    </td>
                    <td style={{ textAlign: "right" }}>{invoice.amount}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ textAlign: "right", paddingTop: 10 }}>
                      <strong>Total:</strong>
                    </td>
                    <td style={{ textAlign: "right", paddingTop: 10 }}>
                      <strong>{invoice.amount}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div
                style={{
                  marginTop: 40,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Total Outstanding
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Paid This Month
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${paidThisMonth.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Overdue
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${overdue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Total Invoices
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalInvoices}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {invoice.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {invoice.amount}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {invoice.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                        onClick={() => handleDownloadPDF(invoice.id)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
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
