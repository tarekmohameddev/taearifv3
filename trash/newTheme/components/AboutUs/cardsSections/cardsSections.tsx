"use client";

import Image from "next/image";
import Link from "next/link";

interface Card {
  image: string;
  title: string;
  description: string;
  readMoreUrl: string;
  date: string;
}

interface CardsSectionsProps {
  paragraph1?: string;
  paragraph2?: string;
  cards?: Card[];
}

export default function CardsSections({
  paragraph1 = "نصمم رحلتك العقارية بخطى واثقة نجمع بين السلاسة في التعامل والاحترافية في الأداء، لنقدّم لك تجربة سلسة من أول استفسار حتى استلام المفتاح. نُراعي احتياجاتك، ونُرشدك نحو أفضل الخيارات بخبرة ودراية تامة.",
  paragraph2 = "نمتلك فهماً عميقًا للسوق، وشغفًا بتقديم الأفضل لعملائنا. معنا، ستجد عقارك المثالي بسهولة وثقة.",
  cards = [
    {
      image: "https://baheya.co/wp-content/uploads/2023/05/62387dd75873914c8bbfe94a9e047b9f3b771b1b.png",
      title: "حلول عقارية سريعة وموثوقة",
      description: "نقدّم لك خدمات عقارية متكاملة بمرونة وسرعة، مع فريق يتمتع بالكفاءة والخبرة لتلبية جميع احتياجاتك بسهولة واحترافية",
      readMoreUrl: "#",
      date: "مايو 29, 2023",
    },
    {
      image: "https://baheya.co/wp-content/uploads/2023/05/62387dd75873914c8bbfe94a9e047b9f3b771b1b.png",
      title: "استثمر بثقة… وابدأ حياة جديدة",
      description: "في باهية للعقارات، نضع بين يديك مجموعة مختارة من العقارات بعناية فائقة، لنمنحك تجربة فريدة ومضمونة من البداية حتى التملّك.",
      readMoreUrl: "#",
      date: "يوليو 9, 2025",
    },
    {
      image: "https://baheya.co/wp-content/uploads/2023/05/62387dd75873914c8bbfe94a9e047b9f3b771b1b.png",
      title: "اختيارك الأول للسكن والاستثمار",
      description: "سواء كنت تبحث عن منزل الأحلام أو فرصة استثمارية رابحة، فريقنا المختص يساعدك في اتخاذ القرار الصحيح بكل شفافية ومصداقية",
      readMoreUrl: "#",
      date: "يوليو 9, 2025",
    },
  ],
}: CardsSectionsProps) {
  return (
    <section className="w-full bg-[#8b5f46] py-12 md:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section - Two Paragraphs */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row gap-6 md:gap-8 text-right">
          {/* First Paragraph - 50% */}
          <div className="w-full md:w-1/2">
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              {paragraph1}
            </p>
          </div>
          
          {/* Second Paragraph - 50% */}
          <div className="w-full md:w-1/2">
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              {paragraph2}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/30 my-8 md:my-12"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Card Image */}
              <Link href={card.readMoreUrl} className="block">
                <div className="relative w-full h-[250px] md:h-[280px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>

              {/* Card Content */}
              <div className="p-6">
                {/* Title */}
                <Link href={card.readMoreUrl}>
                  <h3 className={`text-lg md:text-xl font-bold mb-3 transition-colors ${
                    card.title === "اختيارك الأول للسكن والاستثمار" 
                      ? "text-[#8b5f46]" 
                      : "text-gray-800 hover:text-[#8b5f46]"
                  }`}>
                    {card.title}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Read More Link */}
                <Link
                  href={card.readMoreUrl}
                  className="inline-block text-[#8b5f46] font-medium hover:text-[#6b4630] transition-colors mb-4"
                >
                  قراءة المزيد...
                </Link>

                {/* Date */}
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-xs md:text-sm text-gray-500">
                    {card.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

