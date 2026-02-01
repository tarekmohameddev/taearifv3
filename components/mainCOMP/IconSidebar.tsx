"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Home,
  Grid,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useAuthStore from "@/context/AuthContext";

const SIDEBAR_ITEMS = [
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

export function IconSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleHelp = () => {
    window.open(
      "https://wa.me/966592960339?text=مرحباً، أحتاج مساعدة في استخدام منشئ المواقع",
      "_blank",
    );
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

  const IconButton = ({ 
    item, 
    isBottom = false 
  }: { 
    item: typeof SIDEBAR_ITEMS[0] | typeof BOTTOM_ITEMS[0]; 
    isBottom?: boolean;
  }) => {
    const Icon = item.icon;
    const active = item.path ? isActive(item.path) : false;
    
    const button = (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-12 w-12 rounded-xl transition-all duration-200 ease-in-out",
          "hover:scale-105 active:scale-95",
          active 
            ? "bg-success text-success-foreground hover:bg-success hover:text-success-foreground shadow-md hover:shadow-lg" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:shadow-sm"
        )}
        asChild={!!item.path}
        onClick={() => {
          if ('action' in item && item.action) {
            handleAction(item.action);
          }
        }}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {item.path ? (
          <Link href={item.path}>
            <Icon className={cn(
              "h-5 w-5 transition-transform duration-200",
              hoveredItem === item.id && !active && "scale-110"
            )} />
            <span className="sr-only">{item.label}</span>
          </Link>
        ) : (
          <>
            <Icon className={cn(
              "h-5 w-5 transition-transform duration-200",
              hoveredItem === item.id && "scale-110"
            )} />
            <span className="sr-only">{item.label}</span>
          </>
        )}
      </Button>
    );

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium animate-in fade-in-0 zoom-in-95">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-card border-l border-border/40 shadow-sm",
        "sticky top-0 h-screen transition-all duration-300 ease-in-out"
      )}
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Logo at the top */}
      <div className="flex items-center justify-center py-4 px-2 border-b border-border/40">
        <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-110">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="h-auto w-auto max-h-12"
            priority
          />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-2 py-6 px-2">
        {SIDEBAR_ITEMS.map((item) => (
          <IconButton key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-2 py-6 px-2 border-t border-border/40">
        {BOTTOM_ITEMS.map((item) => (
          <IconButton key={item.id} item={item} isBottom />
        ))}
      </div>
    </aside>
  );
}
