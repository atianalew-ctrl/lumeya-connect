import { useState } from "react";
import { Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  unread: number;
  color: string;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 1, name: "GlowCo", role: "Skincare Brand", lastMessage: "Sounds great! Let's schedule a call.", unread: 2, color: "bg-peach",
    messages: [
      { id: 1, text: "Hi! We loved your portfolio. Would you be interested in creating UGC for our new serum?", sender: "them", time: "10:30 AM" },
      { id: 2, text: "Thank you! I'd love to learn more about the project. What's the timeline?", sender: "me", time: "10:45 AM" },
      { id: 3, text: "We're looking to launch in 3 weeks. We'd need 5 short-form videos.", sender: "them", time: "11:00 AM" },
      { id: 4, text: "That works for me! I can start next week. What's the budget range?", sender: "me", time: "11:15 AM" },
      { id: 5, text: "Sounds great! Let's schedule a call.", sender: "them", time: "11:30 AM" },
    ],
  },
  {
    id: 2, name: "FitPulse", role: "Fitness App", lastMessage: "Can you send over your rates?", unread: 0, color: "bg-lavender",
    messages: [
      { id: 1, text: "Hey! We're looking for a TikTok content manager. Interested?", sender: "them", time: "Yesterday" },
      { id: 2, text: "Absolutely! I have experience managing fitness accounts.", sender: "me", time: "Yesterday" },
      { id: 3, text: "Can you send over your rates?", sender: "them", time: "Yesterday" },
    ],
  },
  {
    id: 3, name: "Wanderlust Travel", role: "Travel Company", lastMessage: "The Bali shoot sounds amazing!", unread: 1, color: "bg-secondary",
    messages: [
      { id: 1, text: "We have an exciting brand film opportunity in Bali. Would you be available in April?", sender: "them", time: "2 days ago" },
      { id: 2, text: "The Bali shoot sounds amazing!", sender: "me", time: "2 days ago" },
    ],
  },
];

const Messages = () => {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, Message[]>>(
    Object.fromEntries(conversations.map((c) => [c.id, c.messages]))
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLocalMessages((prev) => ({
      ...prev,
      [activeConvo.id]: [...(prev[activeConvo.id] || []), msg],
    }));
    setNewMessage("");
  };

  const filteredConvos = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card" style={{ height: "calc(100vh - 140px)" }}>
        <div className="grid h-full md:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <div className="border-r border-border flex flex-col">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-bold">Messages</h2>
              <div className="relative mt-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConvos.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setActiveConvo(convo)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${
                    activeConvo.id === convo.id ? "bg-muted" : ""
                  }`}
                >
                  <div className={`h-10 w-10 shrink-0 rounded-full ${convo.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{convo.name}</span>
                      {convo.unread > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{convo.role}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{convo.lastMessage}</p>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="flex flex-col">
            <div className="border-b border-border p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-full ${activeConvo.color}`} />
              <div>
                <h3 className="text-sm font-semibold">{activeConvo.name}</h3>
                <p className="text-xs text-muted-foreground">{activeConvo.role}</p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {(localMessages[activeConvo.id] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === "me"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
