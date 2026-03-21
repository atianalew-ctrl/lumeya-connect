import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

// Nav link keys — labels resolved from translations at render time
const BRAND_LINK_KEYS = [
  { to: "/for-brands", key: "nav_for_brands" as const },
  { to: "/make-ads", key: "nav_make_ads" as const },
  { to: "/matchmaker", key: "nav_matchmaker" as const },
  { to: "/brief", key: "nav_brief" as const },
  { to: "/brand-os", key: "nav_brand_os" as const },
  { to: "/pricing", key: "nav_pricing" as const },
];

const CREATOR_LINK_KEYS = [
  { to: "/creators", key: "nav_browse_creators" as const },
  { to: "/feed", key: "nav_feed" as const },
  { to: "/opportunities", key: "nav_opportunities" as const },
  { to: "/community", key: "nav_community" as const },
];

const MORE_LINK_KEYS = [
  { to: "/activate", key: "nav_content_activation" as const },
  { to: "/analytics", key: "nav_analytics" as const },
  { to: "/contract", key: "nav_contracts" as const },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const isActive = (to: string) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-[4.25rem] items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Lumeya" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-[1.1rem] tracking-tight">Lumeya</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* For Brands dropdown */}
          <div className="relative" onMouseEnter={() => setBrandsOpen(true)} onMouseLeave={() => setBrandsOpen(false)}>
            <button className={`flex items-center gap-1 px-3 py-2 text-[12px] rounded-lg transition-colors ${BRAND_LINK_KEYS.some(l => isActive(l.to)) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {t("nav_for_brands")} <ChevronDown size={11} className={`transition-transform ${brandsOpen ? "rotate-180" : ""}`} />
            </button>
            {brandsOpen && (
              <div className="absolute top-full left-0 pt-1 w-52">
                <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1">
                  {BRAND_LINK_KEYS.map(({ to, key }) => (
                    <Link key={to} to={to} className={`block px-4 py-2.5 text-xs transition-colors ${isActive(to) ? "text-foreground bg-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                      {t(key)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Creator links */}
          {CREATOR_LINK_KEYS.map(({ to, key }) => (
            <Link key={to} to={to} className={`px-3 py-2 text-[12px] rounded-lg transition-colors whitespace-nowrap ${isActive(to) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {t(key)}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className={`flex items-center gap-1 px-3 py-2 text-[12px] rounded-lg transition-colors ${MORE_LINK_KEYS.some(l => isActive(l.to)) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {t("nav_more")} <ChevronDown size={11} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 pt-1 w-44">
                <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1">
                  {MORE_LINK_KEYS.map(({ to, key }) => (
                    <Link key={to} to={to} className={`block px-4 py-2.5 text-xs transition-colors ${isActive(to) ? "text-foreground bg-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                      {t(key)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Notification bell */}
          <Link to="/notifications" className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border border-background" />
          </Link>

          {/* Black pill */}
          <Link to="/black" className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-1.5 text-[11px] font-medium tracking-widest uppercase hover:bg-foreground/90 transition-colors">
            <span className="w-1 h-1 rounded-full bg-background/50" />
            {t("nav_black")}
          </Link>

          {/* Join Waitlist pill */}
          <Link
            to="/waitlist"
            className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors whitespace-nowrap"
          >
            Join Waitlist
          </Link>

          {user ? (
            <>
              <span className="text-xs text-muted-foreground capitalize">{role}</span>
              <Button variant="ghost" size="sm" className="text-[12px] rounded-full px-4 gap-1.5" onClick={handleSignOut}>
                <LogOut size={12} /> {t("nav_sign_out")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-[12px] rounded-full px-4" asChild>
                <Link to="/creator-signup">{t("nav_join_creator")}</Link>
              </Button>
              <Button size="sm" className="text-[12px] rounded-full px-5" asChild>
                <Link to="/for-brands">{t("nav_for_brands_btn")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1 ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background/98 backdrop-blur px-4 pb-6 md:hidden">
          <div className="py-3 space-y-0.5">
            <div className="flex items-center justify-between px-3 pt-2 pb-1">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{t("nav_for_brands")}</p>
              <LanguageSwitcher />
            </div>
            {BRAND_LINK_KEYS.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive(l.to) ? "text-foreground font-medium bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                {t(l.key)}
              </Link>
            ))}
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground px-3 pt-4 pb-1">Creators</p>
            {CREATOR_LINK_KEYS.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive(l.to) ? "text-foreground font-medium bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                {t(l.key)}
              </Link>
            ))}
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground px-3 pt-4 pb-1">{t("nav_more")}</p>
            {MORE_LINK_KEYS.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive(l.to) ? "text-foreground font-medium bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                {t(l.key)}
              </Link>
            ))}
            <Link to="/black" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-lg bg-foreground text-background mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-background/50" /> Lumeya Black
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/waitlist" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center px-3 py-2.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
              Join Waitlist
            </Link>
            {user ? (
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5" onClick={handleSignOut}>
                <LogOut size={13} /> {t("nav_sign_out")}
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link to="/creator-signup" onClick={() => setMobileOpen(false)}>{t("nav_join_creator")}</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/for-brands" onClick={() => setMobileOpen(false)}>{t("nav_for_brands_btn")} →</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
