'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      id: 1,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 2,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 3,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 4,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 5,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 6,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 7,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 8,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
    },
    {
      id: 9,
      text: "قبل استخدام برنامج تعارف، كنا نتعامل مع القوائم والعملاء يدويًا من خلال جداول البيانات ومجموعات واتساب.",
      name: "خالد المطيري",
      title: "مؤسس شركة التميز",
      image: "https://test.kingbellsa.com/wp-content/uploads/2025/10/istockphoto-1394149742-612x612-1.jpg"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-right">
                  <h5 className="text-lg font-bold text-black">
                    {testimonial.name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Read more button */}
        <div className="text-center mt-4">
          <button className="bg-[#FF8C24] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#E67E22] transition-colors">
            قراءة المزيد
          </button>
        </div>
      </div>
    </section>
  );
}
