import { useState } from "react";
import { Button } from "./../components/ui/button";
import { useToast } from "./../hooks/use-toast";
import { FilesTab } from "./../components/workspace/tab-content/files-tab";
import { AddFileModal, FileFormData } from "./../components/modals/add-file-modal";
import { Plus } from "lucide-react";

export default function Files() {
  const [showAddFile, setShowAddFile] = useState(false);
  const { toast } = useToast();

  const handleUploadFile = async (fileData: FileFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "File Uploaded",
      description: `${fileData.name} has been uploaded successfully.`,
    });

    console.log("Uploaded file:", fileData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Manage and organize all your project files
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600"
          onClick={() => setShowAddFile(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      <FilesTab />

      <AddFileModal
        open={showAddFile}
        onOpenChange={setShowAddFile}
        onSubmit={handleUploadFile}
      />
    </div>
  );
}
