"use client";

import Image from "next/image";

interface ImageTextProps {
  backgroundImage?: string;
  title?: string;
  paragraph?: string;
  blockquote?: string;
  overlayOpacity?: number;
}

export default function ImageText({
  backgroundImage = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
  title = "سكن يليق بطموحك وامكاناتك",
  paragraph = "نحن لا نعرض عقارات فقط، بل نقدّم تجربة مبنية على الثقة، والشفافية، واحترافية عالية في كل خطوة. سواء كنت تبحث عن سكن، استثمار، أو فرصة تبني بها استقرارك نحن هنا لنقودك إلى قرار تعرف أنه لك، ويشبهك.",
  blockquote = "في باهية، نؤمن أن كل شخص يستحق فرصة لبناء مستقبله العقاري بطريقته الخاصة. نمنحك كامل الحرية في اكتشاف الخيارات التي تناسبك، وبأفضل قيمة ممكنة.",
  overlayOpacity = 0.3,
}: ImageTextProps) {
  return (
    <section className="relative w-full h-[500px]  flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="خلفية"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay for better text readability */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center text-white space-y-6 md:space-y-8">
          {/* Main Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {title}
          </h3>

          {/* First Paragraph */}
          <div className="text-base md:text-lg lg:text-xl leading-relaxed text-white/95">
            <p className="whitespace-pre-line">{paragraph}</p>
          </div>

          {/* Blockquote */}
          <blockquote className="border-r-0 border-l-0 border-t-0 border-b-0 pt-6 md:pt-8">
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-white/95 italic">
              {blockquote}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

