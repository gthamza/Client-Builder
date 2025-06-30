import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Download,
  Send,
  Eye,
  MoreHorizontal,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

export function InvoicesTab() {
  const invoices = [
    {
      id: "INV-001",
      amount: "$5,200.00",
      status: "paid",
      dueDate: "Feb 15, 2024",
      issueDate: "Jan 15, 2024",
      description: "Website Design - Phase 1",
    },
    {
      id: "INV-002",
      amount: "$3,800.00",
      status: "unpaid",
      dueDate: "Mar 1, 2024",
      issueDate: "Feb 1, 2024",
      description: "UI/UX Design Services",
    },
    {
      id: "INV-003",
      amount: "$2,100.00",
      status: "overdue",
      dueDate: "Jan 30, 2024",
      issueDate: "Jan 1, 2024",
      description: "Wireframe Development",
    },
    {
      id: "INV-004",
      amount: "$4,500.00",
      status: "draft",
      dueDate: "Mar 15, 2024",
      issueDate: "Mar 1, 2024",
      description: "Frontend Development",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success hover:bg-success/20";
      case "unpaid":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "overdue":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "draft":
        return "bg-muted text-muted-foreground hover:bg-muted/80";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[$,]/g, "")), 0);

  const totalUnpaid = invoices
    .filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6">
      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Paid</div>
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
                <div className="text-sm text-muted-foreground">
                  Pending Payment
                </div>
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
                <div className="text-sm text-muted-foreground">This Month</div>
                <div className="text-2xl font-bold">$8,300</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button className="bg-primary hover:bg-primary-600">
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
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{invoice.amount}</div>
                    <div className="text-sm text-muted-foreground">
                      Due {invoice.dueDate}
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
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {invoice.status === "unpaid" && (
                      <Button variant="ghost" size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Send className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
