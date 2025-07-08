import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useToast } from "../../hooks/use-toast";
import { Mail, Shield, Crown, User, Link, Copy, Users } from "lucide-react";

interface InviteFormData {
  email: string;
  role: "admin" | "member" | "viewer";
  name?: string;
  sendWelcomeEmail: boolean;
  customMessage: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
  joinedAt: string;
  status: "active" | "pending";
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteMembers: (members: TeamMember[]) => void;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onInviteMembers,
}: InviteMemberModalProps) {
  const { toast } = useToast();
  const [inviteTab, setInviteTab] = useState("single");
  const [inviteForm, setInviteForm] = useState<InviteFormData>({
    email: "",
    role: "member",
    name: "",
    sendWelcomeEmail: true,
    customMessage: "",
  });
  const [bulkEmailText, setBulkEmailText] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const resetForm = () => {
    setInviteForm({
      email: "",
      role: "member",
      name: "",
      sendWelcomeEmail: true,
      customMessage: "",
    });
    setBulkEmailText("");
    setInviteLink("");
    setInviteTab("single");
  };

  const generateInviteLink = async () => {
    setIsGeneratingLink(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const linkId = Math.random().toString(36).substring(7);
    const generatedLink = `https://app.yourcompany.com/invite/${linkId}?role=${inviteForm.role}`;
    setInviteLink(generatedLink);
    setIsGeneratingLink(false);

    toast({
      title: "Link Generated",
      description: "Invite link has been created successfully",
    });
  };

  const handleSingleInvite = () => {
    if (!inviteForm.email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteForm.name || inviteForm.email.split("@")[0],
      email: inviteForm.email,
      role: inviteForm.role,
      joinedAt: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    onInviteMembers([newMember]);

    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${inviteForm.email}${
        inviteForm.sendWelcomeEmail ? " with welcome email" : ""
      }`,
    });

    resetForm();
    onClose();
  };

  const handleBulkInvite = () => {
    const emails = bulkEmailText
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email && email.includes("@"));

    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one valid email address",
        variant: "destructive",
      });
      return;
    }

    const newMembers: TeamMember[] = emails.map((email, index) => ({
      id: (Date.now() + index).toString(),
      name: email.split("@")[0],
      email: email,
      role: inviteForm.role,
      joinedAt: new Date().toISOString().split("T")[0],
      status: "pending",
    }));

    onInviteMembers(newMembers);

    toast({
      title: "Bulk Invitations Sent",
      description: `${emails.length} invitations have been sent successfully`,
    });

    resetForm();
    onClose();
  };

  const handleLinkInvite = () => {
    if (!inviteLink) {
      toast({
        title: "Error",
        description: "Please generate an invite link first",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(inviteLink);

    toast({
      title: "Link Ready",
      description: "Invite link copied to clipboard and ready to share",
    });

    onClose();
  };

  const handleSubmit = () => {
    if (inviteTab === "single") {
      handleSingleInvite();
    } else if (inviteTab === "bulk") {
      handleBulkInvite();
    } else if (inviteTab === "link") {
      handleLinkInvite();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Team Members</DialogTitle>
          <DialogDescription>
            Invite new members to join your team using different methods.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={inviteTab} onValueChange={setInviteTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Single</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center space-x-1">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">Link</span>
            </TabsTrigger>
          </TabsList>

          {/* Single Invite Tab */}
          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@company.com"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role & Permissions</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value: "admin" | "member" | "viewer") =>
                  setInviteForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="font-medium">Viewer</div>
                        <div className="text-xs text-muted-foreground">
                          Read-only access
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="member">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Member</div>
                        <div className="text-xs text-muted-foreground">
                          Standard access
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">Admin</div>
                        <div className="text-xs text-muted-foreground">
                          Full access & management
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Custom Welcome Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Welcome to our team! We're excited to have you join us..."
                value={inviteForm.customMessage}
                onChange={(e) =>
                  setInviteForm((prev) => ({
                    ...prev,
                    customMessage: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="welcome-email"
                checked={inviteForm.sendWelcomeEmail}
                onCheckedChange={(checked) =>
                  setInviteForm((prev) => ({
                    ...prev,
                    sendWelcomeEmail: checked,
                  }))
                }
              />
              <Label htmlFor="welcome-email">
                Send welcome email notification
              </Label>
            </div>
          </TabsContent>

          {/* Bulk Invite Tab */}
          <TabsContent value="bulk" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-emails">Email Addresses</Label>
              <Textarea
                id="bulk-emails"
                placeholder="Enter email addresses (one per line):&#10;john@company.com&#10;jane@company.com&#10;mike@company.com"
                value={bulkEmailText}
                onChange={(e) => setBulkEmailText(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Enter one email address per line. You can also paste from a
                spreadsheet.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Default Role for All Members</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value: "admin" | "member" | "viewer") =>
                  setInviteForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Read only</SelectItem>
                  <SelectItem value="member">
                    Member - Standard access
                  </SelectItem>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkEmailText && (
              <div className="border rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">
                  Preview (
                  {bulkEmailText.split("\n").filter((e) => e.trim()).length}{" "}
                  emails):
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {bulkEmailText
                    .split("\n")
                    .filter((email) => email.trim())
                    .map((email, index) => (
                      <div
                        key={index}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {email.trim()}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Invite Link Tab */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="text-center space-y-4">
              <div className="p-6 border-2 border-dashed border-border rounded-lg">
                <Link className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Generate Invite Link
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a shareable link that allows people to join your team
                  directly.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Role for Link Invites</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: "admin" | "member" | "viewer") =>
                        setInviteForm((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={generateInviteLink}
                    disabled={isGeneratingLink}
                    className="w-full"
                  >
                    {isGeneratingLink ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        Generate Invite Link
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {inviteLink && (
                <div className="space-y-2">
                  <Label>Shareable Invite Link</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLink);
                        toast({
                          title: "Copied!",
                          description: "Invite link copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This link will expire in 7 days. Anyone with this link can
                    join your team.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            <Mail className="w-4 h-4 mr-2" />
            {inviteTab === "bulk" ? "Send Bulk Invites" : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
