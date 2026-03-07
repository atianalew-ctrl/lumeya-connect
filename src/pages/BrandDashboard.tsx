import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, MessageSquare, ExternalLink, Briefcase, Clock } from "lucide-react";
import { PaymentStatusBadge } from "@/components/campaign/PaymentStatusBadge";
import { opportunities } from "@/lib/data";
import {
  getApplicationsByOpportunity,
  updateApplicationStatus,
  getCampaigns,
  type Application,
} from "@/lib/campaign-store";

const BrandDashboard = () => {
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const activeCampaigns = getCampaigns();

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container max-w-5xl">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl">Brand Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage applications and campaigns for your opportunities.
          </p>
        </div>

        {/* Active Campaigns */}
        {activeCampaigns.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Briefcase size={18} className="text-primary" />
              Active Campaigns
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {activeCampaigns.map((c) => (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.id}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.creatorAvatar} />
                      <AvatarFallback>{c.creatorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {c.opportunityTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        with {c.creatorName}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant={c.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {c.status === "completed" ? "Completed" : "Active"}
                    </Badge>
                    <PaymentStatusBadge status={c.payment.status} />
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {c.deadline}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Applications by Opportunity */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Applications</h2>
          <div className="space-y-8">
            {opportunities.slice(0, 4).map((opp) => {
              const apps = getApplicationsByOpportunity(opp.id);
              return (
                <div key={opp.id} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                      <h3 className="font-semibold">{opp.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        by {opp.brand} · {opp.budget}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {apps.length} application{apps.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {apps.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No applications yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {apps.map((app, i) => (
                        <ApplicationCard key={app.id} app={app} index={i} onAction={rerender} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

function ApplicationCard({
  app,
  index,
  onAction,
}: {
  app: Application;
  index: number;
  onAction: () => void;
}) {
  const handleAction = (status: "accepted" | "declined") => {
    updateApplicationStatus(app.id, status);
    onAction();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex gap-3">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={app.creatorAvatar} />
          <AvatarFallback>{app.creatorName[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{app.creatorName}</p>
          <p className="text-xs text-muted-foreground">{app.creatorRole}</p>
          <a
            href={app.portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Portfolio <ExternalLink size={10} />
          </a>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{app.message}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {app.status === "pending" ? (
          <>
            <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleAction("declined")}>
              <XCircle size={13} className="mr-1" /> Decline
            </Button>
            <Button size="sm" className="text-xs h-8" onClick={() => handleAction("accepted")}>
              <CheckCircle size={13} className="mr-1" /> Accept
            </Button>
          </>
        ) : (
          <Badge variant={app.status === "accepted" ? "default" : "secondary"} className="text-xs capitalize">
            {app.status}
          </Badge>
        )}
        <Button size="sm" variant="ghost" className="text-xs h-8" asChild>
          <Link to="/messages">
            <MessageSquare size={13} />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export default BrandDashboard;
