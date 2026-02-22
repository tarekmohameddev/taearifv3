"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  /** Shown below the decorative panel headline */
  subtitle?: string;
}

/**
 * Shared split-screen layout for /auth/login and /auth/signup.
 *
 * Left (hidden on mobile): decorative brand panel with geometric shapes,
 * brand copy, and feature highlights — using the dashboard design spec
 * Forest Green palette.
 *
 * Right: scrollable form area with logo and the page content.
 */
export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ── Decorative Left Panel ───────────────────────────── */}
      <aside
        className="hidden lg:flex lg:w-[46%] flex-col justify-between relative overflow-hidden"
        style={{ background: "#1A3C34" }}
        aria-hidden="true"
      >
        {/* Geometric background shapes */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Large circle top-left */}
          <div
            className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10"
            style={{ background: "#4CAF82" }}
          />
          {/* Medium circle bottom-right */}
          <div
            className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10"
            style={{ background: "#5BC4C0" }}
          />
          {/* Small accent circle center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
            style={{ background: "#E8F5EF" }}
          />
          {/* Thin concentric arcs */}
          <svg
            className="absolute bottom-24 left-8 opacity-20"
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
          >
            <circle
              cx="90"
              cy="90"
              r="40"
              stroke="#BEE3CC"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r="65"
              stroke="#BEE3CC"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r="88"
              stroke="#BEE3CC"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        {/* Top: logo */}
        <div className="relative z-10 p-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="تعريف"
              width={160}
              height={56}
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* Center: brand copy */}
        <div className="relative z-10 px-10 py-8">
          <h1
            className="text-4xl font-extrabold leading-tight mb-4"
            style={{ color: "#FFFFFF", lineHeight: 1.2 }}
          >
            ابنِ حضورك
            <br />
            <span style={{ color: "#4CAF82" }}>الرقمي</span>
            <br />
            بثقة
          </h1>
          {subtitle && (
            <p className="text-base leading-relaxed mb-8" style={{ color: "#BEE3CC" }}>
              {subtitle}
            </p>
          )}
          {!subtitle && (
            <p className="text-base leading-relaxed mb-8" style={{ color: "#BEE3CC" }}>
              أنشئ موقعك العقاري الاحترافي في دقائق،
              <br />
              وادارته بسهولة من مكان واحد.
            </p>
          )}

          {/* Feature pills */}
          <ul className="space-y-3">
            {[
              "موقع احترافي جاهز في دقائق",
              "لوحة تحكم ذكية وسهلة الاستخدام",
              "دعم كامل للغة العربية",
              "تحليلات وتقارير مباشرة",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#4CAF82" }}
                >
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm" style={{ color: "#E8F5EF" }}>
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: stats strip */}
        <div
          className="relative z-10 mx-10 mb-10 p-5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(6px)" }}
        >
          <div className="flex justify-between text-center">
            {[
              { value: "+2,500", label: "عميل نشط" },
              { value: "98%", label: "رضا المستخدمين" },
              { value: "+40,000", label: "عقار مدار" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "#FFFFFF" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Form Panel ──────────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col min-h-screen overflow-y-auto"
        style={{ background: "#F4F5F7" }}
      >
        {/* Mobile logo (visible only < lg) */}
        <div className="lg:hidden flex justify-center pt-8 pb-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="تعريف"
              width={140}
              height={50}
              className="h-12 w-auto object-contain dark:invert"
            />
          </Link>
        </div>

        {/* Vertically centered form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            className="w-full max-w-[400px] rounded-2xl p-7"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="pb-6 text-center">
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            © {new Date().getFullYear()} تعريف. جميع الحقوق محفوظة.
          </p>
        </footer>
      </main>
    </div>
  );
}
