import { FilesTab } from "@/components/workspace/tab-content/files-tab";

export default function Files() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Files</h1>
        <p className="text-muted-foreground">
          Manage and organize all your project files
        </p>
      </div>
      <FilesTab />
    </div>
  );
}
