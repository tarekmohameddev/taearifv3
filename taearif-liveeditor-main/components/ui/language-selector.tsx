"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "AR", name: "العربية", flag: "🇸🇦" },
  { code: "TR", name: "Türkçe", flag: "🇹🇷" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
];

interface LanguageSelectorProps {
  className?: string;
  onLanguageChange?: (language: Language) => void;
}

export function LanguageSelector({ className, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
  };

  return (
    
    <div ref={dropdownRef} className={cn("relative", className)} style={{ zIndex: 9999 }}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="h-4 w-4" />
        <span className="flex items-center gap-1">
          <span className="text-lg">{selectedLanguage.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage.code}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-gray-200/50 overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-50",
                    selectedLanguage.code === language.code
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {selectedLanguage.code === language.code && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="ml-auto h-2 w-2 rounded-full bg-blue-500"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
