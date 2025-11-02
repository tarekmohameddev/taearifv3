"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SharedHeaderProps {
  activePage?: string;
}

export default function SharedHeader({ activePage = "" }: SharedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const getActiveClass = (page: string) => {
    return activePage === page
      ? "text-black border-b-2 border-purple-500"
      : "text-slate-700 hover:text-black transition-colors";
  };

  const getMobileActiveClass = (page: string) => {
    return activePage === page
      ? "text-lg font-medium py-3 px-4 rounded-lg bg-purple-50 text-purple-700"
      : "text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50";
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="relative group cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <svg
                version="1.0"
                width="150"
                height="100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 565.000000 162.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path
                    d="M4182 1488 c-17 -17 -17 -1279 0 -1296 9 -9 128 -12 473 -12 l460 0
                  188 188 187 187 0 457 c0 402 -2 458 -16 472 -14 14 -86 16 -648 16 -478 0
                  -635 -3 -644 -12z m1030 -265 c17 -15 18 -37 18 -270 l0 -253 -112 0 c-150 0
                  -148 2 -148 -147 l0 -113 -140 0 -140 0 0 110 c0 97 -2 112 -20 130 -18 18
                  -33 20 -130 20 l-110 0 0 260 c0 236 2 260 18 269 10 7 152 11 381 11 325 0
                  366 -2 383 -17z"
                  ></path>
                  <path
                    d="M837 1274 c-4 -4 -7 -43 -7 -86 l0 -78 95 0 96 0 -3 83 -3 82 -85 3
                  c-47 1 -89 0 -93 -4z"
                  ></path>
                  <path
                    d="M2150 934 l0 -345 73 -90 72 -89 625 2 c613 3 626 3 670 24 55 26
                  103 76 125 128 9 22 19 82 22 133 l6 93 -82 0 -81 0 0 -55 c0 -121 -36 -145
                  -218 -145 l-129 0 -5 109 c-4 92 -8 117 -32 164 -30 63 -69 100 -136 131 -37
                  17 -65 21 -160 21 -140 0 -195 -14 -255 -67 -55 -48 -85 -123 -85 -210 0 -60
                  2 -64 42 -105 l42 -43 -167 0 -167 0 0 345 0 345 -80 0 -80 0 0 -346z m875
                  -110 c39 -26 55 -71 55 -159 l0 -75 -190 0 -190 0 0 63 c0 110 28 166 96 187
                  48 16 196 5 229 -16z"
                  ></path>
                  <path d="M3330 1010 l0 -80 90 0 90 0 0 80 0 80 -90 0 -90 0 0 -80z"></path>
                  <path d="M3550 1010 l0 -80 95 0 95 0 0 80 0 80 -95 0 -95 0 0 -80z"></path>
                  <path
                    d="M780 1007 c-101 -28 -157 -87 -185 -192 -26 -100 -22 -123 32 -177
                  l47 -48 -307 0 -307 0 0 -90 0 -91 773 3 c858 3 810 -1 886 71 51 49 72 105
                  78 213 l6 94 -82 0 -81 0 0 -55 c0 -31 -7 -69 -15 -85 -27 -51 -58 -60 -218
                  -60 l-144 0 -6 98 c-7 127 -32 196 -93 252 -25 23 -62 49 -82 57 -49 21 -240
                  28 -302 10z m232 -167 c20 -6 48 -24 62 -41 24 -28 26 -39 26 -120 l0 -89
                  -185 0 -185 0 0 75 c0 112 25 159 93 175 48 12 147 11 189 0z"
                  ></path>
                  <path
                    d="M1880 565 c0 -148 -4 -233 -12 -249 -17 -38 -56 -59 -122 -65 l-59
                  -6 -33 -73 -33 -72 103 0 c136 0 193 17 256 78 73 71 80 106 80 384 l0 228
                  -90 0 -90 0 0 -225z"
                  ></path>
                  <path d="M1160 180 l0 -80 90 0 90 0 0 80 0 80 -90 0 -90 0 0 -80z"></path>
                  <path d="M1380 180 l0 -80 95 0 95 0 0 80 0 80 -95 0 -95 0 0 -80z"></path>
                </g>
              </svg>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavigation("/")}
              className={`text-sm font-medium transition-colors ${getActiveClass("home")}`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => handleNavigation("/solutions")}
              className={`text-sm font-medium transition-colors ${getActiveClass("solutions")}`}
            >
              الحلول
            </button>
            <button
              onClick={() => handleNavigation("/updates")}
              className={`text-sm font-medium transition-colors ${getActiveClass("updates")}`}
            >
              التحديثات
            </button>
            <button
              onClick={() => handleNavigation("/about-us")}
              className={`text-sm font-medium transition-colors ${getActiveClass("about-us")}`}
            >
              من نحن
            </button>
            <a
              href="https://wa.me/966592960339"
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
            >
              اتصل بنا
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={`login/`}
              className="hidden sm:inline-flex items-center justify-center border-2 border-gray-200 bg-transparent text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors text-sm"
            >
              تسجيل الدخول
            </a>
            <a
              href={`register/`}
              className="inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              جرّب مجاناً الآن
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 transition-all duration-300 md:hidden">
          <div className="max-w-6xl mx-auto px-4 h-full flex flex-col py-6">
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold">تعاريف</div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-right">
              <button
                onClick={() => handleNavigation("/")}
                className={getMobileActiveClass("home")}
              >
                الرئيسية
              </button>
              <button
                onClick={() => handleNavigation("/solutions")}
                className={getMobileActiveClass("solutions")}
              >
                الحلول
              </button>
              <button
                onClick={() => handleNavigation("/updates")}
                className={getMobileActiveClass("updates")}
              >
                التحديثات
              </button>
              <button
                onClick={() => handleNavigation("/about-us")}
                className={getMobileActiveClass("about-us")}
              >
                من نحن
              </button>
              <a
                href="https://wa.me/966592960339"
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                اتصل بنا
              </a>
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <a
                href="https://taearif.com"
                className="w-full py-3 px-4 border-2 border-gray-200 bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition-colors text-center"
              >
                تسجيل الدخول
              </a>
              <a
                href={`register/`}
                className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                جرّب مجاناً الآن
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
