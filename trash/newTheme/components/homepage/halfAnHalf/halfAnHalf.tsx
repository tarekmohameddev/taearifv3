"use client";

import Image from "next/image";
import Link from "next/link";

export default function HalfAndHalf() {
  return (
    <section className="relative w-full flex flex-col-reverse md:flex-row min-h-[350px]">
      {/* Left Side - Text Content */}
      <div className="w-full md:w-[60%] bg-[#e4bfa1] flex flex-col justify-center items-start px-6 md:px-12 py-4 md:py-6 text-right">
        <div className="w-full">
          {/* Heading */}
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-gray-800">
            <span className="">ابنِ طريقك</span>... ولا تنتظر أن تُمنح
          </h3>

          {/* Divider */}
          <div className="w-24 h-[2px] bg-[#8b5f46] mb-4"></div>

          {/* Paragraph Text */}
          <div className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 space-y-2">
            <p>
              لا أحد يعرف ثمن النعيم الذي تريد الوصول إليه غيرك. ليس في الوعود
              ولا في التمنّي، بل في خطواتك، في عزمك، في سكونك حين يتخلّى عنك كل
              شيء إلا إيمانك بما تستحق.
            </p>
            <p>
              لا أحد سيأتي ليكملك. كل ما تبحث عنه، يبدأ حين تتوقف عن تقليد من
              سبقوك، وتبدأ في كتابة فصلك الأول بيدك، بصوتك، بخوفك حتى.
            </p>
            <p>
              اختر أن تنهض، لا لأنك مجبر، بل لأنك تستحق أن ترى ما خلف الجدار.
            </p>
          </div>

          {/* Button */}
          <Link
            href="/projects"
            className="inline-block bg-[#8b5f46] hover:bg-[#6b4630] text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300 text-base"
          >
            اكتشف عقارك الآن
          </Link>
        </div>
      </div>

      {/* Right Side - Image (Cityscape) */}
      <div className="relative w-full md:w-[40%] h-[200px] md:h-auto">
        <Image
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000"
          alt="منظر المدينة"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>
    </section>
  );
}
