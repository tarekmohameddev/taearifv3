"use client";

import type { ReactNode } from "react";
import { Bell, MessageSquare } from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { DashboardSearch } from "./DashboardSearch";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { OnboardingHeaderButton } from "@/components/onboarding/OnboardingHeaderButton";
import Link from "next/link";

interface DashboardHeaderProps {
  children?: ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  const { UserIslogged } = useAuthStore();

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        height: "var(--header-height)",
        background: "#F4F5F7",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="h-full flex items-center justify-between px-6 gap-4">
        {/* Search bar — centered */}
        {UserIslogged && (
          <div className="flex-1 flex justify-center">
            <DashboardSearch />
          </div>
        )}

        {/* Actions: notifications, messages, user profile */}
        <div className="flex items-center gap-2 shrink-0">
          {UserIslogged && (
            <>
              {/* Messages */}
              <button
                className="relative flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/80 active:scale-95"
                style={{ width: 40, height: 40 }}
                title="الرسائل"
                aria-label="الرسائل"
              >
                <MessageSquare style={{ width: 20, height: 20, color: "#6B7280" }} />
                <span
                  className="absolute"
                  style={{
                    top: 7,
                    left: 7,
                    width: 8,
                    height: 8,
                    background: "#E07A3A",
                    borderRadius: "50%",
                    border: "1.5px solid #F4F5F7",
                  }}
                />
              </button>

              {/* Notifications */}
              <button
                className="relative flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/80 active:scale-95"
                style={{ width: 40, height: 40 }}
                title="الإشعارات"
                aria-label="الإشعارات"
              >
                <Bell style={{ width: 20, height: 20, color: "#6B7280" }} />
                <span
                  className="absolute"
                  style={{
                    top: 7,
                    left: 7,
                    width: 8,
                    height: 8,
                    background: "#E07A3A",
                    borderRadius: "50%",
                    border: "1.5px solid #F4F5F7",
                  }}
                />
              </button>

              {/* Onboarding setup button */}
              <OnboardingHeaderButton />

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  height: 24,
                  background: "#E5E7EB",
                  margin: "0 4px",
                }}
              />

              {/* User profile */}
              <HeaderUserMenu />
            </>
          )}

          {/* Login / Signup for unauthenticated users */}
          {!UserIslogged && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-[20px] text-sm font-medium border border-[#E5E7EB] text-[#374151] hover:bg-white/80 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-[20px] text-sm font-semibold text-white transition-colors"
                style={{ background: "#1A3C34" }}
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {children}
      </div>
    </header>
  );
}
