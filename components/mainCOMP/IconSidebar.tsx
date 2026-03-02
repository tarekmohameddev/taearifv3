"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Building2,
  MessageCircle,
  Phone,
  MessageSquare,
  Grid,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useAuthStore from "@/context/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────

interface NavSubItem {
  id: string;
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavSubItem[];
  action?: "logout" | "openHelp";
}

// ── Navigation structure ───────────────────────────────────────────────────

const MAIN_NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "الرئيسية",
    icon: Home,
    path: "/dashboard",
  },
  {
    id: "properties",
    label: "العقارات",
    icon: Building2,
    path: "/dashboard/properties",
  },
  {
    id: "customers",
    label: "العملاء",
    icon: Users,
    path: "/dashboard/customers-hub",
    children: [
      { id: "customers-list",  label: "قائمة العملاء",  path: "/dashboard/customers-hub" },
      { id: "buyers-list",     label: "قائمة المشترين", path: "/dashboard/customers-hub?tab=buyers" },
    ],
  },
  {
    id: "whatsapp",
    label: "واتساب",
    icon: MessageCircle,
    path: "/dashboard/whatsapp-management",
  },
  {
    id: "call-center",
    label: "مركز الاتصال",
    icon: Phone,
    path: "/dashboard/call-center",
  },
  {
    id: "sms",
    label: "حملات الرسائل",
    icon: MessageSquare,
    path: "/dashboard/sms-campaigns",
  },
  {
    id: "apps",
    label: "التطبيقات",
    icon: Grid,
    path: "/dashboard/apps",
  },
];

const BOTTOM_NAV: NavItem[] = [
  { id: "settings", label: "الإعدادات",     icon: Settings,   path: "/dashboard/settings" },
  { id: "help",     label: "المساعدة",       icon: HelpCircle, action: "openHelp" },
  { id: "logout",   label: "تسجيل الخروج",   icon: LogOut,     action: "logout"   },
];

const STORAGE_KEY = "sidebar_expanded";

// ── Component ──────────────────────────────────────────────────────────────

export function IconSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [expanded, setExpanded] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Persist sidebar state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setExpanded(stored === "true");
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleGroup = useCallback((id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Auth actions
  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleHelp = () => {
    window.open(
      "https://wa.me/966592960339?text=مرحباً، أحتاج مساعدة في استخدام منشئ المواقع",
      "_blank",
    );
  };

  const handleAction = (action?: "logout" | "openHelp") => {
    if (action === "logout")   handleLogout();
    if (action === "openHelp") handleHelp();
  };

  // Path matching
  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard" || pathname === "/ar/dashboard";
    return !!pathname?.startsWith(path);
  };

  const isGroupActive = (item: NavItem) =>
    isActive(item.path) || (item.children?.some((c) => isActive(c.path)) ?? false);

  // ── Collapsed icon button ──────────────────────────────────────────────

  const CollapsedIcon = ({ item }: { item: NavItem }) => {
    const Icon   = item.icon;
    const active = isGroupActive(item);

    const btn = (
      <button
        onClick={() => {
          if (item.action) handleAction(item.action);
        }}
        className={cn(
          "flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
          active
            ? "bg-[#1A3C34] text-white"
            : "text-[#9CA3AF] hover:bg-[#F4F5F7] hover:text-[#1A3C34]",
        )}
        style={{ width: 44, height: 44 }}
        aria-label={item.label}
      >
        <Icon size={22} strokeWidth={active ? 2 : 1.5} />
      </button>
    );

    const linked = item.path ? (
      <Link href={item.path} style={{ display: "contents" }}>{btn}</Link>
    ) : btn;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{linked}</TooltipTrigger>
          <TooltipContent
            side="left"
            style={{ background: "#1F2937", color: "#FFFFFF", borderRadius: 8, fontSize: 12 }}
          >
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // ── Expanded nav item ──────────────────────────────────────────────────

  const ExpandedItem = ({ item }: { item: NavItem }) => {
    const Icon        = item.icon;
    const active      = isGroupActive(item);
    const hasChildren = !!item.children?.length;
    const isOpen      = !!openGroups[item.id];

    const rowClasses = cn(
      "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none",
      active && !hasChildren
        ? "bg-[#1A3C34] text-white"
        : active && hasChildren
          ? "text-[#1A3C34] font-semibold"
          : "text-[#374151] hover:bg-[#F4F5F7]",
    );

    const iconColor = active ? (hasChildren ? "#1A3C34" : "#FFFFFF") : "#9CA3AF";

    if (hasChildren) {
      return (
        <div>
          <button className={rowClasses} onClick={() => toggleGroup(item.id)}>
            <Icon size={20} strokeWidth={active ? 2 : 1.5} style={{ color: iconColor, flexShrink: 0 }} />
            <span className="flex-1 text-right">{item.label}</span>
            {isOpen
              ? <ChevronUp size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              : <ChevronDown size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />}
          </button>
          {isOpen && (
            <div className="mt-1 mb-1 flex flex-col gap-0.5" style={{ paddingRight: 44 }}>
              {item.children!.map((child) => {
                const childActive = isActive(child.path);
                return (
                  <Link
                    key={child.id}
                    href={child.path}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                      childActive
                        ? "bg-[#E8F5EF] text-[#1A3C34]"
                        : "text-[#6B7280] hover:bg-[#F4F5F7] hover:text-[#374151]",
                    )}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const row = (
      <button
        className={rowClasses}
        onClick={() => { if (item.action) handleAction(item.action); }}
      >
        <Icon size={20} strokeWidth={active ? 2 : 1.5} style={{ color: iconColor, flexShrink: 0 }} />
        <span className="flex-1 text-right">{item.label}</span>
      </button>
    );

    return item.path ? (
      <Link href={item.path} style={{ display: "contents" }}>{row}</Link>
    ) : row;
  };

  // ── Sidebar width ──────────────────────────────────────────────────────

  const sidebarWidth = expanded ? "var(--sidebar-width-expanded)" : "var(--sidebar-width)";

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <aside
      className="hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden"
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        background: "#FFFFFF",
        borderLeft: "1px solid #E5E7EB",
        transition: "width 300ms ease, min-width 300ms ease",
      }}
    >
      {/* ── Logo & Toggle ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{
          height: "var(--header-height)",
          padding: expanded ? "0 16px" : "0 10px",
          borderBottom: "1px solid #E5E7EB",
          transition: "padding 300ms ease",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 min-w-0 overflow-hidden"
        >
          <Image
            src="/logo.png"
            alt="تعاريف"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
            priority
          />
          {expanded && (
            <span
              className="text-sm font-bold whitespace-nowrap overflow-hidden"
              style={{ color: "#1A3C34" }}
            >
              تعاريف
            </span>
          )}
        </Link>

        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[#F4F5F7] shrink-0"
          style={{ width: 32, height: 32, color: "#9CA3AF" }}
          aria-label={expanded ? "طي القائمة" : "توسيع القائمة"}
        >
          {expanded
            ? <PanelLeftClose size={18} />
            : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* ── Main Navigation ───────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          padding: expanded ? "16px 10px" : "16px 10px",
          display: "flex",
          flexDirection: "column",
          gap: expanded ? 4 : 8,
        }}
      >
        {expanded ? (
          MAIN_NAV.map((item) => <ExpandedItem key={item.id} item={item} />)
        ) : (
          <div className="flex flex-col items-center gap-2">
            {MAIN_NAV.map((item) => <CollapsedIcon key={item.id} item={item} />)}
          </div>
        )}
      </nav>

      {/* ── Bottom Actions ────────────────────────────────────────────── */}
      <div
        className="shrink-0"
        style={{
          borderTop: "1px solid #E5E7EB",
          padding: expanded ? "12px 10px" : "12px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: expanded ? "stretch" : "center",
          gap: expanded ? 4 : 8,
        }}
      >
        {expanded ? (
          BOTTOM_NAV.map((item) => <ExpandedItem key={item.id} item={item} />)
        ) : (
          BOTTOM_NAV.map((item) => <CollapsedIcon key={item.id} item={item} />)
        )}
      </div>
    </aside>
  );
}
