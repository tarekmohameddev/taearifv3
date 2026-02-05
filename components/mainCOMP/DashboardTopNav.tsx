"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  LayoutTemplate,
  Grid,
  Settings,
  Menu,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import useAuthStore from "@/context/AuthContext";

const TOP_NAV_ITEMS = [
  { id: "dashboard", label: "لوحة التحكم", path: "/dashboard" },
  { id: "properties", label: "العقارات", path: "/dashboard/properties" },
  { id: "customers", label: "العملاء", path: "/dashboard/customers-hub" },
  { id: "whatsapp", label: "إدارة الواتساب", path: "/dashboard/whatsapp-management" },
  { id: "call-center", label: "مركز الاتصال", path: "/dashboard/call-center" },
  { id: "sms-campaigns", label: "حملات الرسائل", path: "/dashboard/sms-campaigns" },
] as const;

const VIEW_WEBSITE_LABEL = "معاينة الموقع";

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
  if (!cleanDomain.includes(".") && !cleanDomain.startsWith("http")) {
    alert("تنسيق الـ domain غير صحيح. يجب أن يحتوي على نقطة (مثل: example.com) أو يكون URL صحيح");
    return;
  }
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
        "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap",
        "hover:scale-105 active:scale-95",
        isActive
          ? "bg-success text-success-foreground shadow-md hover:shadow-lg"
          : "text-foreground hover:bg-muted/60 hover:shadow-sm",
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
    if (path === "/dashboard") return current === "/dashboard";
    if (path === "/live-editor") return current.startsWith("/live-editor");
    return current === path || current.startsWith(path + "/");
  };

  return (
    <>
      {/* Desktop: horizontal nav with pill-style tabs */}
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
          className="h-9 w-9"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-[280px] p-0 z-[100]">
            <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
            <div className="flex flex-col h-full pt-6">
              <div className="px-4 pb-4 border-b border-border/60">
                <span className="text-sm font-medium text-muted-foreground">
                  التنقل
                </span>
              </div>
              <nav className="flex flex-col gap-0.5 p-3">
                {TOP_NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openViewWebsite();
                    setMobileOpen(false);
                  }}
                  className="gap-3 justify-start mt-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-foreground"
                >
                  <ExternalLink className="h-5 w-5 shrink-0" />
                  {VIEW_WEBSITE_LABEL}
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
