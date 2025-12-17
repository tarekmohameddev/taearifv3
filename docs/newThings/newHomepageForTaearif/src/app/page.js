import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TaearifTypesCards from "../components/TaearifTypesCards";
import TeamSection from "../components/TeamSection";
import DashboardSection from "../components/DashboardSection";
import PricingSection from "../components/PricingSection";
import ClientsSection from "../components/ClientsSection";
import FeaturesSectionWordPress from "../components/FeaturesSectionWordPress";
import TestimonialsSection from "../components/TestimonialsSection";
import WhyUsSection from "../components/WhyUsSection";
import MobileAppSection from "../components/MobileAppSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TaearifTypesCards />
      <TeamSection />
      <DashboardSection />
      <PricingSection />
      <ClientsSection />
      <FeaturesSectionWordPress />
      <TestimonialsSection />
      <WhyUsSection />
      <MobileAppSection />
      <Footer />
    </div>
  );
}
