import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Users } from "lucide-react";

export function OverviewTab() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Designer",
      avatar: "/api/placeholder/32/32",
      initials: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Frontend Dev",
      avatar: "/api/placeholder/32/32",
      initials: "MC",
    },
    {
      name: "Lisa Rodriguez",
      role: "UX Designer",
      avatar: "/api/placeholder/32/32",
      initials: "LR",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Project Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Project Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">E-commerce Redesign</h3>
            <p className="text-muted-foreground">
              Complete redesign of the online store interface with modern UI/UX
              principles, improved user flow, and enhanced mobile
              responsiveness. Focus on increasing conversion rates and user
              engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Deadline</div>
                <div className="text-sm text-muted-foreground">
                  March 15, 2024
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Duration</div>
                <div className="text-sm text-muted-foreground">8 weeks</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-accent/10 text-accent-700"
              >
                In Progress
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Team Members</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.role}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Wireframes completed</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Client feedback received
                </div>
                <div className="text-xs text-muted-foreground">5 hours ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Design review scheduled
                </div>
                <div className="text-xs text-muted-foreground">1 day ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
