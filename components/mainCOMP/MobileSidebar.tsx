"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  Grid,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import useAuthStore from "@/context/AuthContext";

const SIDEBAR_ITEMS = [
  { 
    id: "dashboard", 
    path: "/dashboard", 
    icon: LayoutDashboard,
    label: "لوحة التحكم"
  },
  { 
    id: "customers", 
    path: "/dashboard/customers-hub", 
    icon: Users,
    label: "العملاء"
  },
  { 
    id: "properties", 
    path: "/dashboard/properties", 
    icon: Home,
    label: "العقارات"
  },
  { 
    id: "apps", 
    path: "/dashboard/apps", 
    icon: Grid,
    label: "التطبيقات"
  },
];

const BOTTOM_ITEMS = [
  { 
    id: "settings", 
    path: "/dashboard/settings", 
    icon: Settings,
    label: "الإعدادات",
    action: null
  },
  { 
    id: "help", 
    path: null, 
    icon: HelpCircle,
    label: "المساعدة",
    action: "openHelp" as const
  },
  { 
    id: "logout", 
    path: null, 
    icon: LogOut,
    label: "تسجيل الخروج",
    action: "logout" as const
  },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      router.push("/login");
      onOpenChange(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleHelp = () => {
    window.open(
      "https://wa.me/966592960339?text=مرحباً، أحتاج مساعدة في استخدام منشئ المواقع",
      "_blank",
    );
    onOpenChange(false);
  };

  const handleAction = (action: "openHelp" | "logout" | null) => {
    if (action === "logout") {
      handleLogout();
    } else if (action === "openHelp") {
      handleHelp();
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/ar/dashboard";
    }
    return pathname?.startsWith(path);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[280px] p-0 z-[100]">
        <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/60">
            <span className="text-lg font-semibold">القائمة</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-muted/80 transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    active
                      ? "bg-success text-success-foreground shadow-md"
                      : "text-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-1 p-3 border-t border-border/60">
            {BOTTOM_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.path ? isActive(item.path) : false;
              
              if (item.path) {
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      active
                        ? "bg-success text-success-foreground shadow-md"
                        : "text-foreground hover:bg-muted/80"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if ('action' in item && item.action) {
                      handleAction(item.action);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out",
                    "text-foreground hover:bg-muted/80",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    item.id === "logout" && "text-destructive hover:bg-destructive/10"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden h-10 w-10 rounded-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 hover:bg-muted/80"
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <MobileSidebar open={open} onOpenChange={setOpen} />
    </>
  );
}
