"use client"; // Ensure this is a Client Component

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  HelpCircle,
  User,
  Globe,
  ExternalLink,
  Menu,
  Building2,
  Home,
  FileText,
  BarChart3,
  LayoutTemplate,
  SettingsIcon,
  MessageSquare,
  Package,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/context/AuthContext";

interface DashboardHeaderProps {
  children?: ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  const { userData, fetchUserData } = useAuthStore();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // ! محتاج شغل لسة
  const handleLogout = async () => {
    try {
      console.log("userData1 on dashboard-header", userData);
      await useAuthStore.getState().logout();
    } catch (error) {
      console.error(error);
    }
  };
  const hey = true;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button - only visible on mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح قائمة التنقل</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 z-50">
              <div className="flex h-full flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 md:h-[60px] mr-5">
                  <span className="text-lg font-semibold ">لوحة التحكم</span>
                </div>
                <div className="px-3">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-foreground transition-all duration-200"
                          onClick={() =>
                            window.open(
                              `https://${useAuthStore.getState().userData?.username}.taearif.com`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 text-primary" />
                          {<span>معاينة الموقع</span>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>فتح الموقع في نافذة جديدة</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid gap-1 px-2">
                    {[
                      {
                        id: "dashboard",
                        label: "لوحة التحكم",
                        description: "نظرة عامة على الموقع",
                        icon: Home,
                        path: "/",
                      },
                      {
                        id: "content",
                        label: "إدارة المحتوى",
                        description: "إدارة محتوى موقعك",
                        icon: FileText,
                        path: "/content",
                      },
                      {
                        id: "blog",
                        label: "المدونة",
                        description: "إدارة مدونتك",
                        icon: FileText,
                        path: "/blog",
                      },
                      {
                        id: "projects",
                        label: "المشاريع",
                        description: "إدارة مشاريعك",
                        icon: Building2,
                        path: "/projects",
                      },
                      {
                        id: "properties",
                        label: "العقارات",
                        description: "إدارة عقاراتك",
                        icon: Home,
                        path: "/properties",
                      },
                      // {
                      //   id: "customers",
                      //   label: "العملاء",
                      //   description: "إدارة عملائك",
                      //   icon: Users,
                      //   path: "/customers",
                      // },
                      // {
                      //   id: "messages",
                      //   label: "الرسائل",
                      //   description: "عرض رسائلك",
                      //   icon: MessageSquare,
                      //   path: "/messages",
                      // },
                      // {
                      //   id: "apps",
                      //   label: "التطبيقات",
                      //   description: "إدارة تطبيقاتك",
                      //   icon: Package,
                      //   path: "/apps",
                      // },
                      {
                        id: "settings",
                        label: "إعدادات الموقع",
                        description: "تكوين موقعك",
                        icon: Settings,
                        path: "/settings",
                      },
                    ].map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="justify-start gap-2"
                        asChild
                      >
                        <Link href={item.path}>
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </Button>
                    ))}
                  </nav>
                </div>
                {useAuthStore.getState().UserIslogged && (
                  <div className="mt-auto border-t p-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo.png" // المسار النسبي للصورة داخل مجلد public
            alt="Logo" // نص بديل للصورة
            width={141} // العرض المطلوب (بالبكسل)
            height={100} // الارتفاع المطلوب (بالبكسل)
            className="" // تطبيق نفس الأبعاد مثل الأيقونة السابقة
          />
        </Link>

        <div className="hidden md:flex items-center gap-1 mr-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="https://taearif.com/about">عن تعاريف</Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>محتوى دقيق، واضح، جذاب</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="https://taearif.com/blog">المدونة</Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>مقالات ملهمة، تقنية، مبتكرة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {children}
      </div>
      {/* User Authentication Buttons */}
      <div className="flex items-center gap-2">
        {/* إذا كان المستخدم غير مسجل دخول */}
        {!useAuthStore.getState().UserIslogged && (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/signup">إنشاء حساب</Link>
            </Button>
          </>
        )}

        {/* إذا كان المستخدم مسجل دخول */}
        {useAuthStore.getState().UserIslogged && (
          <>
            {/* زر الأيام المتبقية */}
            {useAuthStore.getState().userData?.days_remaining !== undefined && (
              <Button
                size="sm"
                className={
                  useAuthStore.getState().userData.is_free_plan
                    ? ""
                    : "bg-gradient-to-r from-yellow-500 to-yellow-700 text-white"
                }
              >
                <Link href="/settings">
                  {useAuthStore.getState().userData.is_free_plan
                    ? `الباقة المجانية : عدد الأيام المتبقية هو ${useAuthStore.getState().userData.days_remaining}`
                    : useAuthStore.getState().userData.package_title}
                </Link>
              </Button>
            )}

            {/* الإشعارات */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground relative"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 flex items-center justify-center">
                      2
                    </Badge>
                    <span className="sr-only">الإشعارات</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>عرض الإشعارات</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* المساعدة */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">المساعدة</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>الحصول على المساعدة والدعم</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* قائمة المستخدم */}
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-muted-foreground/20"
                      >
                        <User className="h-5 w-5" />
                        <span className="sr-only">قائمة المستخدم</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>إعدادات الحساب</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {useAuthStore.getState().userData?.initial}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {useAuthStore.getState().userData?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {useAuthStore.getState().userData?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <User className="ml-2 h-4 w-4" />
                    <span>حسابي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings?tab=billing">
                    <span>الفواتير والاشتراك</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}
