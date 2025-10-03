"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({ type }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  return (
    <Card
      className={`w-full border-dashed transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <CardContent className="flex flex-col items-center justify-center py-10 text-center sm:py-12 md:py-16 rtl">
        {/* Interactive empty state illustration */}
        <div
          className={`mb-6 transition-all duration-1000 empty-state-float ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="relative w-48 h-48 mx-auto">
            {/* Main empty folder/document illustration */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 240"
              fill="none"
              className="w-full h-full"
              aria-hidden="true"
            >
              {/* Light background */}
              <circle cx="120" cy="120" r="90" fill="black" />
              {/* Empty folder */}
              <path
                d="M60 85C60 82.2386 62.2386 80 65 80H95L105 90H175C177.761 90 180 92.2386 180 95V160C180 162.761 177.761 165 175 165H65C62.2386 165 60 162.761 60 160V85Z"
                fill="white"
                stroke="#CBD5E1"
                strokeWidth="2"
              />

              {/* Folder front */}
              <path
                d="M60 100H180V160C180 162.761 177.761 165 175 165H65C62.2386 165 60 162.761 60 160V100Z"
                fill="#F8FAFC"
                stroke="#94A3B8"
                strokeWidth="2"
              />

              {/* Empty document with house icon */}
              <g className="empty-state-float-slow">
                <rect
                  x="90"
                  y="110"
                  width="60"
                  height="75"
                  rx="3"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />

                {/* Document lines */}
                <line
                  x1="100"
                  y1="125"
                  x2="140"
                  y2="125"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                />
                <line
                  x1="100"
                  y1="135"
                  x2="140"
                  y2="135"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                />

                {/* House icon on document */}
                <path d="M120 165L105 150H135L120 165Z" fill="black" />
                <rect x="110" y="150" width="20" height="15" fill="black" />
              </g>

              {/* Plus sign */}
              <g className="empty-state-pulse-slow">
                <circle cx="170" cy="170" r="18" fill="white" />
                <line
                  x1="170"
                  y1="162"
                  x2="170"
                  y2="178"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="162"
                  y1="170"
                  x2="178"
                  y2="170"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Search/not found element */}
              <g className="empty-state-bounce-very-subtle">
                <circle
                  cx="75"
                  cy="75"
                  r="15"
                  fill="white"
                  stroke="#94A3B8"
                  strokeWidth="2"
                />
                <line
                  x1="85"
                  y1="85"
                  x2="95"
                  y2="95"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="71"
                  y1="75"
                  x2="79"
                  y2="75"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Animated text */}
        <div
          className={`space-y-3 max-w-md transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h3 className="text-xl text-center font-semibold tracking-tight">
            لا توجد {type === "مشاريع" ? "مشاريع" : "عقارات"}
          </h3>
          <p className="text-sm text-center text-muted-foreground">
            لم تقم بإضافة أي {type === "مشاريع" ? "مشروع" : "عقار"} إلى لوحة
            التحكم الخاصة بك بعد. أضف {type === "مشاريع" ? "مشروعك" : "عقارك"}{" "}
            الأول للبدء في إدارة محفظتك العقارية.
          </p>
        </div>

        {/* Animated button with pulse effect */}
        <div
          className={`transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="mt-8 gap-2 text-base empty-state-pulse-subtle hover:scale-105 transition-transform duration-300"
            asChild
          >
            <Link
              href={type === "مشاريع" ? "projects/add" : "properties/add"}
            >
              <Plus className="h-5 w-5 empty-state-bounce-subtle" />
              أضف {type === "مشاريع" ? "مشروعك" : "عقارك"} الأول
            </Link>
          </Button>
        </div>

        {/* Scoped CSS for animations */}
        <style jsx global>{`
          /* RTL Support */
          .rtl {
            direction: rtl;
            text-align: right;
          }

          /* Custom animations */
          @keyframes empty-state-float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          @keyframes empty-state-float-slow {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          @keyframes empty-state-pulse-subtle {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.03);
            }
          }

          @keyframes empty-state-pulse-slow {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes empty-state-bounce-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          @keyframes empty-state-bounce-very-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-2px);
            }
          }

          .empty-state-float {
            animation: empty-state-float 6s ease-in-out infinite;
          }

          .empty-state-float-slow {
            animation: empty-state-float-slow 8s ease-in-out infinite;
          }

          .empty-state-pulse-subtle {
            animation: empty-state-pulse-subtle 3s ease-in-out infinite;
          }

          .empty-state-pulse-slow {
            animation: empty-state-pulse-slow 4s ease-in-out infinite;
          }

          .empty-state-bounce-subtle {
            animation: empty-state-bounce-subtle 2s ease-in-out infinite;
          }

          .empty-state-bounce-very-subtle {
            animation: empty-state-bounce-very-subtle 3s ease-in-out infinite;
          }

          /* Respect user's motion preferences */
          @media (prefers-reduced-motion) {
            .empty-state-float,
            .empty-state-float-slow,
            .empty-state-pulse-subtle,
            .empty-state-pulse-slow,
            .empty-state-bounce-subtle,
            .empty-state-bounce-very-subtle {
              animation: none;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
