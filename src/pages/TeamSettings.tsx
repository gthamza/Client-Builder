import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { TeamSettingsHeader } from "../components/Teams/TeamSettingsHeader";
import { TeamStatsCards } from "../components/Teams/TeamStatsCards";
import { InviteMemberModal } from "../components/Teams/InviteMemberModal";
import { TeamMembersTable } from "../components/Teams/TeamMembersTable";
import { FolderOpen } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
  joinedAt: string;
  status: "active" | "pending";
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  memberCount: number;
}

export default function TeamSettings() {
  const { toast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    "proj-1"
  );

  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj-1",
      name: "E-commerce Platform",
      status: "active",
      memberCount: 4,
    },
    {
      id: "proj-2",
      name: "Mobile App Redesign",
      status: "active",
      memberCount: 3,
    },
    {
      id: "proj-3",
      name: "Website Migration",
      status: "completed",
      memberCount: 2,
    },
    {
      id: "proj-4",
      name: "Marketing Dashboard",
      status: "on-hold",
      memberCount: 1,
    },
  ]);

  // Mock team members data
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "admin",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Alice",
      joinedAt: "2024-01-15",
      status: "active",
      projectId: "proj-1",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@company.com",
      role: "member",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bob",
      joinedAt: "2024-01-20",
      status: "active",
      projectId: "proj-1",
    },
    {
      id: "3",
      name: "Carol White",
      email: "carol@company.com",
      role: "member",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Carol",
      joinedAt: "2024-02-01",
      status: "active",
      projectId: "proj-1",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@company.com",
      role: "viewer",
      joinedAt: "2024-02-10",
      status: "pending",
      projectId: "proj-1",
    },
    {
      id: "5",
      name: "Emma Davis",
      email: "emma@company.com",
      role: "admin",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Emma",
      joinedAt: "2024-01-10",
      status: "active",
      projectId: "proj-2",
    },
    {
      id: "6",
      name: "Frank Miller",
      email: "frank@company.com",
      role: "member",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Frank",
      joinedAt: "2024-01-25",
      status: "active",
      projectId: "proj-2",
    },
    {
      id: "7",
      name: "Grace Lee",
      email: "grace@company.com",
      role: "member",
      joinedAt: "2024-02-05",
      status: "pending",
      projectId: "proj-2",
    },
  ]);

  // Filter team members by selected project
  const teamMembers = allTeamMembers.filter(
    (member) => member.projectId === selectedProjectId
  );

  const handleInviteMembers = (newMembers: TeamMember[]) => {
    if (!selectedProjectId) return;

    const membersWithProject = newMembers.map((member) => ({
      ...member,
      projectId: selectedProjectId,
    }));

    setAllTeamMembers((prev) => [...prev, ...membersWithProject]);

    // Update project member count
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              memberCount: project.memberCount + membersWithProject.length,
            }
          : project
      )
    );
  };

  const handleRemoveMember = (memberId: string) => {
    const member = allTeamMembers.find((m) => m.id === memberId);
    if (!member) return;

    setAllTeamMembers((prev) => prev.filter((m) => m.id !== memberId));

    // Update project member count
    setProjects((prev) =>
      prev.map((project) =>
        project.id === member.projectId
          ? { ...project, memberCount: Math.max(0, project.memberCount - 1) }
          : project
      )
    );

    toast({
      title: "Member Removed",
      description: `${member.name} has been removed from the project`,
    });
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Team Settings Header */}
        <TeamSettingsHeader
          onInviteClick={() => setIsInviteModalOpen(true)}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={handleProjectChange}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedProjectId ? (
            <div className="p-6 space-y-6">
              {/* Team Stats */}
              <TeamStatsCards teamMembers={teamMembers} />

              {/* Team Members Table */}
              <TeamMembersTable
                teamMembers={teamMembers}
                onRemoveMember={handleRemoveMember}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  No Project Selected
                </h3>
                <p className="text-base max-w-md">
                  Please select a project from the dropdown above to manage team
                  members and their permissions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Invite Member Modal */}
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInviteMembers={handleInviteMembers}
        />
      </div>
    </div>
  );
}
