'use client';

import { useState, useEffect } from 'react';

export default function ClientsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('clients');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="clients" className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#FF8C24] opacity-10 rounded-full transform rotate-45"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#17BD37] opacity-10 rounded-full transform -rotate-12"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#9C30FF] opacity-10 rounded-full transform rotate-12"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            موثوق من{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-black">خبراء العقار.</span>
              <svg 
                className="absolute -bottom-[9.5rem] -left-3 w-full h-[50rem] text-[#FF8C24]" 
                viewBox="0 0 150 150" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M15.2,120L15.2,120c80-5,160-6,240-4c20,0.5,40,1,60,1.5" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none"
                  className=""
                />
              </svg>
            </span>
            {' '}في جميع أنحاء المملكة.
          </h2>
        </div>

        {/* Spacer */}
        <div className="h-8"></div>

        {/* Description */}
        <div className="text-center mb-16">
          <p className="text-xl text-[#6E6E75] max-w-4xl mx-auto leading-relaxed">
            من المسوّقين إلى المكاتب والمطوّرين — يعتمدون على تعاريف كل يوم لإدارة العقارات، وأتمتة التواصل، وزيادة الصفقات بسرعة وذكاء.
          </p>
        </div>

        {/* Client logos grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Client Logo 1 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/CONIHPaMkJAwXTJZpwMdjOrsI.avif"
              alt="Client Logo"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 2 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/CONIHPaMkJAwXTJZpwMdjOrsI.avif"
              alt="Client Logo"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 3 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/rAaOoySvHapmMACFBVbB83Gst8.avif"
              alt="Client Logo"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 4 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/CONIHPaMkJAwXTJZpwMdjOrsI.avif"
              alt="Client Logo"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 5 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/MEnBBT41qnvJTTfBYGzppuYwg.avif"
              alt="Client Logo"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-[#00DBBF] opacity-5 rounded-full transform rotate-45"></div>
        <div className="absolute bottom-1/3 left-20 w-28 h-28 bg-[#FFC100] opacity-5 rounded-full transform -rotate-45"></div>
      </div>
    </section>
  );
}
