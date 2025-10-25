'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      id: 1,
      text: "بصراحة تعاريف سهّلت علي كل شيء! سويت موقعي بنفسي بدون ما أحتاج مصمم ولا مبرمج. الخدمة سهلة وسريعة ودعمهم ما يقصر أبد.",
      name: "عبدالإله القحطاني",
      title: "",
      avatar: "male"
    },
    {
      id: 2,
      text: "مرّة حبيت تجربتي مع تعاريف! واجهتهم واضحة وكل شي بسيط، خلال وقت قصير كان موقعي جاهز وشكله احترافي. أنصح أي أحد يجربهم.",
      name: "بدور العجيان",
      title: "",
      avatar: "female"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('testimonials');
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
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h6 className={`text-sm font-medium text-[#FF8C24] mb-4 transition-all duration-1000 delay-160 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            آراء عملاؤنا
          </h6>
          <h2 className={`text-4xl lg:text-5xl font-bold text-black transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            ما قاله مستخدمينا عنا
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg p-6 border border-gray-200 transition-all duration-1000 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {/* Testimonial text */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 text-right">
                "{testimonial.text}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {/* Avatar Icon */}
                  <svg 
                    className="w-8 h-8 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <h5 className="text-lg font-bold text-black">
                    {testimonial.name}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Read more button */}
        {/* <div className="text-center mt-4">
          <button className="bg-[#FF8C24] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#E67E22] transition-colors">
            قراءة المزيد
          </button>
        </div> */}
      </div>
    </section>
  );
}
