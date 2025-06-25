import React, { useState, useEffect } from "react";
import { Plus, X, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../../lib/supabaseClient"; // adjust path if needed

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();

  type Client = {
    id: number;
    name: string;
    email: string;
    phone: string;
    projects: number;
    totalValue: string;
    status: string;
    clerk_id?: string;
  };

  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Client>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    projects: 0,
    totalValue: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("clerk_id", user.id)
        .order("id", { ascending: true });
      if (!error && data) setClients(data);
    };
    fetchClients();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "projects" ? Number(value) : value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const handleAddOrUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a client.");
      return;
    }

    const newClient = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      projects: form.projects,
      totalValue: form.totalValue,
      status: form.status,
      clerk_id: user.id,
    };

    if (editId !== null) {
      // Update
      const { error } = await supabase
        .from("clients")
        .update(newClient)
        .eq("id", editId);

      if (error) {
        alert("Error updating client: " + error.message);
        return;
      }

      setClients((prev) =>
        prev.map((c) =>
          c.id === editId ? { ...form, id: editId, clerk_id: user.id } : c
        )
      );
      setEditId(null);
    } else {
      // Add
      const { data, error } = await supabase
        .from("clients")
        .insert([newClient])
        .select()
        .single();

      if (error) {
        alert("Error adding client: " + error.message);
        return;
      }

      setClients([
        ...clients,
        {
          ...form,
          id: data?.id || clients.length + 1,
          clerk_id: user.id,
        },
      ]);
    }

    setForm({
      id: 0,
      name: "",
      email: "",
      phone: "",
      projects: 0,
      totalValue: "",
      status: "Active",
    });

    setShowModal(false);
  };

  const handleEdit = (client: Client) => {
    setForm(client);
    setEditId(client.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", deleteId);
    if (error) {
      alert("Error deleting client: " + error.message);
    } else {
      setClients((prev) => prev.filter((c) => c.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your clients</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditId(null);
            setForm({
              id: 0,
              name: "",
              email: "",
              phone: "",
              projects: 0,
              totalValue: "",
              status: "Active",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Client Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Projects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  {client.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} /> {client.phone}
                  </div>
                </td>
                <td className="px-6 py-4">{client.projects}</td>
                <td className="px-6 py-4">{client.totalValue}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      client.status
                    )}`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      title="Edit"
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                      onClick={() => handleEdit(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete"
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                      onClick={() => handleDelete(client.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400" colSpan={6}>
                  No clients added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4 text-center text-red-600 dark:text-red-400">
              Delete Client
            </h2>
            <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this client? This action cannot be
              undone.
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
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editId !== null ? "Edit Client" : "Add New Client"}
            </h2>
            <form onSubmit={handleAddOrUpdateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Client Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Projects
                </label>
                <input
                  type="number"
                  name="projects"
                  value={form.projects}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Total Value
                </label>
                <input
                  type="text"
                  name="totalValue"
                  required
                  value={form.totalValue}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
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
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                {editId !== null ? "Update Client" : "Add Client"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;