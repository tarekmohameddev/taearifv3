"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ className, label, error, icon, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex items-center rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-300",
          isFocused
            ? "border-blue-500/50 shadow-lg shadow-blue-500/20"
            : error
            ? "border-red-300 shadow-md"
            : "border-gray-200 shadow-sm hover:border-gray-300",
          className
        )}
      >
        {icon && (
          <div className="absolute left-4 text-gray-400 transition-colors duration-200">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent px-4 py-4 text-sm font-medium text-gray-900 placeholder-transparent outline-none transition-all duration-200",
            icon && "pl-12"
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        <AnimatePresence>
          {shouldFloat && (
            <motion.label
              initial={{ y: 0, opacity: 0, scale: 1 }}
              animate={{ y: -8, opacity: 1, scale: 0.85 }}
              exit={{ y: 0, opacity: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "absolute left-4 top-2 text-xs font-semibold transition-colors duration-200",
                icon && "left-12",
                isFocused
                  ? "text-blue-600"
                  : error
                  ? "text-red-500"
                  : "text-gray-600"
              )}
            >
              {label}
            </motion.label>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
