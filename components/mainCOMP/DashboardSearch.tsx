"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Users, Grid, Settings, FileText, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  path: string;
  category: "page" | "setting" | "feature";
  icon: React.ComponentType<{ className?: string }>;
}

const SEARCH_DATA: SearchResult[] = [
  {
    id: "dashboard",
    title: "لوحة التحكم",
    description: "نظرة عامة على الموقع",
    path: "/dashboard",
    category: "page",
    icon: FileText,
  },
  {
    id: "properties",
    title: "العقارات",
    description: "إدارة العقارات",
    path: "/dashboard/properties",
    category: "page",
    icon: Home,
  },
  {
    id: "customers-hub",
    title: "العملاء الموحد",
    description: "إدارة شاملة لدورة حياة العملاء",
    path: "/dashboard/customers-hub",
    category: "page",
    icon: Users,
  },
  {
    id: "apps",
    title: "التطبيقات",
    description: "إدارة التطبيقات",
    path: "/dashboard/apps",
    category: "page",
    icon: Grid,
  },
  {
    id: "settings",
    title: "إعدادات الموقع",
    description: "تكوين إعدادات الموقع",
    path: "/dashboard/settings",
    category: "page",
    icon: Settings,
  },
  {
    id: "projects",
    title: "المشاريع",
    description: "إدارة المشاريع",
    path: "/dashboard/projects",
    category: "page",
    icon: Building2,
  },
  {
    id: "customers",
    title: "إدارة العملاء",
    description: "إدارة عملائك",
    path: "/dashboard/customers",
    category: "page",
    icon: Users,
  },
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
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    setSearchQuery("");
    router.push(path);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-colors duration-200" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="البحث هنا..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={cn(
            "w-full pr-10 pl-4 h-10 rounded-full",
            "bg-muted/40 border-border/60",
            "focus-visible:ring-2 focus-visible:ring-success focus-visible:border-success",
            "placeholder:text-muted-foreground",
            "transition-all duration-200 ease-in-out",
            "hover:bg-muted/60 hover:border-border"
          )}
        />
        <kbd className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {open && filteredResults.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-2">
            {filteredResults.map((result) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.path)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg",
                    "hover:bg-muted/80 transition-all duration-150",
                    "text-right cursor-pointer",
                    "hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
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
        <div className="absolute top-full right-0 mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="text-sm text-muted-foreground">لا توجد نتائج</p>
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
