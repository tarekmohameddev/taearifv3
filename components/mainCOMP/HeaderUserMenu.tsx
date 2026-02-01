"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, CreditCard, LogOut, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import {
  getPlanCookie,
  setPlanCookie,
  hasValidPlanCookie,
  hasFetchedPlanInSession,
  markPlanFetchedInSession,
  type PlanData,
} from "@/lib/planCookie";

export function HeaderUserMenu() {
  const { userData, fetchUserData, clickedONSubButton } = useAuthStore();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const hasFetchedPlanRef = useRef(false);
  const isFetchingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  // Fetch plan data once and cache it
  useEffect(() => {
    const currentToken = userData?.token || null;

    if (
      currentToken === lastTokenRef.current &&
      lastTokenRef.current !== null
    ) {
      if (!hasFetchedPlanRef.current && hasValidPlanCookie()) {
        const cachedPlan = getPlanCookie();
        if (cachedPlan) {
          setCurrentPlan(cachedPlan);
          hasFetchedPlanRef.current = true;
        }
      }
      return;
    }

    lastTokenRef.current = currentToken;

    if (hasValidPlanCookie()) {
      const cachedPlan = getPlanCookie();
      if (cachedPlan) {
        setCurrentPlan(cachedPlan);
        hasFetchedPlanRef.current = true;
        markPlanFetchedInSession();
        return;
      }
    }

    if (
      hasFetchedPlanInSession() ||
      hasFetchedPlanRef.current ||
      isFetchingRef.current
    ) {
      return;
    }

    if (!currentToken || userData?.account_type !== "tenant") {
      return;
    }

    const fetchPlanData = async () => {
      isFetchingRef.current = true;
      hasFetchedPlanRef.current = true;
      markPlanFetchedInSession();

      try {
        setIsLoadingPlan(true);
        const response = await axiosInstance.get("/user");
        const subscriptionDATA = response.data.data;

        const planData: PlanData = {
          package_title: subscriptionDATA.membership.package.title || null,
          is_free_plan: subscriptionDATA.membership.is_free_plan || false,
          days_remaining: subscriptionDATA.membership.days_remaining || null,
          is_expired: subscriptionDATA.membership.is_expired || false,
          package_features: subscriptionDATA.membership.package.features || [],
          project_limit_number:
            subscriptionDATA.membership.package.project_limit_number || null,
          real_estate_limit_number:
            subscriptionDATA.membership.package.real_estate_limit_number ||
            null,
          fetched_at: Date.now(),
        };

        setPlanCookie(planData);
        setCurrentPlan(planData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
        hasFetchedPlanRef.current = false;
      } finally {
        setIsLoadingPlan(false);
        isFetchingRef.current = false;
      }
    };

    fetchPlanData();
  }, [userData?.token, userData?.account_type]);

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const clickedONButton = async () => {
    clickedONSubButton();
    router.push("/dashboard/settings");
  };

  const getInitials = () => {
    if (userData?.initial) return userData.initial;
    if (userData?.username) {
      return userData.username.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  const displayPlan = currentPlan || {
    package_title: userData?.package_title,
    is_free_plan: userData?.is_free_plan,
    days_remaining: userData?.days_remaining,
  };

  const hasPlanData =
    (currentPlan &&
      (currentPlan.package_title || currentPlan.is_free_plan !== undefined)) ||
    (userData?.package_title !== undefined &&
      userData?.package_title !== null) ||
    (userData?.is_free_plan !== undefined && userData?.is_free_plan !== null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-muted/80 rounded-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          <span className="text-sm font-medium hidden md:inline-block">
            مرحباً {userData?.username || "مستخدم"}
          </span>
          <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110">
            <AvatarFallback className="bg-success text-success-foreground text-xs font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-success text-success-foreground text-sm font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userData?.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userData?.email}
            </p>
          </div>
        </div>

        {hasPlanData && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <Button
                variant={displayPlan.is_free_plan ? "outline" : "secondary"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 transition-all duration-200 ease-in-out",
                  "hover:scale-105 active:scale-95",
                  !displayPlan.is_free_plan &&
                    "bg-amber-100 text-amber-800 hover:bg-amber-200"
                )}
                onClick={clickedONButton}
              >
                {!displayPlan.is_free_plan && (
                  <Star className="h-3 w-3 fill-current" />
                )}
                <span className="flex-1 text-right">
                  {displayPlan.is_free_plan
                    ? "الباقة المجانية"
                    : displayPlan.package_title || "الخطة الحالية"}
                </span>
                {!displayPlan.is_free_plan && displayPlan.days_remaining && (
                  <span className="text-xs opacity-75">
                    {displayPlan.days_remaining} يوم
                  </span>
                )}
              </Button>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <User className="ml-2 h-4 w-4" />
            <span>حسابي</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings?tab=billing" className="cursor-pointer">
            <CreditCard className="ml-2 h-4 w-4" />
            <span>الفواتير والاشتراك</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="ml-2 h-4 w-4" />
            <span>الإعدادات</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
