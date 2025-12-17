/**
 * Utility functions for managing current plan data in cookies
 * Lightweight and fast cookie storage for plan information
 */

const PLAN_COOKIE_NAME = "current_plan";
const PLAN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export interface PlanData {
  package_title: string | null;
  is_free_plan: boolean;
  days_remaining: number | null;
  is_expired: boolean;
  package_features: string[];
  project_limit_number: number | null;
  real_estate_limit_number: number | null;
  onboarding_completed?: boolean; // إضافة onboarding_completed
  fetched_at: number; // timestamp
}

/**
 * Set plan data in cookie (lightweight JSON)
 */
export function setPlanCookie(planData: PlanData): void {
  if (typeof window === "undefined") return;

  try {
    // Create minimal data object
    const cookieData = {
      pt: planData.package_title, // package_title
      fp: planData.is_free_plan, // is_free_plan
      dr: planData.days_remaining, // days_remaining
      ex: planData.is_expired, // is_expired
      pf: planData.package_features, // package_features
      pln: planData.project_limit_number, // project_limit_number
      rln: planData.real_estate_limit_number, // real_estate_limit_number
      oc: planData.onboarding_completed, // onboarding_completed
      ts: planData.fetched_at, // timestamp
    };

    const cookieValue = JSON.stringify(cookieData);
    const expires = new Date();
    expires.setTime(expires.getTime() + PLAN_COOKIE_MAX_AGE * 1000);

    document.cookie = `${PLAN_COOKIE_NAME}=${encodeURIComponent(
      cookieValue,
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error("Error setting plan cookie:", error);
  }
}

/**
 * Get plan data from cookie
 */
export function getPlanCookie(): PlanData | null {
  if (typeof window === "undefined") return null;

  try {
    const cookies = document.cookie.split("; ");
    const planCookie = cookies.find((cookie) =>
      cookie.startsWith(`${PLAN_COOKIE_NAME}=`),
    );

    if (!planCookie) return null;

    const cookieValue = decodeURIComponent(
      planCookie.split("=").slice(1).join("="),
    );
    const data = JSON.parse(cookieValue);

    // Convert back to full format
    return {
      package_title: data.pt || null,
      is_free_plan: data.fp ?? false,
      days_remaining: data.dr ?? null,
      is_expired: data.ex ?? false,
      package_features: data.pf || [],
      project_limit_number: data.pln ?? null,
      real_estate_limit_number: data.rln ?? null,
      onboarding_completed: data.oc, // onboarding_completed
      fetched_at: data.ts || Date.now(),
    };
  } catch (error) {
    console.error("Error reading plan cookie:", error);
    return null;
  }
}

/**
 * Clear plan cookie
 */
export function clearPlanCookie(): void {
  if (typeof window === "undefined") return;

  document.cookie = `${PLAN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if plan cookie exists and is valid (not expired)
 */
export function hasValidPlanCookie(): boolean {
  const planData = getPlanCookie();
  if (!planData) return false;

  // Check if cookie is older than 6 days (refresh before expiry)
  const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;
  return planData.fetched_at > sixDaysAgo;
}

/**
 * Check if plan was fetched in this session (using sessionStorage)
 */
export function hasFetchedPlanInSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("plan_fetched") === "true";
}

/**
 * Mark plan as fetched in this session
 */
export function markPlanFetchedInSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("plan_fetched", "true");
}

/**
 * Clear plan fetch flag from session
 */
export function clearPlanFetchFlag(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("plan_fetched");
}
