import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InvoicesTab } from "@/components/workspace/tab-content/invoices-tab";
import {
  AddInvoiceModal,
  InvoiceFormData,
} from "@/components/modals/add-invoice-modal";
import { Plus } from "lucide-react";

export default function Invoices() {
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const { toast } = useToast();

  const handleCreateInvoice = async (invoiceData: InvoiceFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Invoice Created",
      description: `Invoice ${invoiceData.invoiceNumber} has been created successfully.`,
    });

    console.log("Created invoice:", invoiceData);
  };

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

      <InvoicesTab />

      <AddInvoiceModal
        open={showAddInvoice}
        onOpenChange={setShowAddInvoice}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
}
