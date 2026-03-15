import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Heart, MessageSquare, FileText, Zap, Star, Users, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type NotifType = "application" | "message" | "contract" | "payment" | "review" | "match" | "system";

interface Notif {
  id: number; type: NotifType; title: string; body: string;
  time: string; read: boolean; avatar?: string; action?: string;
}

const ICON_MAP: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  application: { icon: Users, color: "text-primary", bg: "bg-primary/10" },
  message: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
  contract: { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
  payment: { icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  review: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  match: { icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  system: { icon: Bell, color: "text-muted-foreground", bg: "bg-accent" },
};

const INITIAL: Notif[] = [
  { id: 1, type: "application", title: "New creator application", body: "Ronja Aaslund applied to your Summer Serum campaign", time: "2 min ago", read: false, avatar: "/lovable-uploads/488193ca-12b4-40ef-905e-1c618634eef9.jpg", action: "Review application" },
  { id: 2, type: "message", title: "New message from NA-KD", body: "Can you send your media kit? We'd love to move forward.", time: "12 min ago", read: false, avatar: "https://ui-avatars.com/api/?name=NAKD&background=e8e0f5&color=6a4a8a&bold=true", action: "Reply" },
  { id: 3, type: "contract", title: "Contract signed ✦", body: "GlowCo has signed the collaboration agreement. Payment is now in escrow.", time: "1 hour ago", read: false, action: "View contract" },
  { id: 4, type: "payment", title: "Payment released 🎉", body: "€350 has been transferred to your account for the Wanderlust campaign.", time: "3 hours ago", read: true },
  { id: 5, type: "match", title: "New creator match", body: "We found 3 creators that are a perfect match for your brief — 95%+ compatibility score.", time: "5 hours ago", read: true, action: "See matches" },
  { id: 6, type: "review", title: "New review received", body: "Sussie Agger left you a 5-star review: 'Incredible to work with, very clear brief.'", time: "Yesterday", read: true, avatar: "/lovable-uploads/ff812edb-72d9-419a-809e-81d311763fdb.jpg" },
  { id: 7, type: "application", title: "2 new applications", body: "Nella Ryglova and Amalie Asheim applied to your TikTok campaign.", time: "Yesterday", read: true, action: "Review" },
  { id: 8, type: "system", title: "Welcome to Lumeya ✦", body: "Your brand profile is live. Start posting an opportunity or browse creators to get started.", time: "2 days ago", read: true },
];

const FILTERS = ["All", "Unread", "Applications", "Messages", "Payments", "Contracts"];

const Notifications = () => {
  const [notifs, setNotifs] = useState(INITIAL);
  const [filter, setFilter] = useState("All");

  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifs(ns => ns.map(n => ({ ...n, read: true }))); toast.success("All marked as read"); };
  const dismiss = (id: number) => setNotifs(ns => ns.filter(n => n.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Applications") return n.type === "application";
    if (filter === "Messages") return n.type === "message";
    if (filter === "Payments") return n.type === "payment";
    if (filter === "Contracts") return n.type === "contract";
    return true;
  });

  return (
    <div className="container py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Activity</p>
            <h1 className="text-4xl font-display font-normal flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="text-lg bg-primary text-primary-foreground rounded-full px-3 py-0.5 font-normal text-sm">{unreadCount}</span>
              )}
            </h1>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5" onClick={markAllRead}>
                <CheckCheck size={12} /> Mark all read
              </Button>
            )}
            <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
              <Settings size={15} />
            </Button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                filter === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <Bell size={28} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No notifications here</p>
              </motion.div>
            )}
            {filtered.map((n, i) => {
              const { icon: Icon, color, bg } = ICON_MAP[n.type];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(n.id)}
                  className={`group relative flex items-start gap-4 rounded-xl p-4 border cursor-pointer transition-all ${
                    !n.read ? "border-primary/20 bg-primary/[0.03]" : "border-border bg-card hover:bg-accent/30"
                  }`}
                >
                  {/* Unread dot */}
                  {!n.read && <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />}

                  {/* Icon or avatar */}
                  <div className="shrink-0">
                    {n.avatar ? (
                      <div className="relative">
                        <img src={n.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${bg} flex items-center justify-center border-2 border-background`}>
                          <Icon size={9} className={color} />
                        </div>
                      </div>
                    ) : (
                      <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center`}>
                        <Icon size={16} className={color} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-medium" : ""}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      {n.action && (
                        <button className="text-[10px] text-primary hover:underline font-medium">{n.action} →</button>
                      )}
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
