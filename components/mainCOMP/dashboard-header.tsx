"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/context/AuthContext";
import { DashboardTopNav } from "./DashboardTopNav";
import { DashboardSearch } from "./DashboardSearch";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { MobileSidebarTrigger } from "./MobileSidebar";

interface DashboardHeaderProps {
  children?: ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  const { UserIslogged } = useAuthStore();

  return (
    <header
      className="sticky top-0 z-30 bg-background border-b border-border/40 shadow-sm"
      style={{ height: "var(--header-height)" }}
    >
      <div className="h-full flex items-center justify-between px-4 md:px-6 gap-4">
        {/* Right side (RTL start): Dashboard Navigation */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {UserIslogged && (
            <div className="hidden lg:flex">
              <DashboardTopNav />
            </div>
          )}

          {/* Mobile sidebar trigger */}
          {UserIslogged && <MobileSidebarTrigger />}
        </div>

        {/* Center: Search Bar */}
        {UserIslogged && (
          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <DashboardSearch />
          </div>
        )}

        {/* Left side (RTL end): Icons and User menu */}
        <div className="flex items-center gap-3 shrink-0">
          {UserIslogged && (
            <>
              {/* Notification Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 rounded-xl hover:bg-muted/80 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                    >
                      <Bell className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
                      <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center bg-success text-success-foreground text-xs animate-pulse">
                        3
                      </Badge>
                      <span className="sr-only">الإشعارات</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="animate-in fade-in-0 zoom-in-95">
                    <p>عرض الإشعارات</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Messages Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 rounded-xl hover:bg-muted/80 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                    >
                      <MessageSquare className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
                      <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center bg-success text-success-foreground text-xs animate-pulse">
                        2
                      </Badge>
                      <span className="sr-only">الرسائل</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="animate-in fade-in-0 zoom-in-95">
                    <p>عرض الرسائل</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <HeaderUserMenu />
            </>
          )}
        </div>

        {/* Login/Signup buttons for non-logged users */}
        {!UserIslogged && (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/signup">إنشاء حساب</Link>
            </Button>
          </div>
        )}

        {children}
      </div>
    </header>
  );
}
