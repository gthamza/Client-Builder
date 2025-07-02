import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Slider } from "../../components/ui/slider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

export interface ProjectFormData {
  progress: number;
  name: string;
  description: string;
  client: string;
  status: string;
  deadline: Date | undefined;
  budget: string;
  priority: string;
}

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectData: ProjectFormData & { id?: number }) => void;
  initialData?: (ProjectFormData & { id?: number }) | null;
}

export function AddProjectModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: AddProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    client: "",
    status: "Not Started",
    deadline: undefined,
    budget: "",
    priority: "medium",
    progress: 0,
  });

  useEffect(() => {
    if (open) {
      setFormData(
        initialData ?? {
          name: "",
          description: "",
          client: "",
          status: "Not Started",
          deadline: undefined,
          budget: "",
          priority: "medium",
          progress: 0,
        }
      );
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return;

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        id: initialData?.id,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };

      // Smart progress change on status selection
      if (field === "status") {
        switch (value) {
          case "Not Started":
            updated.progress = 0;
            break;
          case "In Progress":
            updated.progress =
              prev.progress <= 0 ? 10 : prev.progress < 75 ? prev.progress : 50;
            break;
          case "Review":
            updated.progress = prev.progress < 75 ? 75 : prev.progress;
            break;
          case "Completed":
            updated.progress = 100;
            break;
        }
      }

      // Smart status change on progress update
      if (field === "progress") {
        const p = Number(value);
        if (p === 0) updated.status = "Not Started";
        else if (p > 0 && p < 75) updated.status = "In Progress";
        else if (p >= 75 && p < 100) updated.status = "Review";
        else if (p === 100) updated.status = "Completed";
      }

      return updated;
    });
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? "Update your project details below."
              : "Add a new project to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Client */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="E.g., Website Redesign"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                placeholder="E.g., TechCorp Inc."
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the project..."
              rows={3}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label>Progress</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[formData.progress]}
                onValueChange={(val) => handleInputChange("progress", val[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                {formData.progress}%
              </span>
            </div>
          </div>

          {/* Deadline & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? (
                      format(formData.deadline, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => handleInputChange("deadline", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="E.g., $5,000"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.client}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData?.id ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
