"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  Eye,
  Edit,
  Phone,
  MessageSquare,
  Search,
  MapPin,
  Home,
  Calendar,
  Clock,
  User,
  Building,
  DollarSign,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface Customer {
  id: number;
  name: string;
}

interface Inquiry {
  id: number;
  message: string;
  inquiry_type: string;
  property_type: string | null;
  budget: string | null;
  location: string;
  customer: Customer;
  created_at?: string;
  status?: string;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface Filters {
  inquiry_type: "all" | string;
  property_type: "all" | string;
  min_budget: number;
  max_budget: number;
  location: string;
  customer_id: string;
  per_page: number;
  current_page: number;
}

interface InquiryListProps {
  onViewInquiry: (inquiry: Inquiry) => void;
  onEditInquiry: (inquiry: Inquiry) => void;
  onAddInquiry: () => void;
  onContactCustomer: (inquiry: Inquiry) => void;
}

export default function InquiryList({
  onViewInquiry,
  onEditInquiry,
  onAddInquiry,
  onContactCustomer,
}: InquiryListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    inquiry_type: "all",
    property_type: "all",
    min_budget: 0,
    max_budget: 10000000,
    location: "",
    customer_id: "",
    per_page: 10,
    current_page: 1,
  });

  // Temporary filters for form inputs
  const [tempFilters, setTempFilters] = useState<Filters>({
    inquiry_type: "all",
    property_type: "all",
    min_budget: 0,
    max_budget: 10000000,
    location: "",
    customer_id: "",
    per_page: 10,
    current_page: 1,
  });

  // Available options for filters
  const inquiryTypes = [
    "حجز زيارة",
    "طلب عقار غير متوفر",
    "بحث عن عقار",
    "عقار",
  ];

  const propertyTypes = [
    "شقة",
    "فيلا",
    "مكتب",
    "محل",
    "أرض",
    "مزرعة",
  ];

  const perPageOptions = [5, 10, 20, 50];

  // Fetch inquiries data on initial load
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Fetch inquiries when page changes
  useEffect(() => {
    if (!loading) {
      fetchInquiries();
    }
  }, [filters.current_page, filters.per_page]);

  // Update tempFilters when filters change (e.g., page change)
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const fetchInquiries = async () => {
    if (loading) {
      setLoading(true);
    } else {
      // Add a small delay to show loading state for better UX
      setTimeout(() => setListLoading(true), 100);
    }
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.inquiry_type && filters.inquiry_type !== "all") params.append("inquiry_type", filters.inquiry_type);
      if (filters.property_type && filters.property_type !== "all") params.append("property_type", filters.property_type);
      if (filters.min_budget > 0) params.append("min_budget", filters.min_budget.toString());
      if (filters.max_budget < 10000000) params.append("max_budget", filters.max_budget.toString());
      if (filters.location) params.append("location", filters.location);
      if (filters.customer_id) params.append("customer_id", filters.customer_id);
      if (filters.per_page) params.append("per_page", filters.per_page.toString());
      if (filters.current_page) params.append("page", filters.current_page.toString());

      const response = await axiosInstance.get(`/v1/inquiry?${params.toString()}`);
      const data = response.data;

      if (data.status === "success") {
        setInquiries(data.data.inquiries || []);
        setPagination(data.data.pagination || null);
      } else {
        toast.error("فشل في تحميل طلبات العملاء");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("فشل في تحميل طلبات العملاء");
    } finally {
      setLoading(false);
      // Add a small delay before hiding loading for smoother transition
      setTimeout(() => setListLoading(false), 200);
    }
  };

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case "حجز زيارة":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "طلب عقار غير متوفر":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "بحث عن عقار":
        return "bg-green-100 text-green-800 border-green-200";
      case "عقار":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPropertyTypeIcon = (type: string | null) => {
    switch (type) {
      case "شقة":
        return <Home className="h-4 w-4" />;
      case "فيلا":
        return <Building className="h-4 w-4" />;
      case "مكتب":
        return <Building className="h-4 w-4" />;
      case "محل":
        return <Building className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const formatBudget = (budget: string | null) => {
    if (!budget) return "غير محدد";
    const num = parseFloat(budget);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} مليون ريال`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)} ألف ريال`;
    }
    return `${num.toLocaleString()} ريال`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "غير محدد";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} مليون ريال`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)} ألف ريال`;
    }
    return `${amount.toLocaleString()} ريال`;
  };

  // Filter inquiries locally for search
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (!searchQuery) return true;
    
    return (
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.inquiry_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (tempFilters.inquiry_type && tempFilters.inquiry_type !== "all") count++;
    if (tempFilters.property_type && tempFilters.property_type !== "all") count++;
    if (tempFilters.min_budget > 0) count++;
    if (tempFilters.max_budget < 10000000) count++;
    if (tempFilters.location) count++;
    if (tempFilters.customer_id) count++;
    // Don't count current_page as an active filter
    setActiveFilters(count);
  }, [tempFilters]);

  const applyFilters = () => {
    setFilters({
      ...tempFilters,
      current_page: 1, // Reset to first page when applying filters
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      inquiry_type: "all",
      property_type: "all",
      min_budget: 0,
      max_budget: 10000000,
      location: "",
      customer_id: "",
      per_page: 10,
      current_page: 1,
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, current_page: page }));
  };

  if (loading) {
    return <InquiryListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">طلبات العملاء</h3>
          <p className="text-sm text-muted-foreground">
            عرض وإدارة جميع طلبات العملاء
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 ml-2" />
            الفلاتر
            {activeFilters > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {activeFilters}
              </Badge>
            )}
          </Button>
          <Button onClick={onAddInquiry}>
            <Plus className="ml-2 h-4 w-4" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="border-2 border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {/* Inquiry Type */}
               <div className="space-y-2">
                 <Label className="text-sm font-medium">نوع الطلب</Label>
                 <Select
                   value={tempFilters.inquiry_type}
                   onValueChange={(value) => setTempFilters(prev => ({ ...prev, inquiry_type: value }))}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="اختر نوع الطلب" />
                   </SelectTrigger>
                                      <SelectContent>
                     <SelectItem value="all">جميع الأنواع</SelectItem>
                     {inquiryTypes.map((type) => (
                       <SelectItem key={type} value={type}>
                         {type}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Property Type */}
               <div className="space-y-2">
                 <Label className="text-sm font-medium">نوع العقار</Label>
                 <Select
                   value={tempFilters.property_type}
                   onValueChange={(value) => setTempFilters(prev => ({ ...prev, property_type: value }))}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="اختر نوع العقار" />
                   </SelectTrigger>
                                      <SelectContent>
                     <SelectItem value="all">جميع الأنواع</SelectItem>
                     {propertyTypes.map((type) => (
                       <SelectItem key={type} value={type}>
                         {type}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Location */}
               <div className="space-y-2">
                 <Label className="text-sm font-medium">الموقع</Label>
                 <Input
                   placeholder="أدخل الموقع..."
                   value={tempFilters.location}
                   onChange={(e) => setTempFilters(prev => ({ ...prev, location: e.target.value }))}
                 />
               </div>

               {/* Customer ID */}
               <div className="space-y-2">
                 <Label className="text-sm font-medium">رقم العميل</Label>
                 <Input
                   placeholder="أدخل رقم العميل..."
                   value={tempFilters.customer_id}
                   onChange={(e) => setTempFilters(prev => ({ ...prev, customer_id: e.target.value }))}
                 />
               </div>

                              {/* Budget Range */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium">
                    نطاق الميزانية: {formatCurrency(tempFilters.min_budget)} - {formatCurrency(tempFilters.max_budget)}
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={[tempFilters.min_budget, tempFilters.max_budget]}
                      onValueChange={([min, max]) => 
                        setTempFilters(prev => ({ ...prev, min_budget: min, max_budget: max }))
                      }
                      max={10000000}
                      min={0}
                      step={100000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground" dir="rtl">
                      <span>10 مليون ريال</span>
                      <span>0 ريال</span>
                    </div>
                  </div>
                </div>

               {/* Per Page */}
               <div className="space-y-2">
                 <Label className="text-sm font-medium">عدد النتائج في الصفحة</Label>
                 <Select
                   value={tempFilters.per_page.toString()}
                   onValueChange={(value) => setTempFilters(prev => ({ ...prev, per_page: parseInt(value) }))}
                 >
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {perPageOptions.map((option) => (
                       <SelectItem key={option} value={option.toString()}>
                         {option} نتيجة
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>

                         {/* Filter Actions */}
             <div className="flex justify-between items-center mt-6 pt-4 border-t">
               <div className="text-sm text-muted-foreground">
                 {activeFilters} فلتر نشط
               </div>
               <div className="flex gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={clearFilters}
                   disabled={activeFilters === 0}
                 >
                   <X className="h-4 w-4 ml-2" />
                   مسح الفلاتر
                 </Button>
                 <Button
                   variant="default"
                   size="sm"
                   onClick={applyFilters}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   <Filter className="h-4 w-4 ml-2" />
                   تطبيق الفلاتر
                 </Button>
               </div>
             </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="البحث في الطلبات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Results Summary */}
      {pagination && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            عرض {pagination.from} إلى {pagination.to} من {pagination.total} نتيجة
          </span>
          <span>
            الصفحة {pagination.current_page} من {pagination.last_page}
          </span>
        </div>
      )}

                    {/* Inquiries List */}
       <div className="space-y-4">
         {listLoading ? (
           <InquiryListSkeleton />
         ) : (
           <>
             {filteredInquiries.map((inquiry) => (
               <Card
                 key={inquiry.id}
                 className="hover:shadow-md transition-shadow"
               >
                 <CardContent className="p-4">
                   <div className="flex items-start justify-between">
                     <div className="flex items-start gap-4 flex-1">
                       <Avatar className="h-10 w-10">
                         <AvatarImage src="/placeholder.svg" />
                         <AvatarFallback>
                           {inquiry.customer.name
                             ?.split(" ")
                             ?.slice(0, 2)
                             ?.map((n) => n[0])
                             ?.join("") || "عميل"}
                         </AvatarFallback>
                       </Avatar>
                       
                       <div className="flex-1 space-y-2">
                         <div className="flex items-start justify-between">
                           <div>
                             <h3 className="font-semibold text-sm line-clamp-2">
                               {inquiry.message}
                             </h3>
                             <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                               <span className="flex items-center gap-1">
                                 <User className="h-3 w-3" />
                                 {inquiry.customer.name}
                               </span>
                               <span className="flex items-center gap-1">
                                 <MapPin className="h-3 w-3" />
                                 {inquiry.location}
                               </span>
                               {inquiry.created_at && (
                                 <span className="flex items-center gap-1">
                                   <Calendar className="h-3 w-3" />
                                   {formatDate(inquiry.created_at)}
                                 </span>
                               )}
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center gap-2 flex-wrap">
                           <Badge
                             variant="outline"
                             className={`text-xs ${getInquiryTypeColor(inquiry.inquiry_type)}`}
                           >
                             {inquiry.inquiry_type}
                           </Badge>
                           
                           {inquiry.property_type && (
                             <Badge variant="outline" className="text-xs flex items-center gap-1">
                               {getPropertyTypeIcon(inquiry.property_type)}
                               {inquiry.property_type}
                             </Badge>
                           )}
                           
                           {inquiry.budget && (
                             <Badge variant="outline" className="text-xs flex items-center gap-1">
                               <DollarSign className="h-3 w-3" />
                               {formatBudget(inquiry.budget)}
                             </Badge>
                           )}
                         </div>
                       </div>
                     </div>

                     <div className="flex items-center gap-1">
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => onViewInquiry(inquiry)}
                       >
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => onEditInquiry(inquiry)}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => onContactCustomer(inquiry)}
                       >
                         <Phone className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon">
                         <MessageSquare className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}

             {filteredInquiries.length === 0 && !loading && (
               <div className="text-center py-12 text-muted-foreground">
                 <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                 <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                 <p className="text-sm">
                   {searchQuery || activeFilters > 0
                     ? "لم يتم العثور على طلبات تطابق معايير البحث"
                     : "لم يتم العثور على أي طلبات حالياً"}
                 </p>
                 <Button onClick={onAddInquiry} className="mt-4">
                   <Plus className="ml-2 h-4 w-4" />
                   إضافة طلب جديد
                 </Button>
               </div>
             )}
           </>
         )}
       </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={page === pagination.current_page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function InquiryListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 