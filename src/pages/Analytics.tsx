import { AnalyticsTab } from "./../components/workspace/tab-content/analytics-tab";

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track project progress and team performance
        </p>
      </div>
      <AnalyticsTab />
    </div>
  );
}
