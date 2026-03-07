import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  getCampaign,
  addChatMessage,
  addSubmission,
  reviewSubmission,
  fundCampaign,
  type ContentSubmission,
} from "@/lib/campaign-store";
import { PaymentCard } from "@/components/campaign/PaymentCard";
import { PaymentStatusBadge } from "@/components/campaign/PaymentStatusBadge";
import {
  Send,
  Upload,
  CheckCircle,
  RotateCcw,
  Clock,
  FileVideo,
  ArrowLeft,
  PartyPopper,
} from "lucide-react";

const CampaignWorkspace = () => {
  const { id } = useParams<{ id: string }>();
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const [chatInput, setChatInput] = useState("");
  const [submitCaption, setSubmitCaption] = useState("");
  const [submitFile, setSubmitFile] = useState("");
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});

  const campaign = getCampaign(id || "");

  if (!campaign) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-display">Campaign not found</h2>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    addChatMessage(id!, { sender: "brand", senderName: campaign.brand, text: chatInput });
    setChatInput("");
    rerender();
  };

  const handleSubmitContent = () => {
    if (!submitFile.trim()) return;
    addSubmission(id!, { fileName: submitFile || "video-draft.mp4", caption: submitCaption });
    setSubmitFile("");
    setSubmitCaption("");
    rerender();
  };

  const handleReview = (subId: string, action: "approved" | "revision") => {
    reviewSubmission(id!, subId, action, reviewComment[subId]);
    setReviewComment((prev) => ({ ...prev, [subId]: "" }));
    rerender();
  };

  const handleFundCampaign = () => {
    fundCampaign(id!);
    rerender();
  };

  // Re-fetch after mutations
  const freshCampaign = getCampaign(id!)!;

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl">
        {/* Back link */}
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Completed banner */}
        {freshCampaign.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <PartyPopper className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg">Project completed successfully!</h3>
              <p className="text-sm text-muted-foreground">All content has been approved. Great collaboration!</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl">{freshCampaign.opportunityTitle}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Avatar className="h-7 w-7">
                <AvatarImage src={freshCampaign.creatorAvatar} />
                <AvatarFallback>{freshCampaign.creatorName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {freshCampaign.brand} × {freshCampaign.creatorName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={freshCampaign.status === "completed" ? "default" : "secondary"} className="text-xs capitalize">
              {freshCampaign.status}
            </Badge>
            <PaymentStatusBadge status={freshCampaign.payment.status} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} /> {freshCampaign.deadline}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: deliverables + submissions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deliverables */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold mb-4">Deliverables</h2>
              <ul className="space-y-2">
                {freshCampaign.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="mt-0.5 shrink-0 text-primary" />
                    {d}
                  </li>
                ))}
              </ul>
            </section>

            {/* Content Submission */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold mb-4">Submit Content</h2>
              <div className="space-y-3">
                <Input
                  placeholder="File name (e.g. skincare-video-v1.mp4)"
                  value={submitFile}
                  onChange={(e) => setSubmitFile(e.target.value)}
                />
                <Textarea
                  placeholder="Add a caption or notes for this submission..."
                  rows={2}
                  value={submitCaption}
                  onChange={(e) => setSubmitCaption(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload size={13} className="mr-1" /> Upload content
                  </Button>
                  <Button size="sm" className="text-xs" onClick={handleSubmitContent} disabled={!submitFile.trim()}>
                    Submit for review
                  </Button>
                </div>
              </div>
            </section>

            {/* Submissions list + Brand Review */}
            {freshCampaign.submissions.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold mb-4">Submissions</h2>
                <div className="space-y-4">
                  {freshCampaign.submissions.map((sub) => (
                    <SubmissionCard
                      key={sub.id}
                      sub={sub}
                      comment={reviewComment[sub.id] || ""}
                      onCommentChange={(val) => setReviewComment((prev) => ({ ...prev, [sub.id]: val }))}
                      onReview={(action) => handleReview(sub.id, action)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column: Chat */}
          <div className="lg:col-span-1">
            <section className="rounded-xl border border-border bg-card p-5 sticky top-20">
              <h2 className="text-base font-semibold mb-4">Chat</h2>
              <div className="flex flex-col h-80">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                  {freshCampaign.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "brand" ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-muted-foreground mb-0.5">{msg.senderName}</span>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
                          msg.sender === "brand"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    className="text-sm h-9"
                  />
                  <Button size="sm" className="h-9 px-3" onClick={handleSendChat} disabled={!chatInput.trim()}>
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

function SubmissionCard({
  sub,
  comment,
  onCommentChange,
  onReview,
}: {
  sub: ContentSubmission;
  comment: string;
  onCommentChange: (val: string) => void;
  onReview: (action: "approved" | "revision") => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "secondary",
    approved: "default",
    revision: "destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-muted/20 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileVideo size={16} className="text-primary" />
          <div>
            <p className="text-sm font-medium">{sub.fileName}</p>
            {sub.caption && <p className="text-xs text-muted-foreground mt-0.5">{sub.caption}</p>}
          </div>
        </div>
        <Badge variant={statusColors[sub.status] as any} className="text-xs capitalize">
          {sub.status === "revision" ? "Revision requested" : sub.status}
        </Badge>
      </div>

      {sub.comment && (
        <p className="mt-2 text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
          {sub.comment}
        </p>
      )}

      {sub.status === "pending" && (
        <div className="mt-3 space-y-2">
          <Input
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="text-xs h-8"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => onReview("revision")}
            >
              <RotateCcw size={11} className="mr-1" /> Request revision
            </Button>
            <Button size="sm" className="text-xs h-7" onClick={() => onReview("approved")}>
              <CheckCircle size={11} className="mr-1" /> Approve
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CampaignWorkspace;
