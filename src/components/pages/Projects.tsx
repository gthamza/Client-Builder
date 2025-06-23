import { useEffect, useState } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient";

const Projects = () => {
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "Not Started",
    progress: 0,
  });
  const [editProject, setEditProject] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "status") {
        // When user sets status
        if (value === "Completed") {
          updated.progress = 100;
        } else if (value === "Not Started" && Number(prev.progress) > 0) {
          // Don't allow Not Started if progress already exists
          updated.status = "In Progress";
        }
        return updated;
      }

      if (name === "progress") {
        const progressValue = Number(value);
        updated.progress = progressValue;

        if (progressValue === 0) {
          updated.status = "Not Started";
        } else if (progressValue === 100) {
          updated.status = "Completed";
        } else {
          // Any progress between 1–99 should be "In Progress"
          if (prev.status === "Completed" || prev.status === "Not Started") {
            updated.status = "In Progress";
          }
        }

        return updated;
      }

      return updated;
    });
  };

  const fetchProjects = async () => {
    if (!user) return;
    const supabase = await getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("clerk_id", user.id)
      .order("last_updated", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setProjects(data || []);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = await getClient();
    const newProject = {
      ...form,
      clerk_id: user?.id,
      last_updated: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(newProject)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error.message);
    } else {
      setProjects((prev) => [data, ...prev]);
      setNewProjectId(data.id);
      setForm({ name: "", client: "", status: "Not Started", progress: 0 });
      setShowModal(false);
    }
  };

  const handleEditClick = (project: any) => {
    setEditProject(project);
    setForm({
      name: project.name,
      client: project.client,
      status: project.status,
      progress: project.progress,
    });
    setShowModal(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProject) return;
    const supabase = await getClient();
    const updatedProject = {
      ...form,
      last_updated: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("projects")
      .update(updatedProject)
      .eq("id", editProject.id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error.message);
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === editProject.id ? data : p))
      );
      setEditProject(null);
      setForm({ name: "", client: "", status: "Not Started", progress: 0 });
      setShowModal(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setDeleteId(projectId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const supabase = await getClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", deleteId);
    if (error) {
      alert("Delete error: " + error.message);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            Manage your client projects and track progress
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          onClick={() => {
            setShowModal(true);
            setEditProject(null);
            setForm({
              name: "",
              client: "",
              status: "Not Started",
              progress: 0,
            });
          }}
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4 text-center text-red-600">
              Delete Project
            </h2>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowModal(false);
                setEditProject(null);
                setForm({
                  name: "",
                  client: "",
                  status: "Not Started",
                  progress: 0,
                });
              }}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">
              {editProject ? "Edit Project" : "Add New Project"}
            </h2>
            <form
              onSubmit={editProject ? handleUpdateProject : handleAddProject}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
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
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Progress (%)
                </label>
                <input
                  type="number"
                  name="progress"
                  value={form.progress}
                  min={0}
                  max={100}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                {editProject ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.client}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(project.last_updated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Edit"
                        className="p-2 rounded hover:bg-gray-100 text-blue-600"
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete"
                        className="p-2 rounded hover:bg-gray-100 text-red-600"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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

export default Projects;
