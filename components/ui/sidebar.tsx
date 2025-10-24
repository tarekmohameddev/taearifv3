"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Hook لمراقبة ارتفاع الشاشة
const useScreenHeight = () => {
  const [isShortScreen, setIsShortScreen] = React.useState(false);
  const [isVeryShortScreen, setIsVeryShortScreen] = React.useState(false);

  React.useEffect(() => {
    const checkHeight = () => {
      setIsShortScreen(window.innerHeight < 900);
      setIsVeryShortScreen(window.innerHeight < 650);
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return { isShortScreen, isVeryShortScreen };
};

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext<{
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isShortScreen: boolean;
  isVeryShortScreen: boolean;
}>({
  expanded: true,
  setExpanded: () => undefined,
  mobileOpen: false,
  setMobileOpen: () => undefined,
  isShortScreen: false,
  isVeryShortScreen: false,
});

const SidebarProvider = ({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isShortScreen, isVeryShortScreen } = useScreenHeight();

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, mobileOpen, setMobileOpen, isShortScreen, isVeryShortScreen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { expanded } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300 h-screen max-h-screen overflow-hidden",
        expanded ? "w-[240px]" : "w-[70px]",
        className,
      )}
      {...props}
    />
  );
});
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-14 items-center border-b px-4 md:h-[60px] flex-shrink-0",
      className,
    )}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isVeryShortScreen } = useSidebar();
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden py-2 min-h-0",
        isVeryShortScreen && "hide-scrollbar",
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto border-t p-4 flex-shrink-0", className)} {...props} />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1 px-2", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean;
  }
>(({ className, active, children, ...props }, ref) => {
  const { expanded, isShortScreen } = useSidebar();

  return (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        (!expanded || isShortScreen) && "justify-center px-0",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        // إخفاء النصوص (وليس الأيقونات) عندما يكون ارتفاع الشاشة أقل من 900px
        if (index === 0) {
          // الأيقونة - تبقى دائماً
          return child;
        } else {
          // النص/الوصف - يظهر فقط إذا كان الـ sidebar مفتوح والشاشة ليست قصيرة
          return expanded && !isShortScreen ? child : null;
        }
      })}
    </a>
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
  }
>(({ className, active, children, ...props }, ref) => {
  const { expanded, isShortScreen } = useSidebar();

  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
        active
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        (!expanded || isShortScreen) && "justify-center px-0",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        // إخفاء النصوص (وليس الأيقونات) عندما يكون ارتفاع الشاشة أقل من 900px
        if (index === 0) {
          // الأيقونة - تبقى دائماً
          return child;
        } else {
          // النص/الوصف - يظهر فقط إذا كان الـ sidebar مفتوح والشاشة ليست قصيرة
          return expanded && !isShortScreen ? child : null;
        }
      })}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { expanded, setExpanded } = useSidebar();

  return (
    <button
      ref={ref}
      onClick={() => setExpanded(!expanded)}
      className={cn("p-2 rounded-md hover:bg-muted", className)}
      {...props}
    />
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
};
