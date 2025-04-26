"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Home,
  MessageSquare,
  Package,
  Settings,
  Users,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

interface EnhancedSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "panel":
      return LayoutDashboard; 
    case "content-settings":
      return FileText; 
    case "web-settings":
      return Settings; 
    case "building":
      return Building2; 
    case "home":
      return Home; 
    case "message":
      return MessageSquare; 
    case "package":
      return Package; 
    case "users":
      return Users; 
    case "external-link":
      return ExternalLink; 
    default:
      return FileText; 
  }
};

export function EnhancedSidebar({
  activeTab,
  setActiveTab,
}: EnhancedSidebarProps) {
  const pathname = usePathname();
  const [isNewUser, setIsNewUser] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    activeTab || "dashboard",
  );
  const [mainNavItems, setMainNavItems] = useState<any[]>([]); 

  useEffect(() => {
    const fetchSideMenus = async () => {
      try {
        const response = await axiosInstance.get("/settings/side-menus");
        const sections = response.data.data.sections;
        const items = sections.map((section: any) => ({
          id: section.path.split("/").pop(), 
          label: section.title, 
          description: section.description, 
          icon: getIconComponent(section.icon), 
          path: section.path, 
        }));
        setMainNavItems(items);
      } catch (error) {
        console.error("فشل في جلب القوائم الجانبية:", error);
      }
    };
    fetchSideMenus();
  }, []);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (hasVisitedBefore) {
      setIsNewUser(false);
    } else {
      setTimeout(
        () => {
          localStorage.setItem("hasVisitedBefore", "true");
          setIsNewUser(false);
        },
        3 * 24 * 60 * 60 * 1000,
      );
    }
  }, []);

  // تحديد العنصر النشط بناءً على المسار الحالي
  const currentPath = pathname || "/";
  const isContentSection = currentPath.startsWith("/content");
  const currentTab = isContentSection
    ? "content"
    : mainNavItems.find(
        (item) =>
          item.path === currentPath ||
          (item.path !== "/" && currentPath.startsWith(item.path)),
      )?.id || "dashboard";

  // تحديث العنصر النشط عند تغيير المسار
  useEffect(() => {
    if (currentTab) {
      setInternalActiveTab(currentTab);
      if (typeof setActiveTab === "function") {
        setActiveTab(currentTab);
      }
    }
  }, [currentPath, currentTab, setActiveTab]);

  const NavItem = ({
    item,
    isActive,
  }: {
    item: (typeof mainNavItems)[0];
    isActive: boolean;
  }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 h-auto py-2 px-3 w-full",
              isCollapsed && "justify-center px-2",
              isActive &&
                "bg-primary/10 text-primary border-r-2 border-primary",
            )}
            asChild
          >
            <Link href={item.path}>
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground hidden md:inline-block">
                    {item.description}
                  </span>
                </div>
              )}
            </Link>
          </Button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="left">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 md:h-[60px]">
        <div className="flex flex-col w-full">
          <span className="text-lg font-semibold truncate">
            {useAuthStore.getState().userData?.username}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {!isCollapsed
              ? `${useAuthStore.getState().userData?.domain || ""}`
              : ""}
          </span>
        </div>
      </div>

      <div className="px-3">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-foreground transition-all duration-200"
                onClick={() => {
                  const domain = useAuthStore.getState().userData?.domain || "";
                  const url = domain.startsWith("http")
                    ? domain
                    : `https://${domain}`;
                  window.open(url, "_blank");
                }}
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                {!isCollapsed && <span>معاينة الموقع</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>فتح الموقع في نافذة جديدة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 py-2 px-1">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={
                activeTab
                  ? currentTab === item.id && activeTab === item.id
                  : internalActiveTab === item.id
              }
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "hidden md:flex flex-col border-l bg-background transition-all duration-300 z-40 sticky top-16 h-[calc(100vh-4rem)]",
          isCollapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
