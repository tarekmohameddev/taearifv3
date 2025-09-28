"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";

interface AuthRedirect1Props {
  callbackUrl?: string;
}

const AuthRedirect1 = ({ callbackUrl = "/account" }: AuthRedirect1Props) => {
  const { status } = useSession();
  const router = useRouter();
  const tenant = useStore((state) => state.tenant);

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to signup with tenant info
      router.push(
        `/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    } else if (status === "authenticated") {
      // Redirect to the callback URL
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication status...</p>
      </div>
    </div>
  );
};

export default AuthRedirect1;
