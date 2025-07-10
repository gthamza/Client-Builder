import { useState } from "react";
import { Button } from "./../components/ui/button";
import { useToast } from "./../hooks/use-toast";
import {
  AddFileModal,
  FileFormData,
} from "./../components/modals/add-file-modal";
import { Edit, Plus, Trash, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Upload,
  Search,
  FileText,
  Image,
  Archive,
  Download,
} from "lucide-react";

export default function Files() {
  const [showAddFile, setShowAddFile] = useState(false);
  const { toast } = useToast();
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  const handleUploadFile = async (fileData: FileFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "File Uploaded",
      description: `${fileData.name} has been uploaded successfully.`,
    });

    console.log("Uploaded file:", fileData);
  };

  const files = [
    {
      name: "Wireframes_v2.pdf",
      type: "pdf",
      size: "2.4 MB",
      date: "2 hours ago",
      icon: FileText,
      color: "text-red-500",
    },
    {
      name: "Homepage_Mockup.png",
      type: "image",
      size: "1.8 MB",
      date: "5 hours ago",
      icon: Image,
      color: "text-blue-500",
    },
    {
      name: "Brand_Assets.zip",
      type: "archive",
      size: "15.2 MB",
      date: "1 day ago",
      icon: Archive,
      color: "text-orange-500",
    },
    {
      name: "Product_Specs.pdf",
      type: "pdf",
      size: "892 KB",
      date: "2 days ago",
      icon: FileText,
      color: "text-red-500",
    },
    {
      name: "User_Flow_Diagram.png",
      type: "image",
      size: "3.1 MB",
      date: "3 days ago",
      icon: Image,
      color: "text-blue-500",
    },
    {
      name: "Client_Feedback.pdf",
      type: "pdf",
      size: "1.2 MB",
      date: "1 week ago",
      icon: FileText,
      color: "text-red-500",
    },
  ];

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

      <div className="space-y-6">
        {/* Upload Area */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload files</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to browse
              </p>
              <Button
                className="bg-primary hover:bg-primary-600"
                onClick={() => setIsAddFileModalOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Files ({files.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search files..." className="pl-9 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => {
                const Icon = file.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-8 h-8 ${file.color}`} />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.size} • {file.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {file.type.toUpperCase()}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* File Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Images</div>
                  <div className="text-sm text-muted-foreground">24 files</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Documents</div>
                  <div className="text-sm text-muted-foreground">18 files</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Archive className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">Archives</div>
                  <div className="text-sm text-muted-foreground">6 files</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add File Modal */}
        <AddFileModal
          open={isAddFileModalOpen}
          onOpenChange={setIsAddFileModalOpen}
          onSubmit={(data: FileFormData) => {
            console.log("Uploaded:", data);
            // TODO: Save to backend or local state
            setIsAddFileModalOpen(false);
          }}
        />
      </div>

      <AddFileModal
        open={showAddFile}
        onOpenChange={setShowAddFile}
        onSubmit={handleUploadFile}
      />
    </div>
  );
}
