import HeroSection from "@/components/home/HeroSection";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import DiscoverCreatorsSection from "@/components/home/DiscoverCreatorsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import SearchFilterSection from "@/components/home/SearchFilterSection";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CollaborationsSection from "@/components/home/CollaborationsSection";
import TrendingCreatorsSection from "@/components/home/TrendingCreatorsSection";
import CreatorCommunitySection from "@/components/home/CreatorCommunitySection";
import CreatorSpotlightSection from "@/components/home/CreatorSpotlightSection";
import CTASection from "@/components/home/CTASection";

const Index = () => (
  <div>
    <HeroSection />
    <MarqueeStrip />
    <CreatorCommunitySection />
    <DiscoverCreatorsSection />
    <CreatorSpotlightSection />
    <CategoriesSection />
    <SearchFilterSection />
    <OpportunitiesSection />
    <HowItWorksSection />
    <MarqueeStrip variant="muted" />
    <CollaborationsSection />
    <TrendingCreatorsSection />
    <CTASection />
  </div>
);

export default Index;
