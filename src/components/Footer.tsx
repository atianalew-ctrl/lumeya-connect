import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg">Lumeya</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Connecting creators with brands and opportunities.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Platform</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/creators" className="hover:text-foreground transition-colors">Creators</Link>
            <Link to="/opportunities" className="hover:text-foreground transition-colors">Opportunities</Link>
            <Link to="/messages" className="hover:text-foreground transition-colors">Messages</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Blog</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Careers</span>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legal</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 Lumeya. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
