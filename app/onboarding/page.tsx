import type { Metadata } from "next";
import OnboardingPage from "@/components/signin-up/onboarding-page";

export const metadata: Metadata = {
  title: "إعداد موقعك | منشئ المواقع",
  description: "إعداد موقعك الجديد وتخصيصه",
};

export default function OnboardingRoute() {
  return <OnboardingPage />;
}
