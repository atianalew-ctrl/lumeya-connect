import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/creators", label: "Creators" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/community", label: "Community" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/messages", label: "Messages" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-[4.25rem] items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Lumeya" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-lg text-foreground tracking-tight">Lumeya</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
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

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="ghost" size="sm" className="text-[13px] rounded-full px-5">Log in</Button>
          <Button size="sm" className="text-[13px] rounded-full px-5">Get Started</Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-5 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 rounded-full">Log in</Button>
            <Button size="sm" className="flex-1 rounded-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
