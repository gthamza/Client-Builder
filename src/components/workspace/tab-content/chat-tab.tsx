import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Send, Paperclip, Smile } from "lucide-react";
import { useState } from "react";

export function ChatTab() {
  const [message, setMessage] = useState("");

  const messages = [
    {
      id: 1,
      sender: "Emma Wilson",
      avatar: "/api/placeholder/32/32",
      initials: "EW",
      message:
        "Hi team! I've reviewed the latest wireframes and they look great.",
      time: "10:30 AM",
      isCurrentUser: false,
    },
    {
      id: 2,
      sender: "You",
      avatar: "/api/placeholder/32/32",
      initials: "JD",
      message:
        "Thanks Emma! I've made the changes based on your feedback from yesterday.",
      time: "10:32 AM",
      isCurrentUser: true,
    },
    {
      id: 3,
      sender: "Mike Chen",
      avatar: "/api/placeholder/32/32",
      initials: "MC",
      message:
        "The new color scheme works much better with our brand guidelines.",
      time: "10:35 AM",
      isCurrentUser: false,
    },
    {
      id: 4,
      sender: "Emma Wilson",
      avatar: "/api/placeholder/32/32",
      initials: "EW",
      message: "Can we schedule a quick review meeting for tomorrow?",
      time: "10:40 AM",
      isCurrentUser: false,
    },
    {
      id: 5,
      sender: "You",
      avatar: "/api/placeholder/32/32",
      initials: "JD",
      message: "Sure! How about 2 PM?",
      time: "10:42 AM",
      isCurrentUser: true,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Header */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Project Chat</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-success/10 text-success">
              3 online
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    msg.isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.avatar} alt={msg.sender} />
                    <AvatarFallback
                      className={
                        msg.isCurrentUser
                          ? "bg-primary-100 text-primary-700"
                          : "bg-accent-100 text-accent-700"
                      }
                    >
                      {msg.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div
                      className={`text-xs text-muted-foreground ${
                        msg.isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {!msg.isCurrentUser && (
                        <span className="font-medium">{msg.sender} • </span>
                      )}
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                className="bg-primary hover:bg-primary-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Members */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Online Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="Emma Wilson" />
                <AvatarFallback className="bg-accent-100 text-accent-700">
                  EW
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Emma Wilson</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="Mike Chen" />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  MC
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Mike Chen</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
