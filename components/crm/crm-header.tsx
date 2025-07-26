"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, TableIcon } from "lucide-react";
import Link from "next/link";

interface CrmHeaderProps {
  onRefresh: () => void;
  onSettings: () => void;
}

export default function CrmHeader({ onRefresh, onSettings }: CrmHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          نظام إدارة علاقات العملاء (CRM)
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          إدارة شاملة لرحلة العميل من العميل المحتمل إلى إتمام الصفقة
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Link href="/customers">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <TableIcon className="ml-2 h-4 w-4" />
            <span className="hidden sm:inline">عرض جدول العملاء</span>
            <span className="sm:hidden">الجدول</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={onRefresh}
          className="w-full sm:w-auto bg-transparent"
        >
          <RefreshCw className="ml-2 h-4 w-4" />
          <span className="hidden sm:inline">تحديث البيانات</span>
          <span className="sm:hidden">تحديث</span>
        </Button>
        <Button
          variant="outline"
          onClick={onSettings}
          className="w-full sm:w-auto"
        >
          <Settings className="ml-2 h-4 w-4" />
          <span className="hidden sm:inline">إعدادات CRM</span>
          <span className="sm:hidden">الإعدادات</span>
        </Button>
      </div>
    </div>
  );
}
