import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Search, Pin, Smile, Paperclip, MoreHorizontal,
  Check, CheckCheck, Star, Reply, Copy, Trash2, Phone,
  Video, Info, ImageIcon, FileText, Heart, ThumbsUp,
  Sparkles, ChevronDown, X, Plus, Mic,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Types
interface Reaction { emoji: string; count: number; mine: boolean }
interface Message {
  id: number; text: string; sender: "me" | "them";
  time: string; status?: "sent" | "delivered" | "read";
  pinned?: boolean; starred?: boolean; replyTo?: number;
  reactions?: Reaction[]; type?: "text" | "image" | "file" | "brief";
  fileLabel?: string;
}
interface Conversation {
  id: number; name: string; role: string; avatar: string;
  lastMessage: string; unread: number; online: boolean;
  messages: Message[];
}

// ── Demo data
const CONVOS: Conversation[] = [
  {
    id: 1, name: "GlowCo", role: "Skincare Brand", online: true,
    avatar: "https://ui-avatars.com/api/?name=GlowCo&background=f0e6d3&color=8a6a4a&bold=true&size=128",
    lastMessage: "Sounds great! Let's schedule a call.", unread: 2,
    messages: [
      { id: 1, text: "Hi! We loved your portfolio. Would you be interested in creating UGC for our new serum?", sender: "them", time: "10:30 AM", status: "read" },
      { id: 2, text: "Thank you! I'd love to learn more about the project. What's the timeline?", sender: "me", time: "10:45 AM", status: "read" },
      { id: 3, text: "We're looking to launch in 3 weeks. We'd need 5 short-form videos — unboxing + lifestyle.", sender: "them", time: "11:00 AM", status: "read" },
      { id: 4, text: "That works perfectly! I can start next week. Budget range?", sender: "me", time: "11:15 AM", status: "read", starred: true },
      { id: 5, text: "We're offering €350 per video, so €1,750 total. Plus product worth €200.", sender: "them", time: "11:22 AM", status: "read", pinned: true },
      { id: 6, text: "Sounds great! Let's schedule a call.", sender: "them", time: "11:30 AM", status: "read" },
    ],
  },
  {
    id: 2, name: "NA-KD", role: "Fashion Brand", online: false,
    avatar: "https://ui-avatars.com/api/?name=NAKD&background=e8e0f5&color=6a4a8a&bold=true&size=128",
    lastMessage: "Can you send your media kit?", unread: 1,
    messages: [
      { id: 1, text: "Hey! We're scouting creators for our SS26 campaign. Your aesthetic is very on-brand for us.", sender: "them", time: "Yesterday", status: "read" },
      { id: 2, text: "Oh wow, I love NA-KD! Would love to hear more about the campaign.", sender: "me", time: "Yesterday", status: "read" },
      { id: 3, text: "Can you send your media kit?", sender: "them", time: "Yesterday", status: "delivered", pinned: true },
    ],
  },
  {
    id: 3, name: "Wanderlust Travel", role: "Travel Company", online: true,
    avatar: "https://ui-avatars.com/api/?name=WT&background=d3e6f0&color=2a6a8a&bold=true&size=128",
    lastMessage: "The Bali shoot sounds incredible!", unread: 0,
    messages: [
      { id: 1, text: "We have an exciting brand film opportunity in Bali. Available in April?", sender: "them", time: "2 days ago", status: "read" },
      { id: 2, text: "April works! Tell me everything 🌿", sender: "me", time: "2 days ago", status: "read" },
      { id: 3, text: "The Bali shoot sounds incredible!", sender: "them", time: "2 days ago", status: "read" },
    ],
  },
  {
    id: 4, name: "Arket", role: "Lifestyle Brand", online: false,
    avatar: "https://ui-avatars.com/api/?name=AR&background=e6e6e6&color=333333&bold=true&size=128",
    lastMessage: "Brief is attached — let us know!", unread: 0,
    messages: [
      { id: 1, text: "We'd love to collaborate for our new minimalist home collection.", sender: "them", time: "3 days ago", status: "read" },
      { id: 2, text: "Brief is attached — let us know!", sender: "them", time: "3 days ago", status: "read", type: "brief", fileLabel: "Arket_Home_Campaign_Brief.pdf" },
    ],
  },
];

const EMOJI_REACTIONS = ["❤️", "🔥", "👏", "😍", "✨", "💯"];

// ── Reaction bubble
const ReactionPill = ({ r, onToggle }: { r: Reaction; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition-all ${
      r.mine ? "border-primary/40 bg-primary/10" : "border-border bg-card"
    }`}
  >
    {r.emoji} <span className="text-[10px] text-muted-foreground">{r.count}</span>
  </button>
);

// ── Individual message
const MessageBubble = ({
  msg, allMessages, onPin, onStar, onReply, onReact, onDelete,
}: {
  msg: Message; allMessages: Message[];
  onPin: (id: number) => void; onStar: (id: number) => void;
  onReply: (id: number) => void; onReact: (id: number, emoji: string) => void;
  onDelete: (id: number) => void;
}) => {
  const isMe = msg.sender === "me";
  const [menu, setMenu] = useState(false);
  const [picker, setPicker] = useState(false);
  const replied = msg.replyTo ? allMessages.find(m => m.id === msg.replyTo) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-2 ${isMe ? "flex-row-reverse" : ""} relative`}
    >
      <div className={`max-w-[72%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}>
        {/* Reply preview */}
        {replied && (
          <div className={`text-[10px] px-3 py-1.5 rounded-lg border-l-2 border-primary bg-accent/50 text-muted-foreground max-w-full truncate ${isMe ? "self-end" : ""}`}>
            <span className="font-medium text-primary">{replied.sender === "me" ? "You" : "Them"}</span>{" "}
            {replied.text.slice(0, 60)}{replied.text.length > 60 ? "…" : ""}
          </div>
        )}

        {/* Bubble */}
        <div className="relative flex items-end gap-1.5">
          {/* Action bar — appears on hover */}
          <div className={`absolute ${isMe ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-card border border-border rounded-full px-2 py-1 shadow-sm z-10`}>
            <button onClick={() => setPicker(!picker)} className="text-muted-foreground hover:text-foreground transition-colors p-0.5"><Smile size={13} /></button>
            <button onClick={() => onReply(msg.id)} className="text-muted-foreground hover:text-foreground transition-colors p-0.5"><Reply size={13} /></button>
            <button onClick={() => onPin(msg.id)} className={`transition-colors p-0.5 ${msg.pinned ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}><Pin size={13} /></button>
            <button onClick={() => onStar(msg.id)} className={`transition-colors p-0.5 ${msg.starred ? "text-amber-400" : "text-muted-foreground hover:text-foreground"}`}><Star size={13} /></button>
            <button onClick={() => { navigator.clipboard.writeText(msg.text); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground transition-colors p-0.5"><Copy size={13} /></button>
            {isMe && <button onClick={() => onDelete(msg.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-0.5"><Trash2 size={13} /></button>}
          </div>

          {/* Emoji picker */}
          <AnimatePresence>
            {picker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`absolute ${isMe ? "right-full mr-2" : "left-full ml-2"} top-0 bg-card border border-border rounded-full px-3 py-2 flex gap-2 shadow-md z-20`}
              >
                {EMOJI_REACTIONS.map(e => (
                  <button key={e} onClick={() => { onReact(msg.id, e); setPicker(false); }} className="text-base hover:scale-125 transition-transform">{e}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message content */}
          {msg.type === "brief" || msg.type === "file" ? (
            <div className={`flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 ${isMe ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
              <FileText size={20} className="text-primary shrink-0" />
              <div>
                <p className="text-xs font-medium">{msg.fileLabel || "Attachment"}</p>
                <p className="text-[10px] text-muted-foreground">PDF · Tap to open</p>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isMe
                ? "bg-foreground text-background rounded-tr-sm"
                : "bg-card border border-border rounded-tl-sm"
            }`}>
              {msg.pinned && <span className="text-[9px] uppercase tracking-wider text-primary/70 block mb-1 font-medium">📌 Pinned</span>}
              {msg.starred && <span className="text-[9px] uppercase tracking-wider text-amber-500 block mb-1 font-medium">⭐ Starred</span>}
              {msg.text}
            </div>
          )}
        </div>

        {/* Reactions */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className={`flex gap-1 flex-wrap ${isMe ? "justify-end" : ""}`}>
            {msg.reactions.map((r, i) => (
              <ReactionPill key={i} r={r} onToggle={() => onReact(msg.id, r.emoji)} />
            ))}
          </div>
        )}

        {/* Time + status */}
        <div className={`flex items-center gap-1.5 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
          {isMe && msg.status === "read" && <CheckCheck size={11} className="text-primary" />}
          {isMe && msg.status === "delivered" && <CheckCheck size={11} className="text-muted-foreground" />}
          {isMe && msg.status === "sent" && <Check size={11} className="text-muted-foreground" />}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Messages page
const Messages = () => {
  const [convos, setConvos] = useState(CONVOS);
  const [activeId, setActiveId] = useState(1);
  const [newMsg, setNewMsg] = useState("");
  const [search, setSearch] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [showPinned, setShowPinned] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;
  const filtered = convos.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const pinnedMessages = active.messages.filter(m => m.pinned);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeId, active.messages.length]);

  const updateMsg = (msgId: number, update: Partial<Message>) => {
    setConvos(cs => cs.map(c => c.id === activeId
      ? { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, ...update } : m) }
      : c
    ));
  };

  const handlePin = (id: number) => {
    const msg = active.messages.find(m => m.id === id);
    updateMsg(id, { pinned: !msg?.pinned });
    toast.success(msg?.pinned ? "Unpinned" : "Message pinned 📌");
  };

  const handleStar = (id: number) => {
    const msg = active.messages.find(m => m.id === id);
    updateMsg(id, { starred: !msg?.starred });
    toast.success(msg?.starred ? "Unstarred" : "Starred ⭐");
  };

  const handleReact = (id: number, emoji: string) => {
    const msg = active.messages.find(m => m.id === id);
    const existing = msg?.reactions?.find(r => r.emoji === emoji);
    const reactions = existing
      ? (existing.mine
          ? (msg?.reactions?.filter(r => r.emoji !== emoji) ?? [])
          : msg?.reactions?.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r) ?? [])
      : [...(msg?.reactions ?? []), { emoji, count: 1, mine: true }];
    updateMsg(id, { reactions });
  };

  const handleDelete = (id: number) => {
    setConvos(cs => cs.map(c => c.id === activeId
      ? { ...c, messages: c.messages.filter(m => m.id !== id) }
      : c
    ));
    toast.success("Message deleted");
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const msg: Message = {
      id: Date.now(), text: newMsg, sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent", replyTo: replyTo ?? undefined,
    };
    setConvos(cs => cs.map(c => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c));
    setNewMsg("");
    setReplyTo(null);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const replyMsg = replyTo ? active.messages.find(m => m.id === replyTo) : null;

  return (
    <div className="flex h-[calc(100vh-4.25rem)] overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Messages</h2>
            <button className="h-7 w-7 rounded-full bg-accent flex items-center justify-center hover:bg-accent/70 transition-colors">
              <Plus size={13} />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="pl-8 h-9 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-border/50 hover:bg-accent/40 transition-colors text-left ${activeId === c.id ? "bg-accent/60" : ""}`}
            >
              <div className="relative shrink-0">
                <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
                {c.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  {c.unread > 0 && (
                    <span className="ml-2 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center shrink-0">{c.unread}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.role}</p>
                <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={active.avatar} alt={active.name} className="h-9 w-9 rounded-full object-cover" />
              {active.online && <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border-2 border-background" />}
            </div>
            <div>
              <p className="text-sm font-medium">{active.name}</p>
              <p className="text-[10px] text-muted-foreground">{active.online ? "Online now" : "Last seen recently"} · {active.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {pinnedMessages.length > 0 && (
              <button
                onClick={() => setShowPinned(!showPinned)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] transition-colors ${showPinned ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                <Pin size={10} /> {pinnedMessages.length} pinned
              </button>
            )}
            <button className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Phone size={14} /></button>
            <button className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Video size={14} /></button>
            <button onClick={() => setShowInfo(!showInfo)} className={`h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors ${showInfo ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}><Info size={14} /></button>
          </div>
        </div>

        {/* Pinned messages panel */}
        <AnimatePresence>
          {showPinned && pinnedMessages.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="border-b border-border bg-primary/3 overflow-hidden shrink-0">
              <div className="px-5 py-3 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-primary font-medium flex items-center gap-1.5"><Pin size={10} /> Pinned Messages</p>
                {pinnedMessages.map(m => (
                  <div key={m.id} className="text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 truncate">
                    {m.text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {active.messages.map(msg => (
            <MessageBubble
              key={msg.id} msg={msg} allMessages={active.messages}
              onPin={handlePin} onStar={handleStar}
              onReply={id => setReplyTo(id)} onReact={handleReact} onDelete={handleDelete}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Reply preview */}
        <AnimatePresence>
          {replyMsg && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="px-5 py-2 border-t border-border bg-accent/30 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Reply size={12} className="text-primary" />
                  <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                    <span className="text-primary font-medium">Replying · </span>{replyMsg.text}
                  </p>
                </div>
                <button onClick={() => setReplyTo(null)}><X size={13} className="text-muted-foreground hover:text-foreground" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="px-5 py-3 border-t border-border bg-card/50 shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Write a message…"
                className="pr-24 rounded-full text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Smile size={15} /></button>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Paperclip size={15} /></button>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><ImageIcon size={15} /></button>
              </div>
            </div>
            <Button onClick={sendMessage} size="sm" className="rounded-full h-9 w-9 p-0 shrink-0" disabled={!newMsg.trim()}>
              <Send size={14} />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Press Enter to send · Hover any message for actions</p>
        </div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            className="shrink-0 border-l border-border overflow-hidden"
          >
            <div className="w-60 p-5 space-y-5">
              <div className="text-center">
                <img src={active.avatar} alt={active.name} className="h-14 w-14 rounded-full object-cover mx-auto mb-3" />
                <p className="text-sm font-medium">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.role}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Quick Actions</p>
                {[
                  { icon: Pin, label: `${pinnedMessages.length} pinned messages` },
                  { icon: Star, label: `${active.messages.filter(m => m.starred).length} starred` },
                  { icon: FileText, label: "View shared files" },
                  { icon: Sparkles, label: "AI summary" },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground py-2 transition-colors">
                    <Icon size={13} className="text-primary" /> {label}
                  </button>
                ))}
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                <p className="text-[10px] font-medium text-primary mb-1 flex items-center gap-1"><Sparkles size={10} /> AI Assistant</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Generate a response, summarise this thread, or draft a contract — all from here.</p>
                <Button size="sm" className="w-full mt-2 text-xs rounded-full" onClick={() => toast.success("AI summary coming soon!")}>Summarise thread</Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;
