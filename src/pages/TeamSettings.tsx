import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
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
  const { user } = useUser();
  const userId = user?.id;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Fetch projects for current user
  const fetchProjects = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, status")
      .eq("clerk_id", userId);

    if (error) {
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const enriched = await Promise.all(
        data.map(async (proj) => {
          const { count } = await supabase
            .from("team_members")
            .select("*", { count: "exact", head: true })
            .eq("project_id", proj.id);
          return {
            ...proj,
            memberCount: count ?? 0,
          };
        })
      );

      setProjects(enriched);
      if (!selectedProjectId && enriched.length > 0) {
        setSelectedProjectId(enriched[0].id);
      }
    }
  };

  // Fetch team members for selected project
  const fetchTeamMembers = async (projectId: string) => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("project_id", projectId);

    if (error) {
      toast({
        title: "Failed to load team members",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTeamMembers(
        data.map((m) => ({
          id: m.id,
          name: m.name || "", // if you store name separately
          email: m.invited_email,
          role: m.role,
          joinedAt: m.joined_at,
          status: m.status,
          projectId: m.project_id,
        }))
      );
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleInviteMembers = (newMembers: TeamMember[]) => {
    if (!selectedProjectId) return;

    const membersWithProject = newMembers.map((member) => ({
      ...member,
      projectId: selectedProjectId,
    }));

    setTeamMembers((prev) => [...prev, ...membersWithProject]);

    // update member count locally
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

  const handleRemoveMember = async (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return;

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));

    setProjects((prev) =>
      prev.map((project) =>
        project.id === member.projectId
          ? { ...project, memberCount: Math.max(0, project.memberCount - 1) }
          : project
      )
    );

    toast({
      title: "Member Removed",
      description: `${member.email} has been removed from the project`,
    });
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <TeamSettingsHeader
          onInviteClick={() => setIsInviteModalOpen(true)}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={handleProjectChange}
        />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {selectedProjectId ? (
            <div className="p-6 space-y-6">
              <TeamStatsCards teamMembers={teamMembers} />
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

        {/* Invite Modal */}
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInviteMembers={handleInviteMembers}
        />
      </div>
    </div>
  );
}
