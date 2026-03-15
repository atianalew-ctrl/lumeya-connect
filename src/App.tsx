import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Creators from "./pages/Creators";
import CreatorProfile from "./pages/CreatorProfile";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import PostOpportunity from "./pages/PostOpportunity";
import Messages from "./pages/Messages";
import BrandDashboard from "./pages/BrandDashboard";
import CampaignWorkspace from "./pages/CampaignWorkspace";
import Community from "./pages/Community";
import UploadVideo from "./pages/UploadVideo";
import Matchmaker from "./pages/Matchmaker";
import DesignShowcase from "./pages/DesignShowcase";
import ContentActivation from "./pages/ContentActivation";
import LumeyaBlack from "./pages/LumeyaBlack";
import BrandOS from "./pages/BrandOS";
import BriefGenerator from "./pages/BriefGenerator";
import Pricing from "./pages/Pricing";
import ContractSigning from "./pages/ContractSigning";
import Analytics from "./pages/Analytics";
import ContentBoard from "./pages/ContentBoard";
import Notifications from "./pages/Notifications";
import ForBrandsPage from "./pages/ForBrands";
import CreatorSignup from "./pages/CreatorSignup";
import BrandLogin from "./pages/BrandLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/creators/:id" element={<CreatorProfile />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/post-opportunity" element={<PostOpportunity />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/community" element={<Community />} />
            <Route path="/matchmaker" element={<Matchmaker />} />
            <Route path="/designs" element={<DesignShowcase />} />
            <Route path="/activate" element={<ContentActivation />} />
            <Route path="/black" element={<LumeyaBlack />} />
            <Route path="/brand-os" element={<BrandOS />} />
            <Route path="/brief" element={<BriefGenerator />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contract" element={<ContractSigning />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/feed" element={<ContentBoard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/for-brands" element={<ForBrandsPage />} />
            <Route path="/dashboard" element={<BrandDashboard />} />
            <Route path="/campaigns/:id" element={<CampaignWorkspace />} />
            <Route path="/upload-video" element={<UploadVideo />} />
            <Route path="/creator-signup" element={<CreatorSignup />} />
            <Route path="/brand-login" element={<BrandLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
