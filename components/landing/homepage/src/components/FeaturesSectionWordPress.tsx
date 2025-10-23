'use client';

import { useState, useEffect } from 'react';

export default function FeaturesSectionWordPress() {
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

    const element = document.getElementById('features-wp');
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
    <section id="features-wp" className="py-20 bg-white relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading with WordPress-style highlighted text */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            <span className="ui-e-headline-text">مزايا قوية مصمّمة تخدم شغلك العقاري.</span>
            <span className="ui-e-headline-text ui-e-headline-stroke7">
              <span className="whitespace"> </span>
              <span>
                <span className="ui-e-headline-text ui-e-headline-highlighted relative z-10 text-[#17BD37]">للعقارات</span>
              </span>
              <span className="whitespace"> </span>
            </span>
          </h2>
        </div>

        {/* Features showcase with WordPress-style positioning */}
        <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] aspect-auto sm:aspect-auto mt-[10rem]">
          {/* Main screenshot */}
          <div className={`flex justify-center  transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          </div>
          <div className={`flex justify-center mt-[7rem] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative inline-block">
              {/* Background circle */}
              <div className="absolute w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[600px] lg:h-[600px] bg-[#e5fef3] rounded-full -z-10 left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Dashed circle stroke */}
              <svg 
                className="absolute w-[325px] h-[325px] sm:w-[650px] sm:h-[650px] md:w-[780px] md:h-[780px] lg:w-[780px] lg:h-[780px] -z-10 left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 250 250"
              >
                <circle
                  cx="125"
                  cy="125"
                  r="123"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </svg>
               
              {/* Dashed circle stroke 2 */}
              <svg 
                className="hidden sm:block absolute w-[488px] h-[488px] sm:w-[975px] sm:h-[975px] md:w-[1170px] md:h-[1170px] lg:w-[1170px] lg:h-[1170px] -z-10 left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 250 250"
              >
                <circle
                  cx="125"
                  cy="125"
                  r="123"
                  fill="none"
                  stroke="#e6eaf0"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
              </svg>
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/screeeeeeen-1.webp"
                alt="Features Screenshot"
                className="sm:max-w-full max-w-[200px] h-auto sm:h-[40rem] md:h-[45rem] lg:h-[50rem] rounded-lg relative z-10"
              />
            </div>
          </div>

          {/* Feature annotations with WordPress-style absolute positioning */}
          <div className="absolute inset-0 pointer-events-none">
            
            {/* CRM Feature - Top Center */}
            <div className={`absolute -mt-[6rem] sm:mt-0 sm:-top-[3rem] md:-top-[5rem] left-0 right-0 flex justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="flex flex-col items-center gap-4 p-4">
              <div className="max-w-[85px] sm:max-w-[150px] text-center">
                  <h4 className="text-xs md:text-sm font-semibold text-black">
                    نظام CRM ذكي يرتّب لك كل صفقة بخطوات واضحة ومنظمة.
                  </h4>
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FF8C24] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* AI Feature - Top Right */}
            <div className={`absolute top-12 sm:top-16 md:top-[7rem] -right-3 sm:right-5 md:-right-[5rem] lg:-right-[5rem] xl:right-[10rem] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#17BD37] rounded-full flex items-center justify-center shadow-lg order-1 sm:order-0">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="max-w-[105px] sm:max-w-[150px] text-right order-0 sm:order-1">
                  <h4 className="text-xs md:text-sm font-semibold text-black">
                    الذكاء الصناعي يرد على عملاءك تلقائي ٢٤ ساعة باليوم.
                  </h4>
                </div>
              </div>
            </div>

            {/* Website Feature - Left */}
            <div className={`absolute top-12 sm:top-16 md:top-[7rem] -left-3 sm:left-6 md:-left-[5rem] lg:-left-[5rem]  xl:left-[10rem] transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#9C30FF] rounded-full flex items-center justify-center shadow-lg order-1 sm:order-0">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="max-w-[85px] sm:max-w-[150px] text-left order-0 sm:order-1">
                  <h4 className="text-xs md:text-sm font-semibold text-black">
                    موقع عقارات احترافي — جاهز خلال دقائق.
                  </h4>
                </div>
              </div>
            </div>

            {/* WhatsApp Feature - Bottom Right */}
            <div className={`absolute bottom-12 sm:bottom-[8rem] md:bottom-[15rem] -right-3 sm:right-5 md:-right-[5rem] lg:-right-[5rem] xl:right-[10rem] transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <div className="max-w-[85px] sm:max-w-[150px] text-right">
                  <h4 className="text-xs md:text-sm font-semibold text-black">
                    ربط مباشر مع الواتساب يجمع لك العملاء فورًا.
                  </h4>
                </div>
              </div>
            </div>

            {/* Dashboard Feature - Bottom Left */}
            <div className={`absolute bottom-12 sm:bottom-[8rem] md:bottom-[15rem] -left-3 sm:left-6 md:-left-[5rem] lg:-left-[5rem] xl:left-[10rem] transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#00DBBF] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
                <div className="max-w-[85px] sm:max-w-[150px] text-left">
                  <h4 className="text-xs md:text-sm font-semibold text-black">
                    لوحة تحكم يورّيك الأرقام اللي تهمّك فعلاً.
                  </h4>
                </div>
              </div>
            </div>

            {/* Decorative ornaments with WordPress-style positioning */}
            <div className={`absolute top-6 sm:top-8 md:top-10 left-6 sm:left-12 md:left-20 transition-all duration-1000 -z-5 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} hidden sm:block`}>
              <img 
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-3.webp" 
                alt="Ornament" 
                className="w-4 h-4 md:w-6 md:h-6 object-contain opacity-60"
              />
            </div>

            <div className={`absolute top-20 sm:top-24 md:top-32 right-10 sm:right-16 md:right-32 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} hidden sm:block`}>
              <img 
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-5.webp" 
                alt="Ornament" 
                className="w-2 h-2 md:w-4 md:h-4 object-contain opacity-60"
              />
            </div>

            <div className={`absolute bottom-20 sm:bottom-24 md:bottom-32 left-10 sm:left-16 md:left-32 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} hidden sm:block`}>
              <img 
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-1.webp" 
                alt="Ornament" 
                className="w-6 h-6 md:w-8 md:h-8 object-contain opacity-60"
              />
            </div>

            <div className={`absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-12 md:right-20 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} hidden sm:block`}>
              <img 
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-4.webp" 
                alt="Ornament" 
                className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-60"
              />
            </div>

            <div className={`absolute top-1/2 right-6 sm:right-12 md:right-20 transform -translate-y-1/2 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} hidden sm:block`}>
              <img 
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-2.webp" 
                alt="Ornament" 
                className="w-3 h-3 md:w-5 md:h-5 object-contain opacity-60"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
