import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import {
  AddInvoiceModal,
  InvoiceFormData,
} from "../components/modals/add-invoice-modal";
import {
  Plus,
  Download,
  DollarSign,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { supabase } from "../lib/supabase";
import { useUser } from "@clerk/clerk-react";
import { getInvoiceStatus } from "../lib/getInvoiceStatus";
import { ConfirmDialog } from "../components/modals/confirm-dialog";
import { generateInvoicePdf } from "../lib/generateInvoicePdf";

export default function Invoices() {
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const userId = user?.id;
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success hover:bg-success/20";
      case "unpaid":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "overdue":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "draft":
        return "bg-muted text-green-100 hover:bg-muted/80";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalUnpaid = invoices
    .filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  const fetchInvoices = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("invoices")
      .select("*, client:clients(name), project:projects(name)")
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      return;
    }

    const enriched = data.map((invoice) => ({
      ...invoice,
      status: getInvoiceStatus(invoice.status, invoice.due_date),
    }));

    setInvoices(enriched);
  };

  const fetchClients = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error fetching clients:", error);
    } else {
      setClients(data || []);
    }
  };

  const fetchProjects = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  const handleCreateInvoice = async (invoiceData: InvoiceFormData) => {
    try {
      const { data: invoice, error } = await supabase
        .from("invoices")
        .insert([
          {
            clerk_id: userId,
            client_id: invoiceData.client,
            project_id: invoiceData.project || null,
            invoice_number: `INV-${invoiceData.invoiceNumber}`,
            issue_date: invoiceData.issueDate?.toISOString(),
            due_date: invoiceData.dueDate?.toISOString(),
            notes: invoiceData.notes,
            status: invoiceData.status,
            total: invoiceData.items.reduce(
              (sum, item) => sum + item.amount,
              0
            ),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const itemsToInsert = invoiceData.items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Invoice Created",
        description: `Invoice INV-${invoiceData.invoiceNumber} has been saved.`,
      });

      fetchInvoices();
      setShowAddInvoice(false);
    } catch (error) {
      console.error("Invoice save error:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Check console for details.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchProjects();
  }, [userId]);

  const handleDeleteConfirm = async () => {
    if (!selectedInvoiceId) return;
    await supabase.from("invoices").delete().eq("id", selectedInvoiceId);
    fetchInvoices();
    setShowDeleteDialog(false);
    setSelectedInvoiceId(null);
  };

  const handleUpdateInvoice = async (invoiceData: InvoiceFormData) => {
    if (!editingInvoice) return;

    try {
      // Format invoice number
      const formattedInvoiceNumber = invoiceData.invoiceNumber.startsWith(
        "INV-"
      )
        ? invoiceData.invoiceNumber
        : `INV-${invoiceData.invoiceNumber}`;

      // Update invoice
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          invoice_number: formattedInvoiceNumber,
          client_id: invoiceData.client,
          project_id: invoiceData.project || null,
          issue_date: invoiceData.issueDate?.toISOString(),
          due_date: invoiceData.dueDate?.toISOString(),
          notes: invoiceData.notes,
          status: invoiceData.status,
          total: invoiceData.items.reduce((sum, item) => sum + item.amount, 0),
        })
        .eq("id", editingInvoice.id);

      if (updateError) throw updateError;

      // Delete old invoice items
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", editingInvoice.id);

      if (deleteError) throw deleteError;

      // Insert new invoice items
      const newItems = invoiceData.items.map((item) => ({
        invoice_id: editingInvoice.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
      }));

      const { error: insertError } = await supabase
        .from("invoice_items")
        .insert(newItems);

      if (insertError) throw insertError;

      toast({
        title: "Invoice Updated",
        description: `Invoice ${formattedInvoiceNumber} was updated successfully.`,
      });

      setEditingInvoice(null);
      setShowAddInvoice(false);
      fetchInvoices();
    } catch (err) {
      console.error("Update invoice error:", err);
      toast({
        title: "Error",
        description: "Failed to update invoice. Check console.",
        variant: "destructive",
      });
    }
  };

  const totalThisMonth = invoices
    .filter((inv) => {
      const issueDate = new Date(inv.issue_date);
      const now = new Date();
      return (
        issueDate.getMonth() === now.getMonth() &&
        issueDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage billing and track payments
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600"
          onClick={() => setShowAddInvoice(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Paid
                  </div>
                  <div className="text-2xl font-bold">
                    ${totalPaid.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold">
                    ${totalUnpaid.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    This Month
                  </div>
                  <div className="text-2xl font-bold">
                    ${totalThisMonth.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <Button
              className="bg-primary hover:bg-primary-600"
              onClick={() => setShowAddInvoice(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.notes || "No description"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">${invoice.total}</div>
                      <div className="text-sm text-muted-foreground">
                        Due {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className={getStatusColor(invoice.status)}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </Badge>

                    <div className="flex items-center space-x-1">
                      {/* Download Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const { data: items, error } = await supabase
                            .from("invoice_items")
                            .select("*")
                            .eq("invoice_id", invoice.id);

                          if (error) {
                            toast({
                              title: "Error",
                              description: "Failed to fetch invoice items.",
                              variant: "destructive",
                            });
                            return;
                          }

                          await generateInvoicePdf({ ...invoice, items });
                        }}
                      >
                        <Download className="w-4 h-4 text-green-500" />
                      </Button>

                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const { data: items, error } = await supabase
                            .from("invoice_items")
                            .select("*")
                            .eq("invoice_id", invoice.id);

                          if (error) {
                            toast({
                              title: "Error",
                              description: "Failed to fetch invoice items.",
                              variant: "destructive",
                            });
                            return;
                          }

                          setEditingInvoice({ ...invoice, items });
                          setShowAddInvoice(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInvoiceId(invoice.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddInvoiceModal
        open={showAddInvoice}
        onOpenChange={(open) => {
          if (!open) setEditingInvoice(null); // clear editing state on close
          setShowAddInvoice(open);
        }}
        onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
        clients={clients}
        projects={projects}
        initialData={editingInvoice}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedInvoiceId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </div>
  );
}
