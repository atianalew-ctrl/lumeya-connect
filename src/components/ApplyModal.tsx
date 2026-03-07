import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import { addApplication } from "@/lib/campaign-store";

interface ApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: {
    title: string;
    brand: string;
    budget: string;
    deadline: string;
  } | null;
}

const ApplyModal = ({ open, onOpenChange, opportunity }: ApplyModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", portfolio: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (opportunity) {
      addApplication({
        opportunityId: 0,
        opportunityTitle: opportunity.title,
        brand: opportunity.brand,
        creatorId: 0,
        creatorName: form.name,
        creatorRole: "Creator",
        creatorAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${form.name}`,
        portfolioLink: form.portfolio,
        message: form.message,
      });
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", portfolio: "", message: "" });
    }, 200);
  };

  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-5 text-lg font-display">Application sent successfully</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              The brand will review your application and contact you if interested.
            </p>
            <Button className="mt-6" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Apply for this opportunity</DialogTitle>
            </DialogHeader>

            <div className="rounded-lg border border-border bg-muted/30 p-4 mt-2">
              <p className="font-body text-sm font-semibold">{opportunity.title}</p>
              <p className="text-xs text-muted-foreground mt-1">by {opportunity.brand}</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs font-medium">
                  <DollarSign size={11} className="text-primary" />{opportunity.budget}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={11} />{opportunity.deadline}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolio" className="text-xs">Portfolio link</Label>
                <Input id="portfolio" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} placeholder="https://your-portfolio.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs">Message to brand</Label>
                <Textarea id="message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell the brand why you're a great fit for this project." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="upload" className="text-xs">Upload portfolio or example videos (optional)</Label>
                <Input id="upload" type="file" multiple accept="video/*,image/*,.pdf" className="text-xs" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
