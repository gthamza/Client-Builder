import { ChatTab } from "./../components/workspace/tab-content/chat-tab";

export default function Chat() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Chat</h1>
        <p className="text-muted-foreground">
          Communicate with your team and clients
        </p>
      </div>
      <ChatTab />
    </div>
  );
}
