"use client";

import { Suspense } from "react";
import HeroSkeleton1 from "./hero/HeroSkeleton1";
import HeroSkeleton2 from "./hero/HeroSkeleton2";
import GridSkeleton1 from "./grid/GridSkeleton1";
import PropertySliderSkeleton1 from "./propertySlider/PropertySliderSkeleton1";
import HalfTextHalfImageSkeleton1 from "./halfTextHalfImage/HalfTextHalfImageSkeleton1";
import HalfTextHalfImageSkeleton2 from "./halfTextHalfImage/HalfTextHalfImageSkeleton2";
import HalfTextHalfImageSkeleton3 from "./halfTextHalfImage/HalfTextHalfImageSkeleton3";
import TestimonialsSkeleton1 from "./testimonials/TestimonialsSkeleton1";
import ContactFormSectionSkeleton1 from "./contactFormSection/ContactFormSectionSkeleton1";
import StepsSectionSkeleton1 from "./stepsSection/StepsSectionSkeleton1";
import HeaderSkeleton1 from "./header/HeaderSkeleton1";
import StaticHeaderSkeleton1 from "./header/StaticHeaderSkeleton1";
import PropertyFilterSkeleton1 from "./propertyFilter/PropertyFilterSkeleton1";
import MapSectionSkeleton1 from "./mapSection/MapSectionSkeleton1";
import FilterButtonsSkeleton1 from "./filterButtons/FilterButtonsSkeleton1";
import CtaValuationSkeleton1 from "./ctaValuation/CtaValuationSkeleton1";
import ContactMapSectionSkeleton1 from "./contactMapSection/ContactMapSectionSkeleton1";
import WhyChooseUsSkeleton1 from "./whyChooseUs/WhyChooseUsSkeleton1";
import ContactCardsSkeleton1 from "./contactCards/ContactCardsSkeleton1";

// Default Skeleton Component
const DefaultSkeleton = () => (
  <div className="animate-gentle-fade p-6 bg-gray-50 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-ultra"></div>
    <div className="space-y-4 relative z-10">
      <div className="h-6 bg-gray-200 rounded animate-breathing w-3/4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded animate-gentle-fade w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="h-4 bg-gray-100 rounded animate-gentle-fade w-5/6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="h-4 bg-gray-100 rounded animate-gentle-fade w-4/6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </div>
  </div>
);

interface SkeletonLoaderProps {
  componentName: string;
  fallback?: React.ComponentType;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  componentName,
  fallback: Fallback = DefaultSkeleton,
}) => {
  console.log(`🚀 SkeletonLoader: Component called with componentName: "${componentName}"`);
  
  // Direct component mapping - much more reliable than dynamic imports
  const renderSkeleton = () => {
    switch (componentName) {
      case "hero1":
        console.log(`🎯 SkeletonLoader: Rendering HeroSkeleton1 for ${componentName}`);
        return <HeroSkeleton1 />;
      case "hero2":
        console.log(`🎯 SkeletonLoader: Rendering HeroSkeleton2 for ${componentName}`);
        return <HeroSkeleton2 />;
      case "grid1":
        console.log(`🎯 SkeletonLoader: Rendering GridSkeleton1 for ${componentName}`);
        return <GridSkeleton1 />;
      case "propertySlider1":
        console.log(`🎯 SkeletonLoader: Rendering PropertySliderSkeleton1 for ${componentName}`);
        return <PropertySliderSkeleton1 />;
      case "halfTextHalfImage1":
        console.log(`🎯 SkeletonLoader: Rendering HalfTextHalfImageSkeleton1 for ${componentName}`);
        return <HalfTextHalfImageSkeleton1 />;
      case "halfTextHalfImage2":
        console.log(`🎯 SkeletonLoader: Rendering HalfTextHalfImageSkeleton2 for ${componentName}`);
        return <HalfTextHalfImageSkeleton2 />;
      case "halfTextHalfImage3":
        console.log(`🎯 SkeletonLoader: Rendering HalfTextHalfImageSkeleton3 for ${componentName}`);
        return <HalfTextHalfImageSkeleton3 />;
      case "testimonials1":
        console.log(`🎯 SkeletonLoader: Rendering TestimonialsSkeleton1 for ${componentName}`);
        return <TestimonialsSkeleton1 />;
      case "contactFormSection1":
        console.log(`🎯 SkeletonLoader: Rendering ContactFormSectionSkeleton1 for ${componentName}`);
        return <ContactFormSectionSkeleton1 />;
      case "stepsSection1":
        console.log(`🎯 SkeletonLoader: Rendering StepsSectionSkeleton1 for ${componentName}`);
        return <StepsSectionSkeleton1 />;
      case "header1":
        console.log(`🎯 SkeletonLoader: Rendering HeaderSkeleton1 for ${componentName}`);
        return <HeaderSkeleton1 />;
      case "staticHeader1":
        console.log(`🎯 SkeletonLoader: Rendering StaticHeaderSkeleton1 for ${componentName}`);
        return <StaticHeaderSkeleton1 />;
      case "propertyFilter1":
        console.log(`🎯 SkeletonLoader: Rendering PropertyFilterSkeleton1 for ${componentName}`);
        return <PropertyFilterSkeleton1 />;
      case "mapSection1":
        console.log(`🎯 SkeletonLoader: Rendering MapSectionSkeleton1 for ${componentName}`);
        return <MapSectionSkeleton1 />;
      case "filterButtons1":
        console.log(`🎯 SkeletonLoader: Rendering FilterButtonsSkeleton1 for ${componentName}`);
        return <FilterButtonsSkeleton1 />;
      case "ctaValuation1":
        console.log(`🎯 SkeletonLoader: Rendering CtaValuationSkeleton1 for ${componentName}`);
        return <CtaValuationSkeleton1 />;
      case "contactMapSection1":
        console.log(`🎯 SkeletonLoader: Rendering ContactMapSectionSkeleton1 for ${componentName}`);
        return <ContactMapSectionSkeleton1 />;
      case "whyChooseUs1":
        console.log(`🎯 SkeletonLoader: Rendering WhyChooseUsSkeleton1 for ${componentName}`);
        return <WhyChooseUsSkeleton1 />;
      case "contactCards1":
        console.log(`🎯 SkeletonLoader: Rendering ContactCardsSkeleton1 for ${componentName}`);
        return <ContactCardsSkeleton1 />;
      default:
        console.log(`🔄 SkeletonLoader: No skeleton found for "${componentName}", using DefaultSkeleton`);
        return <DefaultSkeleton />;
    }
  };
  
  return renderSkeleton();
};

export default SkeletonLoader;
