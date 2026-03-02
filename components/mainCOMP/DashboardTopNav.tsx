"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageCircle,
  Phone,
  MessageSquare,
  Building2,
  Grid3X3,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import useAuthStore from "@/context/AuthContext";

const TOP_NAV_ITEMS = [
  { id: "dashboard",   label: "الرئيسية",        path: "/dashboard",                     icon: Home },
  { id: "properties",  label: "العقارات",         path: "/dashboard/properties",          icon: Building2 },
  { id: "customers",   label: "العملاء",          path: "/dashboard/customers-hub",       icon: Users },
  { id: "whatsapp",    label: "واتساب",           path: "/dashboard/whatsapp-management", icon: MessageCircle },
  { id: "call-center", label: "الاتصال",          path: "/dashboard/call-center",         icon: Phone },
  { id: "sms",         label: "الرسائل",          path: "/dashboard/sms-campaigns",       icon: MessageSquare },
] as const;

function openViewWebsite() {
  const userData = useAuthStore.getState().userData;
  if (!userData) {
    alert("يرجى تسجيل الدخول أولاً");
    return;
  }
  const domain = userData?.domain || "";
  if (!domain || domain.trim() === "") {
    alert("يرجى إعداد domain صحيح في إعدادات الحساب");
    return;
  }
  const cleanDomain = domain.trim();
  const url = cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`;
  try {
    new URL(url);
    window.open(url, "_blank");
  } catch {
    alert("URL غير صحيح. يرجى التحقق من إعدادات الـ domain");
  }
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-[20px] text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap",
        "hover:scale-105 active:scale-95",
        isActive
          ? "bg-[#1A3C34] text-white shadow-sm font-semibold"
          : "text-[#374151] hover:bg-[#F4F5F7]",
      )}
    >
      {label}
    </Link>
  );
}

export function DashboardTopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    const current = pathname ?? "/";
    if (path === "/dashboard") return current === "/dashboard" || current === "/ar/dashboard";
    return current === path || current.startsWith(path + "/");
  };

  return (
    <>
      {/* Desktop: horizontal pill-style nav */}
      <nav className="hidden min-[900px]:flex items-center gap-1">
        {TOP_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            href={item.path}
            label={item.label}
            isActive={isActive(item.path)}
          />
        ))}
      </nav>

      {/* Mobile: hamburger + sheet */}
      <div className="flex min-[900px]:hidden items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="h-9 w-9 text-[#6B7280]"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-[280px] p-0 z-[100] border-[#E5E7EB]">
            <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
                <span className="text-sm font-semibold text-[#1A1A1A]">القائمة</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3 flex-1">
                {TOP_NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        active
                          ? "bg-[#1A3C34] text-white"
                          : "text-[#374151] hover:bg-[#F4F5F7]",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-[#E5E7EB]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openViewWebsite();
                    setMobileOpen(false);
                  }}
                  className="w-full gap-2 justify-start border-[#E5E7EB] text-[#374151] hover:bg-[#F4F5F7]"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  معاينة الموقع
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
