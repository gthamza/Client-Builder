import { Card, CardContent } from "../ui/card";
import { Users, Shield, Mail, Crown } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
  joinedAt: string;
  status: "active" | "pending";
}

interface TeamStatsCardsProps {
  teamMembers: TeamMember[];
}

export function TeamStatsCards({ teamMembers }: TeamStatsCardsProps) {
  const teamStats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === "active").length,
    pending: teamMembers.filter((m) => m.status === "pending").length,
    admins: teamMembers.filter((m) => m.role === "admin").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{teamStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {teamStats.active}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Mail className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {teamStats.pending}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Crown className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {teamStats.admins}
              </div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
