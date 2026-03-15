import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

// Decorative pill shapes — like the Influee background
const BgPills = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { top: "8%", left: "-8%", rotate: "-20deg", w: 180, h: 80 },
      { top: "6%", right: "2%", rotate: "30deg", w: 140, h: 60 },
      { top: "28%", right: "-6%", rotate: "-10deg", w: 160, h: 70 },
      { top: "42%", left: "-4%", rotate: "15deg", w: 130, h: 55 },
      { top: "60%", right: "8%", rotate: "40deg", w: 120, h: 50 },
      { top: "72%", left: "10%", rotate: "-30deg", w: 150, h: 65 },
      { top: "82%", right: "-5%", rotate: "10deg", w: 170, h: 72 },
      { top: "18%", left: "20%", rotate: "55deg", w: 100, h: 44 },
      { top: "50%", left: "30%", rotate: "-45deg", w: 90, h: 40 },
    ].map((s, i) => (
      <div
        key={i}
        className="absolute rounded-full border border-foreground/5"
        style={{
          top: s.top,
          left: (s as any).left,
          right: (s as any).right,
          width: s.w,
          height: s.h,
          transform: `rotate(${s.rotate})`,
          background: "transparent",
        }}
      />
    ))}
  </div>
);

const Welcome = () => (
  <div className="min-h-screen flex flex-col relative bg-background overflow-hidden">
    <BgPills />

    {/* Logo centered top */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex justify-center pt-16 pb-8 relative z-10"
    >
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="Lumeya" className="h-9 w-9 rounded-full object-cover" />
        <span className="font-display text-2xl tracking-tight">Lumeya</span>
      </div>
    </motion.div>

    {/* Spacer */}
    <div className="flex-1" />

    {/* Main headline */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="px-8 pb-10 relative z-10"
    >
      <h1 className="text-[2.8rem] leading-[1.05] font-display font-semibold tracking-tight mb-4">
        Work with creators
        <br />
        <em className="font-normal text-muted-foreground">who convert.</em>
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        Lumeya connects premium brands with vetted UGC creators — from brief to content in 48 hours.
      </p>
    </motion.div>

    {/* Bottom CTA buttons */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-6 pb-12 space-y-3 relative z-10"
    >
      {/* Sign Up — filled */}
      <Link
        to="/creator-signup"
        className="flex items-center justify-center w-full rounded-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
      >
        Sign Up Free
      </Link>

      {/* Login — outline */}
      <Link
        to="/brand-login"
        className="flex items-center justify-center w-full rounded-full border border-border bg-transparent text-foreground/70 py-4 text-sm font-medium tracking-wide hover:border-foreground/30 hover:text-foreground transition-colors"
      >
        Log In
      </Link>

      {/* Brand CTA */}
      <p className="text-center text-xs text-muted-foreground/50 pt-2">
        Are you a brand?{" "}
        <Link to="/brand-login" className="text-primary hover:underline">
          Start hiring creators →
        </Link>
      </p>

      <p className="text-center text-[10px] text-muted-foreground/30 pt-1">
        Free 14-day trial · No credit card needed
      </p>
    </motion.div>
  </div>
);

export default Welcome;
