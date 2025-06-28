import {
  Upload,
  FileText,
  Download,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient"; // ✅ updated
import { Share } from "lucide-react";

const BUCKET = "project-files";

const Files = () => {
  const { user } = useUser();
  const { getClient } = useSupabaseClient(); // ✅ get authenticated client
  const [files, setFiles] = useState<any[]>([]);
  const [shareModal, setShareModal] = useState({
    visible: false,
    link: "",
    expiresAt: "",
    maxDownloads: 0,
    token: "",
    linkId: "", // add this!
  });
  
  
  
  const [showModal, setShowModal] = useState(false);
  const [editFileId, setEditFileId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({
    file: null as File | null,
    name: "",
    type: "",
    size: "",
    uploadedBy: "",
    uploadedAt: "",
    client: "",
  });
  const handleGenerateLink = async (file: any) => {
    const supabase = await getClient();
    const token = Math.random().toString(36).substring(2, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const { data, error } = await supabase
      .from("shared_links")
      .insert({
        file_id: file.id,
        token,
        expires_at: expiresAt,
        max_downloads: 5,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Link creation error:",
        error.message,
        error.details,
        error.hint
      );
      alert("❌ Could not create shared link.");
      return;
    }

    const publicLink = `${window.location.origin}/shared/${token}`;

    setShareModal({
      visible: true,
      link: publicLink,
      expiresAt: data.expires_at,
      maxDownloads: data.max_downloads,
      token: token,
      linkId: data.id,
    });
  };
  
  
  
  const fetchFiles = async () => {
    const supabase = await getClient();
    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("clerk_id", user?.id)
      .order("created_at", { ascending: false });
    setFiles(data || []);
  };

  useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const extension = file.name.split(".").pop()?.toLowerCase();
    const type = file.type
      ? file.type
      : extension === "json"
      ? "application/json"
      : extension === "csv"
      ? "text/csv"
      : extension === "ico"
      ? "image/x-icon"
      : extension === "doc"
      ? "application/msword"
      : extension === "docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : extension === "xls"
      ? "application/vnd.ms-excel"
      : extension === "xlsx"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : extension === "ppt"
      ? "application/vnd.ms-powerpoint"
      : extension === "pptx"
      ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      : "application/octet-stream";

    setForm((prev) => ({
      ...prev,
      file,
      name: file.name,
      size: sizeMB,
      type,
    }));
  };
  

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    const supabase = await getClient();
    const filePath = `${user?.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error("Upload error", error);
      throw error;
    }

    return filePath;
  };

  const getFileUrl = (path: string) =>
    `${
      import.meta.env.VITE_SUPABASE_URL
    }/storage/v1/object/public/${BUCKET}/${path}`;

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !user) return;
    try {
      const fileUrl = await uploadFileToSupabase(form.file);
      const supabase = await getClient();

      // 1. Check for existing versions of the same file name by the same user
      const { data: existingFiles, error: fetchError } = await supabase
        .from("files")
        .select("version")
        .eq("clerk_id", user.id)
        .eq("name", form.name)
        .order("version", { ascending: false })
        .limit(1);

      // 2. Determine new version number
      const newVersion = existingFiles?.[0]?.version
        ? existingFiles[0].version + 1
        : 1;

      // 3. Insert new file version
      const { error } = await supabase.from("files").insert({
        name: form.name,
        type: form.type,
        size: form.size,
        uploaded_by: form.uploadedBy,
        uploaded_at: form.uploadedAt,
        client: form.client,
        file_url: fileUrl,
        clerk_id: user.id,
        version: newVersion,
      });

      if (error) throw error;
      fetchFiles();
      resetForm();
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  const handleEditClick = (file: any) => {
    setEditFileId(file.id);
    setForm({
      file: null,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedBy: file.uploaded_by,
      uploadedAt: file.uploaded_at,
      client: file.client,
    });
    setShowModal(true);
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

  const handleUpdateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFileId) return;
    try {
      let updatedFileUrl = undefined;
      if (form.file) {
        updatedFileUrl = await uploadFileToSupabase(form.file);
      }

      const supabase = await getClient();

      const updateData: any = {
        name: form.name,
        type: form.type,
        size: form.size,
        uploaded_by: form.uploadedBy,
        uploaded_at: form.uploadedAt,
        client: form.client,
        updated_at: new Date().toISOString(),
      };

      if (updatedFileUrl) updateData.file_url = updatedFileUrl;

      await supabase.from("files").update(updateData).eq("id", editFileId);
      fetchFiles();
      resetForm();
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleDeleteFile = (id: number) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;

    const supabase = await getClient();
    const fileToDelete = files.find((f) => f.id === deleteId);
    if (!fileToDelete) return;

    // ✅ 1. Delete related shared links first
    const { error: sharedLinkDeleteError } = await supabase
      .from("shared_links")
      .delete()
      .eq("file_id", deleteId);

    if (sharedLinkDeleteError) {
      console.error("Error deleting shared links:", sharedLinkDeleteError);
      alert(
        "❌ Cannot delete file: shared links exist and could not be removed."
      );
      return;
    }

    // ✅ 2. Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([fileToDelete.file_url]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      return;
    }

    // ✅ 3. Delete file metadata from database
    const { error: fileDeleteError } = await supabase
      .from("files")
      .delete()
      .eq("id", deleteId);

    if (fileDeleteError) {
      console.error("Error deleting file:", fileDeleteError);
      return;
    }

    fetchFiles();
    setDeleteId(null);
  };
  

  const resetForm = () => {
    setShowModal(false);
    setEditFileId(null);
    setForm({
      file: null,
      name: "",
      type: "",
      size: "",
      uploadedBy: "",
      uploadedAt: "",
      client: "",
    });
  };

  const getFileIcon = (type: string, url?: string) => {
    if (type.startsWith("image") && url) {
      return (
        <img src={getFileUrl(url)} alt="preview" className="w-8 h-8 rounded" />
      );
    } else if (type.includes("pdf")) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (type.includes("json") || type.includes("csv")) {
      return <FileText className="w-8 h-8 text-green-500" />;
    } else if (type.includes("msword") || type.includes("word")) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else if (type.includes("excel")) {
      return <FileText className="w-8 h-8 text-green-600" />;
    } else if (type.includes("powerpoint")) {
      return <FileText className="w-8 h-8 text-orange-500" />;
    } else {
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
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file)
                    handleFileSelect({ target: { files: [file] } } as any);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Drag and drop a file here or{" "}
                  <label className="text-blue-600 dark:text-blue-400 underline cursor-pointer">
                    click to browse
                    <input
                      type="file"
                      accept=".pdf,.json,.csv,.ico,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                      onChange={handleFileSelect}
                      required={!editFileId}
                      className="hidden"
                    />
                  </label>
                </p>
                {form.name && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
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
                  {getFileIcon(file.type, file.file_url)}

                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]"
                      title={file.name}
                    >
                      {file.name}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {file.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
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
                  <button
                    title="Share"
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400"
                    onClick={() => handleGenerateLink(file)}
                  >
                    <Share className="w-4 h-4" />
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
                    {file.uploaded_by}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {file.uploaded_at}
                  </span>
                </div>

                {/* ✅ Add Version Display */}
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    v{file.version || 1}
                  </span>
                </div>
              </div>

              <a
                href={getFileUrl(file.file_url)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </a>
            </div>
          ))
        )}
      </div>

      {shareModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() =>
                setShareModal({
                  visible: false,
                  link: "",
                  expiresAt: "",
                  maxDownloads: 0,
                  token: "",
                  linkId: "",
                })
              }
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Secure Link
            </h2>

            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm break-all text-gray-900 dark:text-white mb-4">
              {shareModal.link}
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              <div>
                <strong>Expires:</strong>{" "}
                {new Date(shareModal.expiresAt).toLocaleString()}
              </div>
              <div>
                <strong>Max Downloads:</strong> {shareModal.maxDownloads}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(shareModal.link)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Copy to Clipboard
              </button>

              <button
                onClick={async () => {
                  const supabase = await getClient();
                  await supabase
                    .from("shared_links")
                    .delete()
                    .eq("id", shareModal.linkId);

                  setShareModal({
                    visible: false,
                    link: "",
                    expiresAt: "",
                    maxDownloads: 0,
                    token: "",
                    linkId: "",
                  });
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
              >
                Revoke Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
