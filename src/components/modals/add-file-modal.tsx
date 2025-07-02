import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2, X } from "lucide-react";

interface AddFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (fileData: FileFormData) => void;
}

export interface FileFormData {
  name: string;
  description: string;
  project: string;
  category: string;
  tags: string[];
  file: File | null;
}

export function AddFileModal({
  open,
  onOpenChange,
  onSubmit,
}: AddFileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FileFormData>({
    name: "",
    description: "",
    project: "",
    category: "design",
    tags: [],
    file: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.file) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        description: "",
        project: "",
        category: "design",
        tags: [],
        file: null,
      });
      setTagInput("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FileFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      file,
      name: prev.name || file.name.split(".")[0],
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[400px] max-h-[90vh] overflow-y-auto px-4 py-3">
        <DialogHeader>
          <DialogTitle className="text-base">Upload File</DialogTitle>
          <DialogDescription className="text-sm">
            Upload a new file and categorize it for easy access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* File Upload */}
          <div className="space-y-1">
            <Label>File Upload *</Label>
            <div
              className={`border-2 border-dashed rounded-md p-2 text-center transition-colors text-sm ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="space-y-1">
                  <div className="font-medium">{formData.file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange("file", null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag & drop or click to upload
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="name">File Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              placeholder="e.g., UI Mockups"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="h-16"
              placeholder="Describe the file..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Project</Label>
              <Select
                value={formData.project}
                onValueChange={(value) => handleInputChange("project", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce-redesign">
                    E-commerce Redesign
                  </SelectItem>
                  <SelectItem value="mobile-app-ui">Mobile App UI</SelectItem>
                  <SelectItem value="brand-guidelines">
                    Brand Guidelines
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="archive">Archive</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.file}
              size="sm"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload File
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
