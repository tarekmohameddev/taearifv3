"use client";

import Image from "next/image";

interface Logo {
  id?: string;
  src: string;
  alt?: string;
}

interface TrustedBrandsScrollerProps {
  logos?: Logo[];
  speed?: number;
  pauseOnHover?: boolean;
  opacity?: number;
  hoverOpacity?: number;
}

// Helper function to calculate number of repetitions based on logo count
const getRepetitionCount = (logoCount: number): number => {
  if (logoCount === 1) {
    return 12; // 1 logo → 8 repetitions
  } else if (logoCount <= 5) {
    return 6; // 2-5 logos → 4 repetitions
  } else if (logoCount <= 10) {
    return 4; // 6-10 logos → 2 repetitions
  } else {
    return 2; // More than 10 → 2 repetitions (default)
  }
};

// Component to render a single logo
const LogoItem = ({
  logo,
  index,
  opacity,
  hoverOpacity,
  repetitionIndex,
}: {
  logo: Logo;
  index: number;
  opacity: number;
  hoverOpacity: number;
  repetitionIndex: number;
}) => (
  <div
    key={`rep-${repetitionIndex}-${logo.id || index}`}
    className="flex h-12 w-32 items-center justify-center flex-shrink-0"
  >
    <Image
      src={logo.src}
      alt={logo.alt || `Client Logo ${index + 1}`}
      width={120}
      height={40}
      className="h-auto max-h-8 w-auto object-contain transition-opacity duration-300"
      style={{
        opacity: opacity,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = hoverOpacity.toString();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = opacity.toString();
      }}
    />
  </div>
);

export const TrustedBrandsScroller = ({
  logos = [],
  speed = 40,
  pauseOnHover = true,
  opacity = 0.6,
  hoverOpacity = 1.0
}: TrustedBrandsScrollerProps) => {
  // Fallback to default logos if none provided
  const defaultLogos = [
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-11-skqBZ3BuhxWsVeMgvZMsIRkvP1sBPI.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-07-BnL6PiuLbuvogyFgerD8RkXvyHeC7Z.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-09-WedfjhIyT9xJhijl0jP4i8IcWegSIr.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-06-gTVIkSsA26ac5CPmnObaZC3vT0lKJK.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-03-NetqwLvYDN3Kp2T8QTxk1I8ZVLHe8L.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-05-ZeYMg0as4sZJ3bxjbFdhgQ5WrkCmIg.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-04-UJ3Ajb0jJYVkXWWd5o6VDpbrS9n87f.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-02-cAk2qbxpAg3S93YrcscxN1R4O1GW2f.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-01-gX8JYjjL15YsCE3Nr26CRLHwOpvEmJ.svg",
  ];
  
  const logosToUse: Logo[] = logos.length > 0 
    ? logos.map(logo => typeof logo === 'string' ? { src: logo, alt: 'Client Logo' } : logo)
    : defaultLogos.map(src => ({ src, alt: 'Client Logo' }));

  // Calculate number of repetitions based on logo count
  const repetitionCount = getRepetitionCount(logosToUse.length);

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee ${speed}s linear infinite;
          will-change: transform;
        }

        .group:hover .animate-marquee {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
        }
      `}</style>

      <div
        dir="ltr"
        className="group relative flex overflow-hidden py-2 max-w-full [mask-image:linear-gradient(to_right,_transparent,_black_10%,_black_90%,_transparent)]"
      >
        <div className="animate-marquee flex gap-8 sm:gap-12">
          {/* Render logos with dynamic repetitions */}
          {Array.from({ length: repetitionCount }).map((_, repIndex) =>
            logosToUse.map((logo, index) => (
              <LogoItem
                key={`rep-${repIndex}-logo-${logo.id || index}`}
                logo={logo}
                index={index}
                opacity={opacity}
                hoverOpacity={hoverOpacity}
                repetitionIndex={repIndex}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export const TrustedBrandsScrollerReverse = ({
  logos = [],
  speed = 40,
  pauseOnHover = true,
  opacity = 0.6,
  hoverOpacity = 1.0
}: TrustedBrandsScrollerProps) => {
  // Fallback to default logos if none provided
  const defaultLogos = [
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-11-skqBZ3BuhxWsVeMgvZMsIRkvP1sBPI.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-07-BnL6PiuLbuvogyFgerD8RkXvyHeC7Z.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-09-WedfjhIyT9xJhijl0jP4i8IcWegSIr.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-06-gTVIkSsA26ac5CPmnObaZC3vT0lKJK.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-03-NetqwLvYDN3Kp2T8QTxk1I8ZVLHe8L.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-05-ZeYMg0as4sZJ3bxjbFdhgQ5WrkCmIg.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-04-UJ3Ajb0jJYVkXWWd5o6VDpbrS9n87f.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-02-cAk2qbxpAg3S93YrcscxN1R4O1GW2f.svg",
    "/images/homepage/brand-scroller-secondSection/Rouad-logoClients-01-gX8JYjjL15YsCE3Nr26CRLHwOpvEmJ.svg",
  ];
  
  const logosToUse: Logo[] = logos.length > 0 
    ? logos.map(logo => typeof logo === 'string' ? { src: logo, alt: 'Client Logo' } : logo)
    : defaultLogos.map(src => ({ src, alt: 'Client Logo' }));

  // Calculate number of repetitions based on logo count
  const repetitionCount = getRepetitionCount(logosToUse.length);

  return (
    <>
      <style jsx>{`
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-reverse {
          animation: marquee-reverse ${speed}s linear infinite;
          will-change: transform;
        }

        .group:hover .animate-marquee-reverse {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
        }
      `}</style>

      <div
        className="group relative flex overflow-hidden py-2 max-w-full [mask-image:linear-gradient(to_right,_transparent,_black_10%,_black_90%,_transparent)]"
        dir="ltr"
      >
        <div className="animate-marquee-reverse flex gap-8 sm:gap-12">
          {/* Render logos with dynamic repetitions */}
          {Array.from({ length: repetitionCount }).map((_, repIndex) =>
            logosToUse.map((logo, index) => (
              <LogoItem
                key={`rep-${repIndex}-logo-${logo.id || index}`}
                logo={logo}
                index={index}
                opacity={opacity}
                hoverOpacity={hoverOpacity}
                repetitionIndex={repIndex}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
