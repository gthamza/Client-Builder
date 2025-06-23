import React, { useState } from "react";
import { Plus, X, Mail, Phone, MoreHorizontal } from "lucide-react";

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  type Client = {
    id: number;
    name: string;
    email: string;
    phone: string;
    projects: number;
    totalValue: string;
    status: string;
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
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    setClients([
      ...clients,
      {
        ...form,
        id: clients.length + 1,
      },
    ]);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-600">Manage your clients</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Client Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Projects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
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
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-gray-500" colSpan={6}>
                  No clients added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Projects
                </label>
                <input
                  type="number"
                  name="projects"
                  value={form.projects}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full mt-1 border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Value
                </label>
                <input
                  type="text"
                  name="totalValue"
                  required
                  value={form.totalValue}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2"
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
                  className="w-full mt-1 border rounded-md px-3 py-2"
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
                Add Client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
