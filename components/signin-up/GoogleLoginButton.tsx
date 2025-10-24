/**
 * GoogleLoginButton Component
 * 
 * مكون بسيط لتسجيل الدخول باستخدام Google OAuth عبر NextAuth
 * يحل مشكلة "This action with HTTP GET is not supported by NextAuth.js"
 * 
 * الاستخدام:
 * import { GoogleLoginButton } from '@/components/signin-up/GoogleLoginButton';
 * 
 * <GoogleLoginButton 
 *   callbackUrl="/dashboard" 
 *   text="تسجيل الدخول بحساب Google"
 * />
 */

"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface GoogleLoginButtonProps {
  callbackUrl?: string;
  text?: string;
  variant?: "default" | "outline";
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleLoginButton({
  callbackUrl = "/dashboard",
  text = "تسجيل الدخول بحساب Google",
  variant = "default",
  className = "",
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // استخدام NextAuth signIn function
      const result = await signIn("google", {
        callbackUrl,
        redirect: true,
      });

      // إذا كان هناك خطأ
      if (result?.error) {
        const errorMessage = "فشل في تسجيل الدخول بحساب Google";
        toast.error(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        setIsLoading(false);
        return;
      }

      // نجح تسجيل الدخول
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = "حدث خطأ أثناء تسجيل الدخول";
      toast.error(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  const baseClasses =
    "w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default:
      "bg-white border-2 border-gray-300 hover:border-gray-400 hover:shadow-md text-gray-700",
    outline:
      "bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background text-foreground",
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={text}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>جاري التحميل...</span>
        </div>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-medium">{text}</span>
        </>
      )}
    </button>
  );
}

/**
 * مثال على الاستخدام في صفحة تسجيل الدخول:
 * 
 * import { GoogleLoginButton } from '@/components/signin-up/GoogleLoginButton';
 * 
 * function LoginPage() {
 *   return (
 *     <div>
 *       <h1>تسجيل الدخول</h1>
 *       
 *       {/* نموذج تسجيل الدخول التقليدي *\/}
 *       <form>...</form>
 *       
 *       {/* فاصل *\/}
 *       <div className="relative my-6">
 *         <div className="absolute inset-0 flex items-center">
 *           <div className="w-full border-t border-gray-300"></div>
 *         </div>
 *         <div className="relative flex justify-center text-sm">
 *           <span className="px-2 bg-white text-gray-500">أو</span>
 *         </div>
 *       </div>
 *       
 *       {/* زر تسجيل الدخول بـ Google *\/}
 *       <GoogleLoginButton 
 *         callbackUrl="/dashboard"
 *         text="تسجيل الدخول بحساب Google"
 *         onSuccess={() => console.log("Success!")}
 *         onError={(error) => console.error(error)}
 *       />
 *     </div>
 *   );
 * }
 */

