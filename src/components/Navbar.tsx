import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/creators", label: "Creators" },
  { to: "/matchmaker", label: "✨ Matchmaker" },
  { to: "/activate", label: "⚡ Activate" },
  { to: "/brief", label: "📋 Brief" },
  { to: "/brand-os", label: "🚀 Brand OS" },
  { to: "/black", label: "🖤 Black" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/community", label: "Community" },
];

const authNavLinks = [
  { to: "/dashboard", label: "Dashboard", roles: ["brand"] },
  { to: "/messages", label: "Messages", roles: ["creator", "brand"] },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const visibleLinks = [
    ...navLinks,
    ...authNavLinks.filter((l) => user && role && l.roles.includes(role)),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-[4.25rem] items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Lumeya" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-lg text-foreground tracking-tight">Lumeya</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-lg ${
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground capitalize">{role}</span>
              <Button variant="ghost" size="sm" className="text-[13px] rounded-full px-4 gap-1.5" onClick={handleSignOut}>
                <LogOut size={13} /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-[13px] rounded-full px-5" asChild>
                <Link to="/creator-signup">Become a Creator</Link>
              </Button>
              <Button variant="outline" size="sm" className="text-[13px] rounded-full px-5" asChild>
                <Link to="/brand-login">Login as a Brand</Link>
              </Button>
              <Button size="sm" className="text-[13px] rounded-full px-5" asChild>
                <Link to="/brand-login">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-5 md:hidden">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5" onClick={handleSignOut}>
                <LogOut size={13} /> Sign out
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                  <Link to="/creator-signup" onClick={() => setMobileOpen(false)}>Become a Creator</Link>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link to="/brand-login" onClick={() => setMobileOpen(false)}>Login as a Brand</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/brand-login" onClick={() => setMobileOpen(false)}>Get Started</Link>
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
