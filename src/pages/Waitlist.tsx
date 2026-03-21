import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Sparkles } from "lucide-react";

const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2R5bmx1dG1vc3VwZnFhZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDkzODQsImV4cCI6MjA4OTA4NTM4NH0.TFModn0Tm_eZDR9NpDTzxn7Yq1aAiNCc-qSAnMtADys";

const INTEREST_OPTIONS = [
  { value: "", label: "What brings you here?" },
  { value: "Looking for creators", label: "Looking for creators" },
  { value: "I'm a creator", label: "I'm a creator" },
  { value: "Both", label: "Both" },
];

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return;
    setLoading(true);

    try {
      const body: Record<string, string> = { email };
      if (companyName) body.company_name = companyName;
      if (interest) body.interest = interest;

      const res = await fetch(
        "https://xbgdynlutmosupfqafap.supabase.co/rest/v1/brand_waitlist",
        {
          method: "POST",
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
      } else if (res.status === 409 || res.status === 23505) {
        setError("This email is already registered.");
      } else {
        const text = await res.text();
        // Supabase returns 409 conflict via body when unique constraint hits
        if (text.includes("23505") || text.includes("duplicate")) {
          setError("This email is already registered.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6">
            <Sparkles size={11} />
            Early Access
          </div>
          <h1 className="text-4xl font-display font-normal tracking-tight mb-3">
            Join the Waitlist
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Be the first to access Lumeya Connect.
            <br />
            The creator marketplace built for Nordic brands.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-8">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <h2 className="text-xl font-display tracking-tight mb-2">
                  You're on the list ✓
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We'll reach out when your access is ready.
                  <br />
                  Something beautiful is coming.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email <span className="text-primary">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="you@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {/* Company name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company Name <span className="text-muted-foreground/50 text-[10px] normal-case font-normal">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Your brand or company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Interest */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    I'm interested in
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                  >
                    {INTEREST_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 rounded-lg bg-red-50 px-3 py-2 border border-red-100">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-11 rounded-full text-sm"
                  disabled={loading || !email}
                >
                  {loading ? "Joining…" : "Request Early Access →"}
                </Button>

                <p className="text-[10px] text-muted-foreground text-center pt-1">
                  No spam. We'll only contact you when you're approved.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {[["2,400+", "Creators"], ["40+", "Countries"], ["Nordic-first", "Platform"]].map(
            ([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-sm font-medium">{v}</p>
                <p className="text-[10px] text-muted-foreground">{l}</p>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Waitlist;
