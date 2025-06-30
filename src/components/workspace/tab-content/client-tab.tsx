import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  MessageSquare,
} from "lucide-react";

export function ClientTab() {
  return (
    <div className="space-y-6">
      {/* Client Profile */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Client Information</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/api/placeholder/80/80" alt="TechCorp Inc." />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
                TC
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">TechCorp Inc.</h3>
                <p className="text-muted-foreground">
                  Leading technology solutions provider
                </p>
                <Badge variant="secondary" className="mt-2">
                  Enterprise Client
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">
                        contact@techcorp.com
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">
                        +1 (555) 123-4567
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Website</div>
                      <div className="text-sm text-muted-foreground">
                        www.techcorp.com
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">
                        123 Tech Street, San Francisco, CA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Contacts */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Key Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/api/placeholder/40/40" alt="Emma Wilson" />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    EW
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Emma Wilson</div>
                  <div className="text-sm text-muted-foreground">
                    Project Manager
                  </div>
                  <div className="text-sm text-muted-foreground">
                    emma.wilson@techcorp.com
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/api/placeholder/40/40" alt="David Chen" />
                  <AvatarFallback className="bg-accent-100 text-accent-700">
                    DC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">David Chen</div>
                  <div className="text-sm text-muted-foreground">
                    Technical Lead
                  </div>
                  <div className="text-sm text-muted-foreground">
                    david.chen@techcorp.com
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project History */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Project History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">E-commerce Redesign</div>
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent-700"
                  >
                    Current
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Started January 2024
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Mobile App Development</div>
                  <Badge variant="outline" className="text-success">
                    Completed
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed December 2023
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Brand Identity Refresh</div>
                  <Badge variant="outline" className="text-success">
                    Completed
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed October 2023
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
