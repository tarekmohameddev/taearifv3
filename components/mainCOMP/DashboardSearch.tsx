"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Users, Grid, Settings, FileText, Building2, MessageCircle, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SEARCH_DATA: SearchResult[] = [
  { id: "dashboard",      title: "لوحة التحكم",    description: "نظرة عامة على الموقع",          path: "/dashboard",                     icon: Home },
  { id: "properties",     title: "العقارات",        description: "إدارة وعرض العقارات",           path: "/dashboard/properties",          icon: Building2 },
  { id: "customers-hub",  title: "العملاء",         description: "إدارة شاملة لدورة حياة العملاء", path: "/dashboard/customers-hub",       icon: Users },
  { id: "whatsapp",       title: "إدارة الواتساب",  description: "رسائل واتساب",                  path: "/dashboard/whatsapp-management", icon: MessageCircle },
  { id: "call-center",    title: "مركز الاتصال",    description: "إدارة المكالمات",               path: "/dashboard/call-center",         icon: Phone },
  { id: "sms-campaigns",  title: "حملات الرسائل",   description: "إرسال الرسائل النصية",          path: "/dashboard/sms-campaigns",       icon: MessageSquare },
  { id: "apps",           title: "التطبيقات",       description: "إدارة التطبيقات",               path: "/dashboard/apps",                icon: Grid },
  { id: "settings",       title: "الإعدادات",       description: "تكوين إعدادات الحساب",          path: "/dashboard/settings",            icon: Settings },
];

export function DashboardSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = SEARCH_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
    setFilteredResults(results);
  }, [searchQuery]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const handleSelect = (path: string) => {
    setOpen(false);
    setSearchQuery("");
    router.push(path);
  };

  return (
    <div className="relative" style={{ width: 300 }}>
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 16, height: 16, color: "#9CA3AF" }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="البحث هنا..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          style={{
            width: "100%",
            height: 36,
            paddingRight: 36,
            paddingLeft: 16,
            background: "#F4F5F7",
            border: "1px solid #E5E7EB",
            borderRadius: 20,
            fontSize: 13,
            color: "#1A1A1A",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#1A3C34";
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(26,60,52,0.12)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "#E5E7EB";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Dropdown Results */}
      {open && filteredResults.length > 0 && (
        <div
          className="absolute top-full right-0 mt-2 w-full z-50 animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          <div className="p-2">
            {filteredResults.map((result) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F4F5F7] transition-colors text-right"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-lg"
                    style={{ width: 32, height: 32, background: "#E8F5EF" }}
                  >
                    <Icon className="h-4 w-4 text-[#1A3C34]" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-sm font-medium" style={{ color: "#1A1A1A" }}>
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-xs mt-0.5 line-clamp-1" style={{ color: "#9CA3AF" }}>
                        {result.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {open && searchQuery && filteredResults.length === 0 && (
        <div
          className="absolute top-full right-0 mt-2 w-full z-50 p-4 text-center animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          }}
        >
          <p className="text-sm" style={{ color: "#9CA3AF" }}>لا توجد نتائج</p>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setOpen(false);
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}
