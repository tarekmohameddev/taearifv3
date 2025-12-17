"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// تحميل ReCaptchaClientWrapper بشكل ديناميكي فقط على الـ client side
const ReCaptchaClientWrapper = dynamic(
  () =>
    import("./ReCaptchaClientWrapper").then((mod) => ({
      default: mod.ReCaptchaClientWrapper,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

export function DynamicReCaptcha({ children }: { children: ReactNode }) {
  return <ReCaptchaClientWrapper>{children}</ReCaptchaClientWrapper>;
}
