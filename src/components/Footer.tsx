import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 bg-linen py-16">
    <div className="container">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg tracking-tight">Lumeya</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            A curated space connecting creators with brands for meaningful collaboration.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] font-medium uppercase tracking-scandi text-muted-foreground">Platform</h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link to="/creators" className="hover:text-foreground transition-colors">Creators</Link>
            <Link to="/opportunities" className="hover:text-foreground transition-colors">Opportunities</Link>
            <Link to="/community" className="hover:text-foreground transition-colors">Community</Link>
            <Link to="/messages" className="hover:text-foreground transition-colors">Messages</Link>
          </div>
        </div>
        <div>
          <h4 className="text-[11px] font-medium uppercase tracking-scandi text-muted-foreground">Company</h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Blog</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Careers</span>
          </div>
        </div>
        <div>
          <h4 className="text-[11px] font-medium uppercase tracking-scandi text-muted-foreground">Legal</h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
      <div className="mt-14 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground tracking-wide">
        © 2026 Lumeya. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
