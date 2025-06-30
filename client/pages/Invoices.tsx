import { InvoicesTab } from "@/components/workspace/tab-content/invoices-tab";

export default function Invoices() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Manage billing and track payments
        </p>
      </div>
      <InvoicesTab />
    </div>
  );
}
