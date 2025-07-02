import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  BarChart3,
  FileText,
  MessageSquare,
  Receipt,
  Upload,
  Users,
} from "lucide-react";
import { OverviewTab } from "./tab-content/overview-tab";
import { ClientTab } from "./tab-content/client-tab";
import { FilesTab } from "./tab-content/files-tab";
import { ChatTab } from "./tab-content/chat-tab";
import { InvoicesTab } from "./tab-content/invoices-tab";
import { AnalyticsTab } from "./tab-content/analytics-tab";

export function WorkspaceTabs() {
  return (
    <div className="flex-1 p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="client"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Client</span>
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Files</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center space-x-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="client">
            <ClientTab />
          </TabsContent>
          <TabsContent value="files">
            <FilesTab />
          </TabsContent>
          <TabsContent value="chat">
            <ChatTab />
          </TabsContent>
          <TabsContent value="invoices">
            <InvoicesTab />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
