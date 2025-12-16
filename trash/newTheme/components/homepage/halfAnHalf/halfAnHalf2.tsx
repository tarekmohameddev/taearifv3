"use client";

import Image from "next/image";

export default function HalfAndHalf2() {
  return (
    <section className="w-full flex items-center justify-center bg-[#f5f0e8] py-12 md:py-16">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-[50%] order-2 md:order-2 flex flex-col justify-center text-right">
            {/* Main Paragraph */}
            <div className="mb-6">
              <p className="text-base md:text-lg text-[#5c3e2a] leading-relaxed">
                ندير عنك كل شيء… من الإعلان حتى التوقيع. في باهية، نوفّر لك مستأجرًا موثوقًا ونتولى إدارة عملية التأجير بالكامل، من التسويق والتواصل، حتى إعداد العقود واستلام الدفعات. كل ذلك باحترافية، شفافية، وتجربة تُبقيك مطمئنًا دائمًا
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-[2px] bg-[#5c3e2a] mb-6"></div>

            {/* Bulleted List with Checkmarks */}
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-right">
                <span className="flex-shrink-0 mt-1">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-[#5c3e2a]"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                    ></path>
                  </svg>
                </span>
                <span className="text-base md:text-lg text-[#5c3e2a]">
                  وقتك أغلى... دعنا ندير عقارك بكفاءة.
                </span>
              </li>
              <li className="flex items-start gap-3 text-right">
                <span className="flex-shrink-0 mt-1">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-[#5c3e2a]"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                    ></path>
                  </svg>
                </span>
                <span className="text-base md:text-lg text-[#5c3e2a]">
                  نبحث، نُقيّم، ونضمن الأفضل لك.
                </span>
              </li>
              <li className="flex items-start gap-3 text-right">
                <span className="flex-shrink-0 mt-1">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-[#5c3e2a]"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                    ></path>
                  </svg>
                </span>
                <span className="text-base md:text-lg text-[#5c3e2a]">
                  راحة بالك هي أولويتنا.
                </span>
              </li>
            </ul>
          </div>

          {/* Right Side - Image (Cityscape) */}
          <div className="w-full md:w-[50%] order-1  md:order-1 relative h-[300px] md:h-[500px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000"
              alt="منظر المدينة"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

