import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-muted/50 py-12">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">Lumeya</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Connecting creators with brands and opportunities.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/creators" className="hover:text-foreground">Creators</Link>
            <Link to="/opportunities" className="hover:text-foreground">Opportunities</Link>
            <Link to="/messages" className="hover:text-foreground">Messages</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">About</span>
            <span className="hover:text-foreground cursor-pointer">Blog</span>
            <span className="hover:text-foreground cursor-pointer">Careers</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span className="hover:text-foreground cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 Lumeya. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
