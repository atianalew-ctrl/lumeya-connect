import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

const CreatorSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, role: "creator" } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email.");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <Link to="/welcome" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Lumeya" className="h-6 w-6 rounded-full object-cover" />
          <span className="font-display text-base">Lumeya</span>
        </div>
        <div className="w-5" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Headline */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-semibold leading-tight mb-2">
              {isLogin ? "Welcome back." : "Join Lumeya."}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Log in to your creator account."
                : "Create your free creator profile and start earning."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full name</Label>
                <Input
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="rounded-xl h-12 bg-accent/50 border-border/50 focus:border-primary/40"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-12 bg-accent/50 border-border/50 focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl h-12 bg-accent/50 border-border/50 focus:border-primary/40 pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full text-sm font-medium mt-2">
              {loading ? "Please wait…" : isLogin ? "Log In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle login/signup */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

          {/* Brand CTA */}
          <div className="mt-8 rounded-2xl border border-border bg-accent/30 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Are you a brand?</p>
            <Link to="/brand-login" className="text-sm font-medium text-primary hover:underline">
              Post campaigns & hire creators →
            </Link>
          </div>

          {!isLogin && (
            <p className="text-center text-[10px] text-muted-foreground/40 mt-6 leading-relaxed">
              By signing up you agree to our Terms of Service and Privacy Policy.
              <br />Lumeya is by application only — our team reviews every creator profile.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreatorSignup;
