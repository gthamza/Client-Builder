import {
  Upload,
  FileText,
  Image,
  Download,
  MoreHorizontal,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const Files = () => {
  const [showModal, setShowModal] = useState(false);
  const [editFileId, setEditFileId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "Project Proposal.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "Alex Johnson",
      uploadedAt: "2024-01-15",
      client: "Acme Corp",
    },
    {
      id: 2,
      name: "Logo.png",
      type: "image",
      size: "1.1 MB",
      uploadedBy: "Sara Lee",
      uploadedAt: "2024-02-10",
      client: "Tech Startup",
    },
  ]);

  const [form, setForm] = useState({
    file: null as File | null,
    name: "",
    type: "pdf",
    size: "",
    uploadedBy: "",
    uploadedAt: "",
    client: "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const fileType = file.type.startsWith("image/") ? "image" : "pdf";

    setForm((prev) => ({
      ...prev,
      file,
      name: file.name,
      type: fileType,
      size: sizeMB,
    }));
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

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.file) return;

    setFiles([
      {
        id: files.length ? Math.max(...files.map((f) => f.id)) + 1 : 1,
        name: form.name,
        type: form.type,
        size: form.size,
        uploadedBy: form.uploadedBy,
        uploadedAt: form.uploadedAt,
        client: form.client,
      },
      ...files,
    ]);

    setForm({
      file: null,
      name: "",
      type: "pdf",
      size: "",
      uploadedBy: "",
      uploadedAt: "",
      client: "",
    });

    setShowModal(false);
  };

  const handleEditClick = (file: any) => {
    setEditFileId(file.id);
    setForm({
      file: null,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedBy: file.uploadedBy,
      uploadedAt: file.uploadedAt,
      client: file.client,
    });
    setShowModal(true);
  };

  const handleUpdateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFileId === null) return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === editFileId
          ? {
              ...f,
              name: form.name,
              type: form.type,
              size: form.size,
              uploadedBy: form.uploadedBy,
              uploadedAt: form.uploadedAt,
              client: form.client,
            }
          : f
      )
    );
    setEditFileId(null);
    setForm({
      file: null,
      name: "",
      type: "pdf",
      size: "",
      uploadedBy: "",
      uploadedAt: "",
      client: "",
    });
    setShowModal(false);
  };

  const handleDeleteFile = (fileId: number) => {
    setDeleteId(fileId);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    setFiles((prev) => prev.filter((f) => f.id !== deleteId));
    setDeleteId(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-8 h-8 text-blue-500" />;
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Files
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload and organize project files
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          onClick={() => {
            setShowModal(true);
            setEditFileId(null);
            setForm({
              file: null,
              name: "",
              type: "pdf",
              size: "",
              uploadedBy: "",
              uploadedAt: "",
              client: "",
            });
          }}
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4 text-center text-red-600 dark:text-red-400">
              Delete File
            </h2>
            <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this file? This action cannot be
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => {
                setShowModal(false);
                setEditFileId(null);
                setForm({
                  file: null,
                  name: "",
                  type: "pdf",
                  size: "",
                  uploadedBy: "",
                  uploadedAt: "",
                  client: "",
                });
              }}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editFileId ? "Edit File" : "Upload New File"}
            </h2>
            <form
              onSubmit={editFileId ? handleUpdateFile : handleAddFile}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select File
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileSelect}
                  required={!editFileId}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
                {form.name && (
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    {form.name} – {form.size}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Uploaded By
                </label>
                <input
                  type="text"
                  name="uploadedBy"
                  value={form.uploadedBy}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>

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
                  Date
                </label>
                <input
                  type="date"
                  name="uploadedAt"
                  value={form.uploadedAt}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={
                  (!form.file && !editFileId) ||
                  !form.uploadedBy ||
                  !form.uploadedAt ||
                  !form.client
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                {editFileId ? "Update File" : "Upload File"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No files uploaded yet.
          </p>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {file.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    title="Edit"
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                    onClick={() => handleEditClick(file)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Client</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {file.client}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded by</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {file.uploadedBy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {file.uploadedAt}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Files;