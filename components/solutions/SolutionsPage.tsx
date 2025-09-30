'use client';

import { useEffect } from 'react';
import SolutionsHeader from './SolutionsHeader';
import SolutionsHero from './SolutionsHero';
import SolutionsOverview from './SolutionsOverview';
import DetailedSolutions from './DetailedSolutions';
import BenefitsSection from './BenefitsSection';
import SolutionsFooter from './SolutionsFooter';
import SolutionsStyles from './SolutionsStyles';

export default function SolutionsPage() {
  useEffect(() => {
    // Animation Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(
      ".animate-fade-in, .animate-slide-up"
    );

    animatedElements.forEach((el) => observer.observe(el));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      <SolutionsStyles />
      <SolutionsHeader />
      <SolutionsHero />
      <SolutionsOverview />
      <DetailedSolutions />
      <BenefitsSection />
      <SolutionsFooter />
    </div>
  );
}
