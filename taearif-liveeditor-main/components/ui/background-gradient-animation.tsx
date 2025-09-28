"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor,
  secondColor,
  thirdColor,
  fourthColor,
  fifthColor,
  pointerColor,
  size = "300px",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  // تحديد ألوان الدوائر بناءً على الوضع
  const getCircleColors = () => {
    if (theme === "dark") {
      return {
        first: "0, 75, 75",
        second: "0, 75, 75",
        third: "0, 75, 75",
        fourth: "0, 75, 75",
        fifth: "0, 75, 75",
        pointer: "0, 75, 75",
      };
    }
    return {
      first: "0, 125, 125",
      second: "0, 125, 125",
      third: "0, 125, 125",
      fourth: "0, 125, 125",
      fifth: "0, 125, 125",
      pointer: "0, 125, 125",
    };
  };

  // تحديد لون الخلفية بناءً على الوضع
  const getBackgroundColor = () => {
    if (theme === "dark") {
      return "rgb(28, 28, 28)"; // #1C1C1C
    }
    return "rgb(0, 75, 75)"; // #004B4B
  };

  const circleColors = getCircleColors();
  const backgroundColor = getBackgroundColor();

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      backgroundColor,
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      backgroundColor,
    );
    document.body.style.setProperty(
      "--first-color",
      firstColor || circleColors.first,
    );
    document.body.style.setProperty(
      "--second-color",
      secondColor || circleColors.second,
    );
    document.body.style.setProperty(
      "--third-color",
      thirdColor || circleColors.third,
    );
    document.body.style.setProperty(
      "--fourth-color",
      fourthColor || circleColors.fourth,
    );
    document.body.style.setProperty(
      "--fifth-color",
      fifthColor || circleColors.fifth,
    );
    document.body.style.setProperty(
      "--pointer-color",
      pointerColor || circleColors.pointer,
    );
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [
    backgroundColor,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    circleColors,
    size,
    blendingValue,
  ]);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) {
        return;
      }
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX,
      )}px, ${Math.round(curY)}px)`;
    }

    const interval = setInterval(move, 16); // 60fps
    return () => clearInterval(interval);
  }, [tgX, tgY, curX, curY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-full w-full relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full",
          isSafari ? "blur-2xl" : "blur-xl",
        )}
        style={!isSafari ? { filter: "url(#blurMe) blur(40px)" } : {}}
      >
        {/* الدائرة الأولى - تتحرك عمودياً */}
        <div
          className="absolute animate-first opacity-100 rounded-full w-[420px] h-[420px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgb(var(--first-color)) 0%, rgba(var(--first-color), 0.3) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            top: "10%",
            left: "15%",
          }}
        ></div>

        {/* الدائرة الثانية - تتحرك في دائرة */}
        <div
          className="absolute animate-second opacity-100 rounded-full w-[525px] h-[525px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--second-color), 0.8) 0%, rgba(var(--second-color), 0.2) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            top: "60%",
            left: "60%",
          }}
        ></div>

        {/* الدائرة الثالثة - تتحرك في دائرة عكسية */}
        <div
          className="absolute animate-third opacity-100 rounded-full w-[378px] h-[378px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0%, rgba(var(--third-color), 0.2) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            top: "20%",
            left: "65%",
          }}
        ></div>

        {/* الدائرة الرابعة - تتحرك أفقياً */}
        <div
          className="absolute animate-fourth opacity-70 rounded-full w-[462px] h-[462px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--fourth-color), 0.8) 0%, rgba(var(--fourth-color), 0.2) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            bottom: "15%",
            left: "10%",
          }}
        ></div>

        {/* الدائرة الخامسة - تتحرك في نمط معقد */}
        <div
          className="absolute animate-fifth opacity-100 rounded-full w-[315px] h-[315px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--fifth-color), 0.8) 0%, rgba(var(--fifth-color), 0.2) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            top: "40%",
            left: "35%",
          }}
        ></div>

        {/* الدائرة السادسة - تتحرك في الجانب الأيمن العلوي */}
        <div
          className="absolute animate-fifth opacity-60 rounded-full w-[252px] h-[252px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgb(var(--first-color)) 0%, rgba(var(--first-color), 0.2) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            top: "5%",
            left: "85%",
          }}
        ></div>

        {/* الدائرة السابعة - تتحرك في الجانب الأيسر السفلي */}
        <div
          className="absolute animate-fourth opacity-80 rounded-full w-[378px] h-[378px] origin-center"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0%, rgba(var(--third-color), 0.2) 70%, transparent 100%)`,
            mixBlendMode: blendingValue as any,
            bottom: "5%",
            left: "70%",
          }}
        ></div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className="absolute opacity-70 rounded-full w-[315px] h-[315px] origin-center"
            style={{
              background: `radial-gradient(circle at center, rgba(var(--pointer-color), 0.8) 0%, rgba(var(--pointer-color), 0.2) 50%, transparent 100%)`,
              mixBlendMode: blendingValue as any,
              top: "-157.5px",
              left: "-157.5px",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
