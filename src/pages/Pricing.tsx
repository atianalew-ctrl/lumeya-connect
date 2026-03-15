import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 49, annual: 39 },
    desc: "Perfect for brands just getting started with creator marketing.",
    highlight: false,
    cta: "Get Started",
    features: [
      "Up to 3 active campaigns",
      "Access to 50+ vetted creators",
      "AI Brief Generator",
      "Basic analytics",
      "Email support",
      "1 team seat",
    ],
    missing: ["Brand OS dashboard", "AI Content Activation", "Contract signing", "Priority matching"],
  },
  {
    name: "Growth",
    price: { monthly: 149, annual: 119 },
    desc: "For brands scaling their creator program and content output.",
    highlight: true,
    badge: "Most Popular",
    cta: "Start Free Trial",
    features: [
      "Unlimited campaigns",
      "Full creator marketplace",
      "AI Matchmaker",
      "AI Brief Generator",
      "Brand OS dashboard",
      "AI Content Activation",
      "Contract signing",
      "Advanced analytics",
      "Priority creator matching",
      "3 team seats",
      "Chat support",
    ],
    missing: [],
  },
  {
    name: "Black",
    price: { monthly: 399, annual: 319 },
    desc: "Exclusive access. Elite creators. Dedicated support.",
    highlight: false,
    badge: "✦ Exclusive",
    cta: "Apply for Black",
    ctaTo: "/black",
    features: [
      "Everything in Growth",
      "Hand-picked elite creators",
      "Dedicated account manager",
      "Custom contract templates",
      "White-glove onboarding",
      "Shopify revenue tracking",
      "API access",
      "Unlimited team seats",
      "Travel campaign access",
      "Quarterly strategy call",
    ],
    missing: [],
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">Simple Pricing</p>
            <h1 className="text-5xl md:text-6xl font-display font-normal leading-tight mb-6">
              Invest in content<br />
              <em className="text-primary/70">that actually converts.</em>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
              No hidden fees. No contracts. Cancel anytime. Start with a 14-day free trial on any plan.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${!annual ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all flex items-center gap-1.5 ${annual ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Annual
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${annual ? "bg-emerald-500 text-white" : "bg-emerald-500/20 text-emerald-600"}`}>
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/5"
                    : plan.name === "Black"
                    ? "border-foreground/20 bg-foreground text-background"
                    : "border-border bg-card"
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-medium tracking-wider ${
                    plan.highlight ? "bg-primary text-white" : "bg-background text-foreground border border-border"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <p className={`text-[10px] tracking-[0.3em] uppercase mb-2 ${plan.name === "Black" ? "text-background/50" : "text-muted-foreground"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-light">
                    €{annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className={`text-xs mb-1.5 ${plan.name === "Black" ? "text-background/50" : "text-muted-foreground"}`}>/mo</span>
                </div>
                {annual && (
                  <p className="text-[10px] text-emerald-500 mb-3">
                    Save €{(plan.price.monthly - plan.price.annual) * 12}/year
                  </p>
                )}
                <p className={`text-xs leading-relaxed mb-8 ${plan.name === "Black" ? "text-background/60" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>

                <Button
                  className={`w-full rounded-full mb-8 ${
                    plan.highlight
                      ? ""
                      : plan.name === "Black"
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "variant-outline"
                  }`}
                  variant={plan.highlight ? "default" : plan.name === "Black" ? "default" : "outline"}
                  asChild
                >
                  <Link to={plan.ctaTo || "/brand-login"}>
                    {plan.cta} <ArrowRight size={13} className="ml-1.5" />
                  </Link>
                </Button>

                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-xs">
                      <Check size={12} className={`mt-0.5 shrink-0 ${plan.name === "Black" ? "text-background/70" : "text-emerald-500"}`} />
                      <span className={plan.name === "Black" ? "text-background/80" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-24">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-display text-center mb-12">Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Can I cancel anytime?", a: "Yes — no contracts, no lock-in. Cancel from your settings in one click. You keep access until the end of your billing period." },
              { q: "How does the free trial work?", a: "14 days full access on any plan, no credit card required. At the end of the trial you choose to continue or stop." },
              { q: "What counts as a campaign?", a: "A campaign is any brief you post to find creators. Starter plan includes 3 active at once. Growth and Black are unlimited." },
              { q: "How do I pay creators?", a: "Payments to creators are processed separately through the platform. Lumeya takes 5% of each transaction. Creators get paid within 48 hours of content approval." },
              { q: "What is Lumeya Black?", a: "By invitation only — or apply via the Black page. It's our most exclusive tier with hand-picked elite creators, a dedicated account manager, and full white-glove service." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-6">
                <p className="text-sm font-medium mb-2">{q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-foreground text-background py-24 text-center">
        <div className="container max-w-xl">
          <Zap size={24} className="mx-auto text-background/30 mb-6" />
          <h2 className="text-4xl font-display mb-4">Start today. Free.</h2>
          <p className="text-sm text-background/50 mb-8">14-day trial. No card needed. Your first campaign live in under 10 minutes.</p>
          <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-10" asChild>
            <Link to="/brand-login">Get Started Free <ArrowRight size={14} className="ml-1.5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
