import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/creators", label: "Creators" },
  { to: "/matchmaker", label: "Matchmaker" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/community", label: "Community" },
  { to: "/activate", label: "Activate" },
  { to: "/brief", label: "Brief" },
  { to: "/brand-os", label: "Brand OS" },
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
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-[4.25rem] items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Lumeya" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-[1.1rem] text-foreground tracking-tight">Lumeya</span>
        </Link>

        {/* Desktop nav — scrollable */}
        <div className="hidden items-center gap-0 md:flex overflow-x-auto">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 text-[12px] tracking-wide transition-colors whitespace-nowrap rounded-lg ${
                location.pathname === link.to
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-2 md:flex shrink-0">
          {/* Black pill — always visible */}
          <Link
            to="/black"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-1.5 text-[11px] font-medium tracking-widest uppercase hover:bg-foreground/90 transition-colors"
          >
            <span className="w-1 h-1 rounded-full bg-background/50" />
            Black
          </Link>

          {user ? (
            <>
              <span className="text-xs text-muted-foreground capitalize">{role}</span>
              <Button variant="ghost" size="sm" className="text-[12px] rounded-full px-4 gap-1.5" onClick={handleSignOut}>
                <LogOut size={12} /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-[12px] rounded-full px-4" asChild>
                <Link to="/creator-signup">Join as Creator</Link>
              </Button>
              <Button size="sm" className="text-[12px] rounded-full px-5" asChild>
                <Link to="/brand-login">For Brands</Link>
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
        <div className="border-t border-border/40 bg-background/95 backdrop-blur px-4 pb-6 md:hidden">
          <div className="py-3 space-y-0.5">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-3 text-sm transition-colors rounded-lg ${
                  location.pathname === link.to
                    ? "text-foreground font-medium bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/black"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-lg bg-foreground text-background mt-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-background/50" />
              Lumeya Black
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {user ? (
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5" onClick={handleSignOut}>
                <LogOut size={13} /> Sign out
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link to="/creator-signup" onClick={() => setMobileOpen(false)}>Join as Creator</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/brand-login" onClick={() => setMobileOpen(false)}>For Brands</Link>
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
