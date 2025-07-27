"use client";

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerPageHeader } from "./page-components/CustomerPageHeader";
import { StatisticsCards } from "./page-components/StatisticsCards";
import { CustomerTypeDistribution } from "./page-components/CustomerTypeDistribution";
import { FiltersAndSearch } from "./page-components/FiltersAndSearch";
import { CustomerTable } from "./page-components/CustomerTable";
import { CrmLinkCard } from "./page-components/CrmLinkCard";
import { CustomerDetailDialog } from "./page-components/CustomerDetailDialog";

// Zod validation schema
const customerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  phone_number: z.string().min(1, "رقم الهاتف مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  city_id: z.number().nullable(),
  district_id: z.union([z.number(), z.string()]).nullable(),
  note: z.string().optional(),
  customer_type: z.string(),
  priority: z.number(),
  stage_id: z.number(),
});

// Error message translation mapping
const errorTranslations: Record<string, string> = {
  "The phone number has already been taken.": "رقم الهاتف مُستخدم بالفعل، يرجى استخدام رقم آخر",
  "The email has already been taken.": "البريد الإلكتروني مُستخدم بالفعل، يرجى استخدام بريد آخر",
  "The name field is required.": "حقل الاسم مطلوب",
  "The phone number field is required.": "حقل رقم الهاتف مطلوب",
  "The password field is required.": "حقل كلمة المرور مطلوب",
  "The email must be a valid email address.": "يجب أن يكون البريد الإلكتروني صحيحاً",
  "The phone number format is invalid.": "تنسيق رقم الهاتف غير صحيح",
  "The password must be at least 6 characters.": "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل",
};

// Function to translate error messages
const translateErrorMessage = (message: string): string => {
  return errorTranslations[message] || message;
};

interface Customer {
  id: number;
  name: string;
  nameEn: string;
  email: string;
  phone_number: string;
  whatsapp: string;
  status: string;
  customer_type: string;
  nationality: string;
  residencyStatus: string;
  city: string | { id: number; name_ar: string };
  district: string | { id: number; name_ar: string; city_name_ar: string };
  budget: { min: number; max: number };
  propertyPreferences: string[];
  familySize: number;
  leadSource: string;
  assignedAgent: string;
  joinDate: string;
  lastContact: string;
  lastActivity: string;
  totalTransactions: number;
  totalValue: number;
  notes: string;
  avatar: string;
  satisfaction: number;
  communicationPreference: string;
  urgency: string;
  pipelineStage: string;
  dealValue: number;
  probability: number;
  expectedCloseDate: string;
  note: string;
  priority: number;
  city_id: number | null;
  district_id?: number | string | null;
  stage_id: number;
}
// Customer data (same as CRM page for consistency)
const customers: Customer[] = [
  {
    id: 1,
    name: "أحمد محمد العلي",
    nameEn: "Ahmed Mohammed Al-Ali",
    email: "ahmed.alali@email.com",
    phone_number: "+966 50 123 4567",
    whatsapp: "+966 50 123 4567",
    status: "نشط",
    customer_type: "مشتري",
    nationality: "سعودي",
    residencyStatus: "مواطن",
    city: "الرياض",
    district: "العليا",
    budget: { min: 800000, max: 1200000 },
    propertyPreferences: ["فيلا", "شقة"],
    familySize: 5,
    leadSource: "إحالة",
    assignedAgent: "سارة أحمد",
    joinDate: "2023-08-15",
    lastContact: "2023-11-10",
    lastActivity: "2023-11-12",
    totalTransactions: 1,
    totalValue: 950000,
    notes: "عميل مهم، يبحث عن فيلا في حي راقي",
    avatar: "/placeholder.svg?height=40&width=40",
    satisfaction: 4.8,
    communicationPreference: "واتساب",
    urgency: "عالية",
    pipelineStage: "negotiation",
    dealValue: 950000,
    probability: 75,
    expectedCloseDate: "2023-12-15",
    note: "عميل مهم، يبحث عن فيلا في حي راقي",
    priority: 1,
    city_id: 1, // Example city_id
    stage_id: 2,
  },
];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false);
  const [showStageDialog, setShowStageDialog] = useState(false);
  const [selectedCustomerForStage, setSelectedCustomerForStage] = useState<Customer | null>(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customersData, setCustomersData] = useState<Customer[]>([]); // ← هنا يتم حفظ كل العملاء
  const [formData, setFormData] = useState<Partial<Customer> | null>(null); // ← بيانات العميل المحدد
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
    null,
  ); // ← ID العميل الجاري تعديله
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    city_id: null,
    district_id: null,
    note: "",
    customer_type: "مشتري", // Default value
    priority: 1,
    stage_id: 1,
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/customers");
        const { customers, summary } = response.data.data;
        setCustomersData(customers);
        setTotalCustomers(summary.total_customers);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleNewCustomerChange = (field: keyof typeof newCustomer) => (
    value: any,
  ) => {
    setNewCustomer((prev) => ({ ...prev, [field]: value }));
  };
  const handleNewCustomerInputChange = (field: keyof typeof newCustomer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewCustomer((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddCustomer = async () => {
    setIsSubmitting(true);
    try {
      // Client-side validation using Zod
      setClientErrors({});
      setValidationErrors({});
      
      const validationResult = customerSchema.safeParse(newCustomer);
      
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as string] = error.message;
          }
        });
        setClientErrors(errors);
        return;
      }

      const response = await axiosInstance.post("/customers", newCustomer);
      // Add the new customer to the list
      setCustomersData((prev) => [response.data.data, ...prev]);
      
      // Show success toast
      toast.success("تم إضافة العميل بنجاح! 🎉", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "8px",
        },
      });
      
      setShowAddCustomerDialog(false);
      // Reset form - clear all inputs
      setNewCustomer({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        city_id: null,
        district_id: null,
        note: "",
        customer_type: "مشتري",
        priority: 1,
        stage_id: 1,
      });
      // Clear any existing errors
      setClientErrors({});
      setValidationErrors({});
    } catch (error: any) {
      console.error("Error adding customer:", error);
      // You can add error handling here, like showing a toast message
      if (error?.response && error?.response?.status === 422) {
        const serverErrors = error?.response?.data?.errors || {};
        // Translate server error messages to Arabic
        const translatedErrors: Record<string, string[]> = {};
        Object.keys(serverErrors).forEach(field => {
          translatedErrors[field] = serverErrors[field].map((msg: string) => 
            translateErrorMessage(msg)
          );
        });
        setValidationErrors(translatedErrors);
      } else {
        // Handle other types of errors (e.g., show a generic error message)
        console.error("An unexpected error occurred:", error);
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone_number: customer.phone_number || "",
      note: customer.note || "",
      customer_type: customer.customer_type || "",
      priority: customer.priority || 1,
      city_id: typeof customer.city === 'object' ? customer.city.id : null,
      district_id: typeof customer.district === 'object' ? customer.district.id : null,
      stage_id: 2,
    });
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>

              {/* Statistics Cards Skeleton */}
              <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Skeleton className="h-4 w-4 ml-2" />
                      <Skeleton className="h-4 w-20" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
                {/* Repeat for remaining cards */}
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Skeleton className="h-4 w-4 ml-2" />
                        <Skeleton className="h-4 w-20" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-12 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filters and Search Skeleton */}
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Skeleton className="h-10 w-[300px]" />
                </div>
                <div className="flex items-center gap-2 ">
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>

              {/* Table Skeleton */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {/* Table Header */}
                    <div className="flex items-center border-b p-4">
                      <Skeleton className="h-4 w-4 ml-4" />
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-auto" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                    </div>
                    
                    {/* Table Rows */}
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex items-center border-b p-4">
                        {/* Checkbox */}
                        <Skeleton className="h-4 w-4 ml-4" />
                        
                        {/* Customer Info */}
                        <div className="flex items-center space-x-3 ml-8">
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="space-y-1 ml-auto">
                          <div className="flex items-center">
                            <Skeleton className="h-3 w-3 ml-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center">
                            <Skeleton className="h-3 w-3 ml-2" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        
                        {/* Type Badge */}
                        <div className="ml-8">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        
                        {/* Location */}
                        <div className="ml-8">
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        
                        {/* Last Contact */}
                        <div className="flex items-center ml-8">
                          <Skeleton className="h-3 w-3 ml-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-8">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CRM Link Card Skeleton */}
              <div className="text-center py-6">
                <Card className="max-w-md mx-auto">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="text-center">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <Skeleton className="h-10 w-48" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  const handleUpdateCustomer = async () => {
    try {
      await axiosInstance.put(`/customers/${editingCustomerId}`, formData);

      // تحديث الـ customer داخل القائمة
      setCustomersData((prev) =>
        prev.map((cust) =>
          cust.id === editingCustomerId ? { ...cust, ...formData } : cust,
        ),
      );

      setOpen(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleChange = (field: keyof Customer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStageUpdated = (customerId: number, newStageId: number) => {
    // تحديث المرحلة في قائمة العملاء
    setCustomersData((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, stage_id: newStageId }
          : customer
      )
    );
  };

  // Filter and sort customers
  const filteredAndSortedCustomers = customersData
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.nameEn &&
          customer.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number.includes(searchTerm) ||
        (typeof customer.city === "string" &&
          customer.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof customer.district === "string"
          ? customer.district?.toLowerCase().includes(searchTerm.toLowerCase())
          : (customer.district as { name_ar: string })?.name_ar
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "all" || customer.status === filterStatus;
      const matchesType =
        filterType === "all" || customer.customer_type === filterType;
      const matchesCity = filterCity === "all" || customer.city === filterCity;

      return matchesSearch && matchesStatus && matchesType && matchesCity;
    })
    .sort((a, b) => {
      let aValue = a[sortField as keyof Customer];
      let bValue = b[sortField as keyof Customer];

      // Handle cases where values might not be strings
      const aStr = String(aValue ?? "").toLowerCase();
      const bStr = String(bValue ?? "").toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredAndSortedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredAndSortedCustomers.map((c) => c.id));
    }
  };

  // Calculate basic statistics
  const activeCustomers = customersData.filter(
    (c) => c.status === "نشط",
  ).length;
  const totalRevenue = customersData.reduce(
    (sum, c) => sum + (c.totalValue || 0),
    0,
  );
  const avgCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  // Customer type statistics
  const buyerCount = customersData.filter(
    (c) => c.customer_type === "مشتري",
  ).length;
  const sellerCount = customersData.filter(
    (c) => c.customer_type === "بائع",
  ).length;
  const renterCount = customersData.filter(
    (c) => c.customer_type === "مستأجر",
  ).length;
  const landlordCount = customersData.filter(
    (c) => c.customer_type === "مؤجر",
  ).length;
  const investorCount = customersData.filter(
    (c) => c.customer_type === "مستثمر",
  ).length;

  const handleDelete = async (customerId: number) => {
    try {
      await axiosInstance.delete(`/customers/${customerId}`);
      // احذف العميل من الواجهة
      setCustomersData((prev) =>
        prev.filter((customer) => customer.id !== customerId),
      );
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <CustomerPageHeader
              showAddCustomerDialog={showAddCustomerDialog}
              setShowAddCustomerDialog={setShowAddCustomerDialog}
              newCustomer={newCustomer}
              handleNewCustomerChange={handleNewCustomerChange}
              handleNewCustomerInputChange={handleNewCustomerInputChange}
              validationErrors={validationErrors}
              clientErrors={clientErrors}
              handleAddCustomer={handleAddCustomer}
              isSubmitting={isSubmitting}
              setValidationErrors={setValidationErrors}
              setClientErrors={setClientErrors}
              setIsSubmitting={setIsSubmitting}
              setNewCustomer={setNewCustomer}
            />

            {/* Statistics Cards */}
            <StatisticsCards totalCustomers={totalCustomers} />

            {/* Customer Type Distribution */}
            {/* <CustomerTypeDistribution
              buyerCount={buyerCount}
              sellerCount={sellerCount}
              renterCount={renterCount}
              landlordCount={landlordCount}
              investorCount={investorCount}
            /> */}

            {/* Filters and Search */}
            <FiltersAndSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterType={filterType}
              setFilterType={setFilterType}
              filterCity={filterCity}
              setFilterCity={setFilterCity}
            />

            {/* Main Content */}
            <CustomerTable
              filteredAndSortedCustomers={filteredAndSortedCustomers}
              selectedCustomers={selectedCustomers}
              handleSelectAll={handleSelectAll}
              handleSelectCustomer={handleSelectCustomer}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              setSelectedCustomer={setSelectedCustomer}
              setShowCustomerDialog={setShowCustomerDialog}
              openEditDialog={openEditDialog}
              handleDelete={handleDelete}
              formData={formData}
              open={open}
              setOpen={setOpen}
              handleChange={handleChange}
              handleUpdateCustomer={handleUpdateCustomer}
              showBulkActionsDialog={showBulkActionsDialog}
              setShowBulkActionsDialog={setShowBulkActionsDialog}
              setSelectedCustomers={setSelectedCustomers}
              showStageDialog={showStageDialog}
              setShowStageDialog={setShowStageDialog}
              selectedCustomerForStage={selectedCustomerForStage}
              setSelectedCustomerForStage={setSelectedCustomerForStage}
              onStageUpdated={handleStageUpdated}
            />

            {/* CRM Link */}
            <CrmLinkCard />

            {/* Customer Detail Dialog */}
            <CustomerDetailDialog
              showCustomerDialog={showCustomerDialog}
              setShowCustomerDialog={setShowCustomerDialog}
              selectedCustomer={selectedCustomer}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
