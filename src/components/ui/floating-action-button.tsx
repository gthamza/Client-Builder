import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useToast } from "../../hooks/use-toast";
import {
  Plus,
  FileText,
  MessageSquare,
  Upload,
  Receipt,
  FolderPlus,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  AddProjectModal,
  ProjectFormData,
} from "../../components/workspace/add-project-modal";

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = async (projectData: ProjectFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Project Created",
      description: `${projectData.name} has been created successfully.`,
    });

    console.log("Created project:", projectData);
  };

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mb-2">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setShowAddProject(true)}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Add Task
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Receipt className="w-4 h-4 mr-2" />
              Create Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onSubmit={handleCreateProject}
      />
    </>
  );
}
