import { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useToast } from "../hooks/use-toast";
import {
  AddClientModal,
  ClientFormData,
} from "../components/modals/add-client-modal";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@clerk/clerk-react";

// ✅ Supabase client from env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function Clients() {
  const [showAddClient, setShowAddClient] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const { toast } = useToast();
  const { userId } = useAuth();

  // ✅ Fetch clients and projects
  const fetchClients = async () => {
    if (!userId) return;

    try {
      const [
        { data: clientsData, error: clientsError },
        { data: projectsData, error: projectsError },
      ] = await Promise.all([
        supabase.from("clients").select("*").eq("clerk_id", userId),
        supabase.from("projects").select("client_id").eq("clerk_id", userId),
      ]);

      if (clientsError || projectsError) {
        console.error("Error:", clientsError || projectsError);
        return;
      }

      const projectMap = projectsData.reduce(
        (acc: Record<string, number>, proj) => {
          acc[proj.client_id] = (acc[proj.client_id] || 0) + 1;
          return acc;
        },
        {}
      );

      const enriched = clientsData.map((client) => ({
        ...client,
        projects: projectMap[client.id] || 0,
      }));

      setClients(enriched);
    } catch (err) {
      console.error("Unexpected fetch error:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchClients();
  }, [userId]);

  // ✅ Create or update client
  const handleCreateOrUpdateClient = async (clientData: ClientFormData) => {
    if (!userId) return;

    const initials = clientData.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
      clientData.name
    )}`;

    const clientPayload = {
      name: clientData.name.trim(),
      email: clientData.email?.trim() || "",
      phone: clientData.phone?.trim() || "",
      location: clientData.location?.trim() || "",
      status: clientData.status?.toLowerCase() || "active",
      initials,
      avatar,
      clerk_id: userId,
    };

    try {
      let error;
      if (editingClient) {
        ({ error } = await supabase
          .from("clients")
          .update(clientPayload)
          .eq("id", editingClient.id));
      } else {
        ({ error } = await supabase.from("clients").insert(clientPayload));
      }

      if (error) throw error;

      toast({
        title: editingClient ? "Client Updated" : "Client Added",
        description: `${clientData.name} successfully ${
          editingClient ? "updated" : "added"
        }.`,
      });

      fetchClients();
      setShowAddClient(false);
      setEditingClient(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save client.",
        variant: "destructive",
      });
    }
  };

  // ✅ Delete client
  const handleDeleteClient = async (id: string) => {
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
        description: "Client has been removed.",
      });
      fetchClients();
    }
  };

  const activeClients = clients.filter((c) => c.status === "active");
  const completedClients = clients.filter((c) => c.status === "completed");
  const totalProjects = clients.reduce((sum, c) => sum + (c.projects || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client companies</p>
        </div>
        <Button
          onClick={() => {
            setEditingClient(null);
            setShowAddClient(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{clients.length}</div>
            <div className="text-sm text-muted-foreground">Total Clients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeClients.length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {completedClients.length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalProjects}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback>{client.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-black border border-gray-400 text-white p-1 hover:bg-gray-900"
                        onClick={() => {
                          setEditingClient(client);
                          setShowAddClient(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>

                      <Button
                        size="icon"
                        className="h-8 w-8 bg-black border border-gray-400 hover:bg-gray-900"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <Badge
                    className={
                      client.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{client.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>{client.projects} Projects</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <AddClientModal
        open={showAddClient}
        onOpenChange={(open) => {
          if (!open) setEditingClient(null);
          setShowAddClient(open);
        }}
        onSubmit={handleCreateOrUpdateClient}
        defaultValues={editingClient}
      />
    </div>
  );
}
