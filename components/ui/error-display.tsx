"use client";

import {
  AlertTriangle,
  RefreshCw,
  Wifi,
  Server,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  showRetry?: boolean;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "حدث خطأ",
  showRetry = true,
  className = "",
}: ErrorDisplayProps) {
  // تحديد نوع الخطأ بناءً على المحتوى
  const getErrorType = (errorMessage: string) => {
    if (
      errorMessage.includes("خطأ في الخادم") ||
      errorMessage.includes("500")
    ) {
      return "server";
    }
    if (
      errorMessage.includes("خطأ في الاتصال") ||
      errorMessage.includes("الشبكة")
    ) {
      return "network";
    }
    if (errorMessage.includes("غير مصرح") || errorMessage.includes("401")) {
      return "auth";
    }
    return "general";
  };

  const errorType = getErrorType(error);

  const getErrorIcon = () => {
    switch (errorType) {
      case "server":
        return <Server className="h-8 w-8 text-red-500" />;
      case "network":
        return <Wifi className="h-8 w-8 text-orange-500" />;
      case "auth":
        return <AlertCircle className="h-8 w-8 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case "server":
        return "يبدو أن هناك مشكلة في الخادم. يرجى المحاولة مرة أخرى لاحقاً.";
      case "network":
        return "تحقق من اتصال الإنترنت وحاول مرة أخرى.";
      case "auth":
        return "يبدو أن جلسة العمل انتهت. يرجى تسجيل الدخول مرة أخرى.";
      default:
        return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
    }
  };

  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">{getErrorIcon()}</div>
        <CardTitle className="text-red-800">{title}</CardTitle>
        <CardDescription className="text-red-600">
          {getErrorDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-red-100 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>

        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة المحاولة
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// مكون مبسط لعرض الأخطاء في قوائم
export function ErrorMessage({
  error,
  onRetry,
  className = "",
}: {
  error: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">حدث خطأ</h3>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  );
}
