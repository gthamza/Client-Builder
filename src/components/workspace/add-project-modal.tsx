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
import { useAuth } from "@clerk/clerk-react";
import { createBrowserClient } from "@supabase/ssr";

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Types
export interface ProjectFormData {
  progress: number;
  name: string;
  description: string;
  clientId: number;
  status: string;
  deadline: Date | undefined;
  budget: string;
  priority: string;
}

interface Client {
  id: number;
  name: string;
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
  const [clients, setClients] = useState<Client[]>([]);
  const { userId } = useAuth();

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    clientId: 0,
    status: "Not Started",
    deadline: undefined,
    budget: "",
    priority: "medium",
    progress: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, name")
          .eq("clerk_id", userId);

        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };

    fetchClients();
  }, [userId]);
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          clientId: initialData.clientId || 0,
          status: initialData.status || "Not Started",
          deadline: initialData.deadline
            ? new Date(initialData.deadline)
            : undefined,
          budget: initialData.budget || "",
          priority: initialData.priority || "medium",
          progress: initialData.progress || 0,
        });
      } else {
        // Reset for new project
        setFormData({
          name: "",
          description: "",
          clientId: 0,
          status: "Not Started",
          deadline: undefined,
          budget: "",
          priority: "medium",
          progress: 0,
        });
      }
    }
  }, [open, initialData]);
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.clientId) return;

    setIsLoading(true);
    try {
      await onSubmit({ ...formData, id: initialData?.id });
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

      // Human logic between status and progress
      if (field === "status") {
        switch (value) {
          case "Not Started":
            updated.progress = 0;
            break;
          case "In Progress":
            if (updated.progress === 0 || updated.progress === 100) {
              updated.progress = 10;
            }
            break;
          case "Review":
            if (updated.progress < 80 || updated.progress === 100) {
              updated.progress = 85;
            }
            break;
          case "Completed":
            updated.progress = 100;
            break;
        }
      }

      // Optional: Adjust status if user manually changes progress
      if (field === "progress") {
        const p = Number(value);
        if (p === 0) updated.status = "Not Started";
        else if (p > 0 && p < 80) updated.status = "In Progress";
        else if (p >= 80 && p < 100) updated.status = "Review";
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
              <Select
                value={formData.clientId ? String(formData.clientId) : ""}
                onValueChange={(value) =>
                  handleInputChange("clientId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground text-sm">
                      No clients found
                    </div>
                  )}
                </SelectContent>
              </Select>
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
            <Label htmlFor="progress">Progress: {formData.progress}%</Label>
            <input
              id="progress"
              type="range"
              min={0}
              max={100}
              value={formData.progress}
              onChange={(e) =>
                handleInputChange("progress", Number(e.target.value))
              }
              className={cn(
                "w-full h-2 rounded-lg appearance-none cursor-pointer",
                "bg-[length:var(--progress)_100%] bg-no-repeat bg-gray-300",
                "bg-gradient-to-r from-blue-500 to-blue-500",
                "[&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
                "[&::-webkit-slider-thumb]:bg-blue-600",
                "[&::-webkit-slider-thumb]:rounded-full"
              )}
              style={{
                ["--progress" as any]: `${formData.progress}%`,
              }}
            />
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
              disabled={isLoading || !formData.name || !formData.clientId}
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
