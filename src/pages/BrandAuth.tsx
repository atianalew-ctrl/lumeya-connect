import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check } from "lucide-react";

export default function BrandAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    brand_name: "",
    website: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) { setError(error.message); setLoading(false); return; }
    navigate("/brand-dashboard");
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        role: "brand",
        full_name: form.brand_name,
        website: form.website,
      });
    }
    setDone(true);
    setLoading(false);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl mb-3">Check your email</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your brand account.
        </p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">For Brands</p>
            <h1 className="font-display text-4xl font-normal">
              {mode === "login" ? "Welcome back." : "Start hiring creators."}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login" ? "Sign in to your brand account." : "Free to join. Access 2,400+ vetted creators."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden mb-7">
            <button onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mode === "login" ? "bg-foreground text-background" : "text-muted-foreground"}`}>
              Sign in
            </button>
            <button onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mode === "signup" ? "bg-foreground text-background" : "text-muted-foreground"}`}>
              Create account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-3">

              {mode === "signup" && (
                <>
                  <Input placeholder="Brand name *" value={form.brand_name} onChange={e => set("brand_name", e.target.value)} />
                  <Input placeholder="Website (optional)" value={form.website} onChange={e => set("website", e.target.value)} />
                </>
              )}

              <Input type="email" placeholder="Work email *" value={form.email} onChange={e => set("email", e.target.value)} />

              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="Password *" value={form.password} onChange={e => set("password", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <Button className="w-full rounded-full mt-2" onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading || !form.email || !form.password}>
                {loading ? "..." : mode === "login" ? "Sign in →" : "Create brand account →"}
              </Button>

              {mode === "signup" && (
                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  By signing up you agree to our terms. Free forever on the Starter plan.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right — value prop */}
      <div className="hidden md:flex flex-1 bg-foreground text-background flex-col justify-center p-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-background/40 mb-8">Why brands love Lumeya</p>
        {[
          { n: "2,400+", label: "Vetted creators across 40+ countries" },
          { n: "48h", label: "Average time from brief to first content" },
          { n: "94%", label: "Brand satisfaction rate" },
          { n: "€0", label: "To get started — pay only when you hire" },
        ].map(({ n, label }) => (
          <div key={n} className="mb-8">
            <p className="font-display text-5xl font-light mb-1">{n}</p>
            <p className="text-sm text-background/50">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
