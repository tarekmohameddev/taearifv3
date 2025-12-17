"use client";

import { useState } from "react";
import Image from "next/image";
import { Home, Flag } from "lucide-react";

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative max-h-fit bg-[#d7f7ec]">
      {/* Background image with dark overlay */}
      <img
        src="/bghero.webp"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 flex items-center max-h-fit pt-[9rem]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-right space-y-6">
              {/* Main heading */}
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                ابنِ نظامك العقاري بطريقتك.
              </h1>

              {/* Sub heading with underline */}
              <div className="relative inline-block">
                <h2 className="text-4xl lg:text-6xl text-black font-medium relative z-10">
                  بسرعة، بذكاء، وبقوة.
                </h2>
                {/* underline */}
                <div className="absolute bottom-0 left-0 w-full h-3 bg-[#EFBE7C] -z-10"></div>
              </div>

              {/* Description */}
              <p className="text-lg text-[#6E6E75] max-w-lg">
                تعاريف توفّر كل اللي يحتاجه المسوّق، المكتب، والمطوّر العقاري.
              </p>

              {/* Button with icon */}
              <div className="flex items-center gap-4">
                <button
                  className="relative bg-black text-white px-8 py-4 rounded-lg font-medium transition-colors duration-300 hover:bg-[#FA8923] overflow-hidden flex items-center gap-3"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span
                    className={`block transition-all duration-300 ${isHovered ? "-translate-y-full  opacity-0" : "translate-y-0"}`}
                  >
                    تسجيل الدخول/التسجيل
                  </span>
                  <span
                    className={`block transition-transform duration-300 ${isHovered ? "translate-y-0 " : "translate-y-full "} absolute top-0 left-4 w-full h-full flex items-center justify-center gap-3`}
                  >
                    تسجيل الدخول/التسجيل
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
              </div>

              {/* Trust text */}
              <p className="text-base text-black">
                موثوق به من قبل اكثر من{" "}
                <span className="text-[#FF8C24] font-bold">2,000,000</span>{" "}
                المحترفين العقاريين في كل أنحاء السعودية
              </p>
            </div>

            {/* Right side - Image with icons */}
            <div className="relative">
              {/* Main image */}
              <div className="relative z-10">
                <Image
                  src="/taereef-hero.webp"
                  alt="تعاريف"
                  width={600}
                  height={500}
                  className="w-full h-auto rounded-lg "
                />
              </div>

              {/* Home icon - Right side */}
              <div className="absolute top-2/3 sm:top-1/2 right-1 sm:-right-4 z-20 transform -translate-y-1/2">
                <div className="bg-green-500 p-3 rounded-xl shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Flag icon - Left side */}
              <div className="absolute top-1/3  left-1 sm:-left-4 z-20 transform -translate-y-1/2 -translate-y-8">
                <div className="bg-orange-500 p-4 rounded-xl shadow-lg">
                  <Flag className="w-8 h-8 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
