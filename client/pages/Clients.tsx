import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  AddClientModal,
  ClientFormData,
} from "@/components/modals/add-client-modal";
import { Plus, Building2, Mail, Phone, MapPin } from "lucide-react";

export default function Clients() {
  const [showAddClient, setShowAddClient] = useState(false);
  const { toast } = useToast();

  const handleCreateClient = async (clientData: ClientFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Client Added",
      description: `${clientData.name} has been added successfully.`,
    });

    console.log("Created client:", clientData);
  };
  const clients = [
    {
      id: 1,
      name: "TechCorp Inc.",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      projects: 3,
      status: "Active",
      avatar: "/api/placeholder/40/40",
      initials: "TC",
    },
    {
      id: 2,
      name: "StartupCo",
      email: "hello@startupco.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      projects: 1,
      status: "Active",
      avatar: "/api/placeholder/40/40",
      initials: "SC",
    },
    {
      id: 3,
      name: "DesignStudio",
      email: "info@designstudio.com",
      phone: "+1 (555) 456-7890",
      location: "Los Angeles, CA",
      projects: 2,
      status: "Completed",
      avatar: "/api/placeholder/40/40",
      initials: "DS",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and contacts
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">Total Clients</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">6</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">2</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {client.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={
                      client.status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{client.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {client.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {client.projects} Projects
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
