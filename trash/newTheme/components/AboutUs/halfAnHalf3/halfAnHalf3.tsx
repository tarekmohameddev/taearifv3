"use client";

import Image from "next/image";

interface HalfAnHalf3Props {
  image?: string;
  title?: string;
  titleUnderlined?: string;
  paragraph?: string;
}

export default function HalfAnHalf3({
  image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000",
  title = "خبراء في خدمتك – نرافقك نحو استثمار آمن",
  titleUnderlined = "خبراء في",
  paragraph = "نقدّم لك خدمات احترافية في سوق العقارات، بفريق يتمتع بالخبرة والموثوقية، لنساعدك على اتخاذ القرار السليم.",
}: HalfAnHalf3Props) {
  return (
    <section className="w-full flex items-center justify-center bg-[#f5f0e8] pt-20 md:pt-24 pb-12 md:pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image (40% من العرض) */}
            <div className="relative w-full md:w-[40%] h-[300px] md:h-[500px] order-1 md:order-2 rounded-2xl overflow-hidden">
              <Image
                src={image}
                alt="صورة"
                fill
                className="object-cover rounded-2xl"
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {/* Right Side - Text Content (60% من العرض) */}
            <div className="w-full md:w-[60%] bg-[#f5f0e8] flex flex-col justify-center px-6 md:px-8 lg:px-10 py-8 md:py-12 text-right order-2 md:order-1">
              {/* Heading */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-black leading-tight">
                <span className="">
                  {titleUnderlined}
                  
                </span>
                
                {title.replace(titleUnderlined, "")}
              </h3>
                <div className="w-24 h-[2px] bg-[#8b5f46] mb-4 ml-auto"></div>

              {/* Paragraph Text */}
              <p className="text-sm md:text-base lg:text-lg text-black leading-relaxed">
                {paragraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

