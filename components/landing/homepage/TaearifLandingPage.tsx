'use client';

import { useEffect, useState } from 'react';
import Navbar from './src/components/Navbar';
import HeroSection from './src/components/HeroSection';
import TaearifTypesCards from './src/components/TaearifTypesCards';
import TeamSection from './src/components/TeamSection';
import DashboardSection from './src/components/DashboardSection';
import PricingSection from './src/components/PricingSection';
import ClientsSection from './src/components/ClientsSection';
import FeaturesSectionWordPress from './src/components/FeaturesSectionWordPress';
import TestimonialsSection from './src/components/TestimonialsSection';
import WhyUsSection from './src/components/WhyUsSection';
import MobileAppSection from './src/components/MobileAppSection';
import Footer from './src/components/Footer';

export default function TaearifLandingPage() {
  const [dir, setDir] = useState('rtl'); // افتراضي RTL

  useEffect(() => {
    // تحديد الاتجاه بناءً على اللغة من URL
    const pathname = window.location.pathname;
    const isEnglish = pathname.startsWith('/en') || pathname === '/';
    
    // إذا كان المسار يبدأ بـ /en أو كان المسار الجذر (/) فهو إنجليزي
    setDir(isEnglish ? 'ltr' : 'rtl');
  }, []);

  return (
    <div className="min-h-screen" dir={dir}>
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
