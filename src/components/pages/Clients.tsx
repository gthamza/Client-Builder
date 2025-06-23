import React, { useState } from "react";
import {
  Plus,
  X,
  Mail,
  Phone,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Inactive":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Clients</h1>
          <p className="text-gray-600">
            Manage and track your clients efficiently.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow w-fit animate-fade-in">
          <CheckCircle size={18} /> Client added successfully!
        </div>
      )}

      {/* Client Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Client Name",
                "Contact Info",
                "Projects",
                "Total Value",
                "Status",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {client.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={14} /> {client.phone}
                  </div>
                </td>
                <td className="px-6 py-4">{client.projects}</td>
                <td className="px-6 py-4 font-medium text-blue-600">
                  {client.totalValue}
                </td>
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
                  <button className="text-gray-400 hover:text-blue-600 transition">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td
                  className="px-6 py-4 text-gray-400 italic text-center"
                  colSpan={6}
                >
                  No clients have been added yet. Start by clicking "Add
                  Client".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Add New Client
            </h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              {[
                { label: "Client Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Projects", name: "projects", type: "number" },
                { label: "Total Value", name: "totalValue", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    required
                    value={form[name as keyof Client] as string | number}
                    onChange={handleInputChange}
                    className="w-full mt-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full mt-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Save Client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
