"use client";

import React from "react";
import { useClientT } from "@/context-liveeditor/clientI18nStore";
import { useClientLocale } from "@/context-liveeditor/clientI18nStore";
import { Button } from "@/components/ui/button";

interface Hero1TranslatedProps {
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  backgroundImage?: string;
  className?: string;
}

export default function Hero1Translated({
  title = {
    ar: "مرحباً بك في موقعنا",
    en: "Welcome to our website",
  },
  subtitle = {
    ar: "نحن نقدم أفضل الخدمات العقارية",
    en: "We provide the best real estate services",
  },
  buttonText = {
    ar: "اكتشف المزيد",
    en: "Discover More",
  },
  buttonLink = "#",
  backgroundImage = "/placeholder.jpg",
  className = "",
}: Hero1TranslatedProps) {
  const t = useClientT();
  const { locale } = useClientLocale();

  const getTranslatedText = (textObj: Record<string, string>) => {
    return textObj[locale] || textObj.ar || Object.values(textObj)[0] || "";
  };

  return (
    <div
      className={`relative min-h-[500px] flex items-center justify-center bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {getTranslatedText(title)}
        </h1>

        <p className="text-xl md:text-2xl mb-8 opacity-90">
          {getTranslatedText(subtitle)}
        </p>

        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          onClick={() => window.open(buttonLink, "_blank")}
        >
          {getTranslatedText(buttonText)}
        </Button>
      </div>
    </div>
  );
}
