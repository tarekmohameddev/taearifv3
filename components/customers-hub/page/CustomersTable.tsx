"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
} from "lucide-react";
import { getStageNameAr, getStageColor, LIFECYCLE_STAGES } from "@/types/unified-customer";
import Link from "next/link";
import { AssignmentDropdown } from "../assignment";

export function CustomersTable() {
  const {
    filteredCustomers,
    currentPage,
    pageSize,
    totalPages,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    nextPage,
    prevPage,
    filters,
    setFilters,
  } = useUnifiedCustomersStore();

  // Get paginated customers
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: any; text: string }> = {
      urgent: { variant: "destructive", text: "عاجل" },
      high: { variant: "default", text: "عالي" },
      medium: { variant: "secondary", text: "متوسط" },
      low: { variant: "outline", text: "منخفض" },
    };
    const config = variants[priority] || variants.medium;
    return (
      <Badge variant={config.variant as any} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const labels: Record<string, string> = {
      inquiry: "استفسار موقع",
      manual: "إدخال يدوي",
      whatsapp: "واتساب",
      import: "مستورد",
      referral: "إحالة",
    };
    return (
      <Badge variant="outline" className="text-xs">
        {labels[source] || source}
      </Badge>
    );
  };

  return (
    <Card>
      {/* Filters and Search */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث بالاسم، رقم الجوال، البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          <Select
            value={filters.stage?.[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setFilters({ stage: undefined });
              } else {
                setFilters({ stage: [value as any] });
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="جميع المراحل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {LIFECYCLE_STAGES.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority?.[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setFilters({ priority: undefined });
              } else {
                setFilters({ priority: [value as any] });
              }
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="urgent">عاجل</SelectItem>
              <SelectItem value="high">عالي</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="low">منخفض</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          عرض {startIndex + 1} - {Math.min(endIndex, filteredCustomers.length)} من{" "}
          {filteredCustomers.length} عميل
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المرحلة</TableHead>
              <TableHead className="text-right">جودة العميل</TableHead>
              <TableHead className="text-right">الأولوية</TableHead>
              <TableHead className="text-right">المصدر</TableHead>
              <TableHead className="text-right">الموظف المسؤول</TableHead>
              <TableHead className="text-right">آخر تواصل</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: getStageColor(customer.stage),
                        color: getStageColor(customer.stage),
                      }}
                    >
                      {getStageNameAr(customer.stage)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded font-semibold text-sm ${getLeadScoreColor(customer.leadScore)}`}
                      >
                        {customer.leadScore}
                      </div>
                      {customer.leadScore >= 80 && (
                        <span className="text-xs text-gray-500">🔥</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(customer.priority)}</TableCell>
                  <TableCell>{getSourceBadge(customer.source)}</TableCell>
                  <TableCell>
                    <AssignmentDropdown
                      customerId={customer.id}
                      currentEmployeeId={customer.assignedEmployeeId}
                      currentEmployeeName={customer.assignedEmployee?.name}
                    />
                  </TableCell>
                  <TableCell>
                    {customer.lastContactAt ? (
                      <div className="text-sm">
                        <div>
                          {new Date(customer.lastContactAt).toLocaleDateString("ar-SA", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.lastContactType}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            صفحة {currentPage} من {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
