import { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { Badge } from "./../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./../components/ui/avatar";
import { useToast } from "./../hooks/use-toast";
import {
  AddClientModal,
  ClientFormData,
} from "./../components/modals/add-client-modal";
import { useSupabaseClient } from "../lib/supabaseClient";
import { useAuth } from "@clerk/clerk-react";

export default function Clients() {
  const [showAddClient, setShowAddClient] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const { toast } = useToast();
  const { getClient } = useSupabaseClient();
  const { userId } = useAuth();

  const fetchClients = async () => {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching clients:", error.message);
    } else {
      setClients(data);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateOrUpdateClient = async (clientData: ClientFormData) => {
    const supabase = await getClient();

    const initials = clientData.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?jack=${encodeURIComponent(
      clientData.name
    )}`;

    let error;
    if (editingClient) {
      // Update
      ({ error } = await supabase
        .from("clients")
        .update({
          ...clientData,
          initials,
          avatar,
        })
        .eq("id", editingClient.id));
    } else {
      // Insert
      ({ error } = await supabase.from("clients").insert({
        ...clientData,
        initials,
        avatar,
        clerk_id: userId,
      }));
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editingClient ? "Client Updated" : "Client Added",
        description: `${clientData.name} has been successfully ${
          editingClient ? "updated" : "added"
        }.`,
      });
      fetchClients();
    }

    setEditingClient(null); // reset editing state
  };

  const handleDeleteClient = async (id: string) => {
    const supabase = await getClient();
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Client Deleted",
        description: "Client has been successfully deleted.",
      });
      fetchClients();
    }
  };

  const handleEditClick = (client: any) => {
    setEditingClient(client);
    setShowAddClient(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and contacts
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600"
          onClick={() => {
            setEditingClient(null); // reset before adding new
            setShowAddClient(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{client.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEditClick(client)}
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="text-muted-foreground text-red-600 " />
                      </Button>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      client.status === "active"
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
                    {client.projects ?? 0} Projects
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddClientModal
        open={showAddClient}
        onOpenChange={(open) => {
          if (!open) {
            setEditingClient(null);
          }
          setShowAddClient(open);
        }}
        onSubmit={handleCreateOrUpdateClient}
        defaultValues={editingClient}
      />
    </div>
  );
}
