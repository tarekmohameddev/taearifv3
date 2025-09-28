"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const GradientButton = React.forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(({ 
  className, 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false,
  icon,
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-300/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
      
      <div className="relative flex items-center gap-2">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.div>
        )}
        {icon && !loading && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {children}
        </motion.span>
      </div>
    </motion.button>
  );
});

GradientButton.displayName = "GradientButton";

export { GradientButton };
