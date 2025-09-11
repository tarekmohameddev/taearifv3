"use client";

import React from "react";

interface UtilitiesProps {
  onAnnounceToScreenReader: (message: string) => void;
  onShowSuccessAnimation: (stageId: string) => void;
}

export default function Utilities({
  onAnnounceToScreenReader,
  onShowSuccessAnimation,
}: UtilitiesProps) {
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const showSuccessAnimation = (stageId: string) => {
    const stageElement = document.querySelector(`[data-stage-id="${stageId}"]`);
    if (stageElement) {
      stageElement.classList.add("animate-pulse", "ring-2", "ring-green-500");
      setTimeout(() => {
        stageElement.classList.remove(
          "animate-pulse",
          "ring-2",
          "ring-green-500",
        );
      }, 1000);
    }
  };

  const formatSaudiDateTime = (dateString: string, timeString: string) => {
    try {
      // Parse the date and time
      const [year, month, day] = dateString.split("-").map(Number);
      const [hour, minute] = timeString.split(":").map(Number);

      // Create date object in Saudi Arabia timezone
      const date = new Date(year, month - 1, day, hour, minute);

      // Format date in Gregorian calendar
      const formattedDate = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Riyadh",
      });

      // Format time in Saudi Arabia timezone
      const formattedTime = date.toLocaleTimeString("ar-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Riyadh",
      });

      return { formattedDate, formattedTime };
    } catch (error) {
      // Fallback to original values if parsing fails
      return { formattedDate: dateString, formattedTime: timeString };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مجدول":
        return "bg-blue-500";
      case "مكتمل":
        return "bg-green-500";
      case "ملغي":
        return "bg-red-500";
      case "مؤجل":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "border-red-500 text-red-700";
      case "متوسطة":
        return "border-yellow-500 text-yellow-700";
      case "منخفضة":
        return "border-green-500 text-green-700";
      default:
        return "border-gray-500 text-gray-700";
    }
  };

  return {
    announceToScreenReader,
    showSuccessAnimation,
    formatSaudiDateTime,
    getStatusColor,
    getPriorityColor,
  };
}
