import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

const categories = ["UGC", "Photography", "Videography", "Social Media", "Design", "Writing"];

const PostOpportunity = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-display">Opportunity Posted</h1>
          <p className="mt-3 text-muted-foreground">Your opportunity is now live. Creators will be able to discover and apply for it.</p>
          <Button className="mt-8" onClick={() => setSubmitted(false)}>Post Another</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">For Brands</p>
        <h1 className="mt-2 text-4xl font-display">Post an Opportunity</h1>
        <p className="mt-2 text-sm text-muted-foreground">Describe your project and find the perfect creator to collaborate with.</p>

        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-semibold">Basic Details</h2>
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs">Opportunity title</Label>
              <Input id="title" required placeholder="e.g. UGC Creator for Skincare Brand" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs">Brand name</Label>
              <Input id="brand" required placeholder="Your brand or company name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-semibold">Project Details</h2>
            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-xs">Short description</Label>
              <Textarea id="desc" required rows={3} placeholder="Brief overview visible in search results" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="overview" className="text-xs">Full project overview</Label>
              <Textarea id="overview" required rows={5} placeholder="Detailed description of the project, goals, and expectations" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deliverables" className="text-xs">Deliverables (one per line)</Label>
              <Textarea id="deliverables" required rows={4} placeholder={"5 short-form videos\nVertical format for TikTok\nRaw footage included"} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-semibold">Budget & Timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budget" className="text-xs">Budget range</Label>
                <Input id="budget" required placeholder="e.g. $500–$1,000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs">Deadline</Label>
                <Input id="deadline" required placeholder="e.g. Mar 15, 2026" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input id="location" placeholder="Remote, or specify a city" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timeline" className="text-xs">Timeline details</Label>
              <Textarea id="timeline" rows={3} placeholder="Key milestones and due dates" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" size="lg">Publish Opportunity</Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default PostOpportunity;
