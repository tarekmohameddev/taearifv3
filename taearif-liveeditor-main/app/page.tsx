"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { ServicesSection } from "@/components/landing/services-section";
import { AboutSection } from "@/components/landing/about-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WhyChooseUsSection } from "@/components/landing/why-choose-us-section";
import { BrandsSection } from "@/components/landing/brands-section";
import { Footer } from "@/components/landing/footer";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
      <div className="flex min-h-screen flex-col w-full ">
        <div className="flex justify-center w-full">
          <div className="w-fit">
            <MainNav />
          </div>
        </div>
        <main className="flex-1 w-full ">
          <div className="max-w-screen mx-auto w-full px-4 py-8">
            <HeroSection />
          </div>
          <div className="">
            <ServicesSection />
          </div>
          <div className="">
            <AboutSection />
          </div>
          <div className="">
            <PortfolioSection />
          </div>
          <div className="">
            <TestimonialsSection />
          </div>
          <div className="">
            <WhyChooseUsSection />
          </div>
          <div className="">
            <BrandsSection />
          </div>
        </main>
        <Footer />
      </div>
  );
}
