"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

interface CustomDialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogContentProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function CustomDialog({
  open,
  onOpenChange,
  children,
  className = "",
  maxWidth = "max-w-4xl",
}: CustomDialogProps) {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
        style={{
          opacity: open ? 1 : 0,
        }}
      />

      {/* Dialog Content */}
      <div
        className={`
          relative z-50 w-full ${maxWidth} max-h-[90vh] 
          bg-white rounded-lg shadow-2xl
          transform transition-all duration-200
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function CustomDialogTrigger({
  children,
  asChild = false,
}: CustomDialogTriggerProps) {
  // This is just a wrapper, the actual trigger should be handled by parent
  return <>{children}</>;
}

export function CustomDialogContent({
  children,
  className = "",
}: CustomDialogContentProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CustomDialogHeader({
  children,
  className = "",
}: CustomDialogHeaderProps) {
  return (
    <div className={`border-b border-gray-200 pb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CustomDialogTitle({
  children,
  className = "",
}: CustomDialogTitleProps) {
  return (
    <h2 className={`text-2xl font-bold text-black ${className}`}>
      {children}
    </h2>
  );
}

export function CustomDialogDescription({
  children,
  className = "",
}: CustomDialogDescriptionProps) {
  return (
    <p className={`text-gray-600 text-base ${className}`}>
      {children}
    </p>
  );
}

// Close button component
export function CustomDialogClose({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClose}
      className={`
        absolute right-4 top-4 rounded-sm opacity-70 
        hover:opacity-100 transition-opacity
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
        ${className}
      `}
      aria-label="إغلاق"
    >
      <X className="h-4 w-4" />
    </button>
  );
}

