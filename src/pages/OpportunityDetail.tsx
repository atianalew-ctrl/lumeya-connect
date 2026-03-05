import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, DollarSign, Clock, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { opportunities } from "@/lib/data";
import { useState } from "react";
import ApplyModal from "@/components/ApplyModal";

const OpportunityDetail = () => {
  const { id } = useParams();
  const opp = opportunities.find((o) => o.id === Number(id));
  const [applyOpen, setApplyOpen] = useState(false);

  if (!opp) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Opportunity not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/opportunities">Back to Opportunities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Back to Opportunities
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-xs text-muted-foreground">by {opp.brand}</p>
            <h1 className="mt-2 text-3xl font-display">{opp.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-sm font-medium"><DollarSign size={14} className="text-primary" />{opp.budget}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock size={13} />{opp.deadline}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={13} />{opp.location}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {opp.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] text-accent-foreground">{tag}</span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg font-display">Project Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{opp.overview}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg font-display">Deliverables Required</h2>
            <ul className="mt-3 space-y-2">
              {opp.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg font-display">Timeline</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{opp.timeline}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:max-w-xs space-y-4">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-lg font-semibold">{opp.budget}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="text-sm font-medium">{opp.deadline}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{opp.location}</p>
            </div>
            <Button className="w-full" onClick={() => setApplyOpen(true)}>Apply for Opportunity</Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/messages"><MessageCircle size={14} className="mr-2" />Message Brand</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} opportunity={opp} />
    </div>
  );
};

export default OpportunityDetail;
