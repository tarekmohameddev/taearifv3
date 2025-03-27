"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  ExternalLink,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Clock,
  Filter,
  CreditCardIcon,
  Check,
  Star,
  Download,
  PaintBucket,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EnhancedSidebar } from "@/components/enhanced-sidebar";
import { HelpCenter } from "@/components/help-center";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from '@/lib/axiosInstance';
import { Skeleton } from "@/components/ui/skeleton";






const domainsHelp = {
  title: "إدارة النطاقات",
  description: "تعرف على كيفية ربط وإدارة النطاقات المخصصة لموقعك.",
  links: [
    { title: "كيفية ربط نطاق مخصص", href: "#", type: "article" },
    { title: "فهم إعدادات DNS", href: "#", type: "video" },
    { title: "استكشاف مشكلات النطاق وإصلاحها", href: "#", type: "article" },
  ],
};




export function SettingsPage() {
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [setupProgress, setSetupProgress] = useState(40);
  const [activeTab, setActiveTab] = useState("domains");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [domains, setDomains] = useState([]); // البداية بمصفوفة فارغة لأننا سنجلب البيانات من الـ API
  const [dnsInstructions, setDnsInstructions] = useState([]);
  const [verifyingDomains, setVerifyingDomains] = useState({});
  const [deleteDomainId, setDeleteDomainId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [themes, setThemes] = useState([]);
  const [hasFormatError, setHasFormatError] = useState(false);
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingDomains(true);
        const response = await axiosInstance.get('/settings/domain');
        setDomains(response.data.domains);
        setDnsInstructions(response.data.dnsInstructions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingDomains(false);
      }
    };
    fetchData();
  }, []);
  

useEffect(() => {
  const fetchThemes = async () => {
    try {
      setIsLoadingThemes(true);
      const response = await axiosInstance.get('/settings/theme');
      setThemes(response.data.themes);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('فشل في تحميل السمات');
    } finally {
      setIsLoadingThemes(false);
    }
  };
  
  if (activeTab === 'themes') {
    fetchThemes();
  }
}, [activeTab]);
  
  useEffect(() => {
    console.log("domains",domains)
  }, [domains]);

  
  const handleAddDomain = async () => {
    // التحقق من البادئات الممنوعة أولاً
    if (
      newDomain.startsWith("www.") ||
      newDomain.startsWith("http:") ||
      newDomain.startsWith("https:")
    ) {
      toast.error("لا يجب كتابة www أو http:// في بداية النطاق");
      setErrorMessage("تنسيق النطاق غير صالح - أزل www أو http://");
      setHasFormatError(true);
      return;
    }
  
    if (!newDomain) {
      toast.error("اسم النطاق مطلوب");
      setErrorMessage("اسم النطاق مطلوب");
      return;
    }
  
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      toast.error("تنسيق النطاق غير صالح");
      setErrorMessage("تنسيق النطاق غير صالح");
      setHasFormatError(true);
      return;
    }



  const loadingToast = toast.loading("جاري إضافة النطاق...");
  try {
    const response = await axiosInstance.post('/settings/domain', { custom_name: newDomain });
    const addedDomain = response.data.data;
    addedDomain.status = "pending"
    setDomains([...domains, addedDomain]);
    setNewDomain("");
    setIsAddDomainOpen(false);
    setSetupProgress(Math.min(setupProgress + 20, 100));
    toast.dismiss(loadingToast);
    toast.success("تمت إضافة النطاق بنجاح");
    setErrorMessage(""); // تصفير رسالة الخطأ عند النجاح
  } catch (error) {
    console.error('Error adding domain:', error);
    toast.dismiss(loadingToast);
    
    // التحقق من وجود رسالة خطأ من الـ API واستخدامها
    const errorMessage = error.response?.data?.message || "حدث خطأ أثناء إضافة النطاق";
    toast.error(errorMessage);
    setErrorMessage(errorMessage); // تخزين رسالة الخطأ لعرضها أسفل الزر
  }
};
  
  
  
  
const handleVerifyDomain = async (domainId) => {
  setVerifyingDomains(prev => ({ ...prev, [domainId]: true }));
  const loadingToast = toast.loading("جاري التحقق من النطاق...");
  try {
    const response = await axiosInstance.post('/settings/domain/verify', { id: domainId });
    const verifiedDomain = response.data.data;
    setDomains(domains.map((domain) => domain.id === domainId ? verifiedDomain : domain));
    setSetupProgress(Math.min(setupProgress + 20, 100));
    toast.dismiss(loadingToast);
    toast.success("تم التحقق من النطاق بنجاح");
  } catch (error) {
    console.error('Error verifying domain:', error);
    toast.dismiss(loadingToast);
    toast.error("حدث خطأ أثناء التحقق من النطاق");
  } finally {
    setVerifyingDomains(prev => ({ ...prev, [domainId]: false }));
  }
};

  // تعيين نطاق رئيسي باستخدام PATCH API
  const handleSetPrimaryDomain = async (domainId) => {
    const loadingToast = toast.loading("جاري تحديث النطاق الرئيسي...");
    try {
      await axiosInstance.post('/settings/domain/set-primary', { id: domainId });
      setDomains(domains.map((domain) => ({
        ...domain,
        primary: domain.id === domainId,
      })));
      toast.dismiss(loadingToast);
      toast.success("تم تحديث النطاق الرئيسي بنجاح");
    } catch (error) {
      console.error('Error setting primary domain:', error);
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ أثناء تحديث النطاق الرئيسي");
    }
  };

  
  

  const handleDeleteDomain = async () => {
    if (!deleteDomainId) return;
  
    const loadingToast = toast.loading("جاري حذف النطاق...");
    try {
      await axiosInstance.delete(`/settings/domain/${deleteDomainId}`);
      setDomains(domains.filter((domain) => domain.id !== deleteDomainId));
      toast.dismiss(loadingToast);
      toast.success("تم حذف النطاق بنجاح");
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ أثناء حذف النطاق");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDomainId(null);
    }
  };

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: "free",
      name: "الخطة المجانية",
      price: "0",
      current: true,
      features: [
        "موقع واحد",
        "نطاق فرعي",
        "دعم البريد الإلكتروني",
        "تحليلات أساسية",
      ],
      limitations: ["بدون نطاق مخصص", "شعار منصتنا", "بدون دعم أولوي"],
    },
    {
      id: "pro",
      name: "الخطة الاحترافية",
      price: "19.99",
      current: false,
      popular: true,
      features: [
        "3 مواقع",
        "نطاق مخصص",
        "بدون شعار منصتنا",
        "دعم أولوي",
        "تحليلات متقدمة",
        "تكامل وسائل التواصل الاجتماعي",
      ],
    },
    {
      id: "business",
      name: "خطة الأعمال",
      price: "49.99",
      current: false,
      features: [
        "10 مواقع",
        "نطاقات مخصصة غير محدودة",
        "دعم على مدار الساعة",
        "تحليلات متقدمة",
        "تكامل API",
        "تخصيص كامل",
      ],
    },
  ]);

  const handleActivateTheme = async (themeId) => {
    try {
      await axiosInstance.post('/settings/theme/set-active', {
        theme_id: themeId
      });
      
      setThemes(themes.map((theme) => ({
        ...theme,
        active: theme.id === themeId
      })));
      
      toast.success("تم تنشيط السمة بنجاح");
    } catch (error) {
      console.error('Error activating theme:', error);
      toast.error("حدث خطأ أثناء تنشيط السمة");
    }
  };

  const handleSubscriptionChange = (planId) => {
    setSubscriptionPlans(subscriptionPlans.map((plan) => ({
      ...plan,
      current: plan.id === planId,
    })));
    toast.success("تم تغيير الاشتراك بنجاح");
  };


  const filteredDomains = domains.filter((domain) => {
    if (statusFilter !== "all") {
      if (statusFilter === "active" && domain.status !== "active") return false;
      if (statusFilter === "pending" && domain.status !== "pending") return false;
    }
    if (searchQuery && !domain.custom_name.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader>
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>معاينة موقعك</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>فتح موقعك في علامة تبويب جديدة</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <HelpCenter
            contextualHelp={activeTab === "domains" ? domainsHelp : undefined}
          />
        </div>
      </DashboardHeader>
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="settings" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">الإعدادات</h1>
                <p className="text-muted-foreground">
                  إدارة إعدادات حسابك وتفضيلات موقعك
                </p>
              </div>
            </div>

            <Tabs
              defaultValue="domains"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger
                  value="domains"
                  className="flex gap-1 items-center"
                >
                  <Globe className="h-4 w-4" />
                  <span>النطاقات</span>
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="flex gap-1 items-center"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  <span>الاشتراك</span>
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex gap-1 items-center">
                  <Palette className="h-4 w-4" />
                  <span>السمات</span>
                </TabsTrigger>
              </TabsList>

              {/* Domains Tab */}
              <TabsContent value="domains" className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">إدارة النطاقات</h2>
                    <p className="text-muted-foreground">
                      ربط وإدارة النطاقات المخصصة لموقعك
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Input
                        placeholder="بحث في النطاقات..."
                        className="w-[200px] pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <SearchIcon className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="تصفية حسب الحالة" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع النطاقات</SelectItem>
                        <SelectItem value="active">النطاقات النشطة</SelectItem>
                        <SelectItem value="pending">
                          النطاقات المعلقة
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={isAddDomainOpen}
                      onOpenChange={setIsAddDomainOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 ml-1" />
                          إضافة نطاق
                        </Button>
                      </DialogTrigger>
{/* {errorMessage && (
  <p style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</p>
)} */}
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>إضافة نطاق مخصص</DialogTitle>
                          <DialogDescription>
                            ربط نطاقك الخاص بموقعك. ستحتاج إلى تحديث إعدادات DNS
                            الخاصة بك.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="domain-name">اسم النطاق</Label>
                            <Input
  id="domain-name"
  placeholder="example.com"
  value={newDomain}
  onChange={(e) => {
    const value = e.target.value;
    setNewDomain(value);
    
    // إعادة تعيين حالة الخطأ عند التغيير
    setHasFormatError(false);
    setErrorMessage("");
    
    // التحقق الفوري عند الكتابة
    if (
      value.startsWith("www.") ||
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      setHasFormatError(true);
      setErrorMessage("لا تستخدم www أو http://");
    }
  }}
/>

<p className={`text-sm ${hasFormatError ? 'text-destructive' : 'text-muted-foreground'}`}>
                              أدخل نطاقك بدون www أو http://
                            </p>
                          </div>  
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddDomainOpen(false)}
                          >
                            إلغاء
                          </Button>
                          <Button onClick={handleAddDomain}>إضافة نطاق</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {isLoadingDomains ? (
  <div className="grid gap-4 md:grid-cols-2">
    {[1, 2, 3 , 4].map((i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-start justify-between p-6">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-2 flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-20" />
        </CardFooter>
      </Card>
    ))}
  </div>
) : filteredDomains.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      لا توجد نطاقات مطابقة
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      لم يتم العثور على نطاقات تطابق معايير التصفية الحالية
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatusFilter("all");
                        setSearchQuery("");
                      }}
                    >
                      عرض جميع النطاقات
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredDomains.map((domain) => (
                      <Card
                        key={domain.id}
                        className={`${domain.status === "pending" ? "border-dashed opacity-80" : ""}`}
                      >
                        <CardHeader className="flex flex-row items-start justify-between p-6">
                          <div className="flex flex-col gap-1">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                              {domain.custom_name}
                              {domain.primary && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 ml-2"
                                >
                                  رئيسي
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {domain.status === "active"
                                ? "نطاق نشط"
                                : "في انتظار التحقق"}
                            </CardDescription>
                          </div>
                          <div>
                            {domain.status === "active" ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  نشط
                                </span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200"
                              >
                                <span className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  معلق
                                </span>
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-2">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">SSL:</span>
                              {domain.ssl ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  <span className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    مفعل
                                  </span>
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 border-gray-200"
                                >
                                  غير مفعل
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>تمت الإضافة: {domain.addedDate}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-2 flex justify-between">
                          {domain.status === "pending" ? (
                            <Button
  variant="default"
  size="sm"
  onClick={() => handleVerifyDomain(domain.id)}
  disabled={verifyingDomains[domain.id]}
>
{verifyingDomains[domain.id] ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 ml-1 animate-spin" />
                                  جاري التحقق...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                                  التحقق من النطاق
                                </>
                              )}
                            </Button>
                          ) : !domain.primary ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetPrimaryDomain(domain.id)}
                            >
                              تعيين كنطاق رئيسي
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              النطاق الرئيسي
                            </Button>
                          )}
<Button
  variant="ghost"
  size="sm"
  className="text-destructive hover:text-destructive"
  onClick={() => {
    setDeleteDomainId(domain.id);
    setIsDeleteDialogOpen(true);
  }}
  disabled={domain.primary}
>
  <Trash2 className="h-3.5 w-3.5 ml-1" />
  حذف
</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      إعدادات DNS
                    </CardTitle>
                    <CardDescription>
                      تكوين إعدادات DNS الخاصة بنطاقك لتوجيهها إلى موقعك
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                  <Accordion 
  type="single" 
  defaultValue="item-1" // يتم فتحه تلقائيًا عند التحميل
  collapsible // يسمح بالإغلاق عند النقر على العنوان
  className="w-full"
>
<AccordionItem value="item-1">
    <AccordionTrigger>
      كيفية إعداد سجلات DNS الخاصة بك
    </AccordionTrigger>
    <AccordionContent>
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      {dnsInstructions.description || "لربط نطاقك، ستحتاج إلى تحديث سجلات DNS الخاصة بك لدى مسجل النطاق."}
    </p>
    <div className="rounded-lg border overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
        <div className="col-span-2">النوع</div>
        <div className="col-span-3">الاسم</div>
        <div className="col-span-5">القيمة</div>
        <div className="col-span-2">TTL</div>
      </div>
      {dnsInstructions.records?.map((record, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 p-3 border-t">
          <div className="col-span-2 font-medium">{record.type}</div>
          <div className="col-span-3">{record.name}</div>
          <div className="col-span-5 font-mono text-sm">{record.value}</div>
          <div className="col-span-2">{record.ttl}</div>
        </div>
      ))}
    </div>
    <div className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-800">
      <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
      <p className="text-sm">
        {dnsInstructions.note || `                                قد تستغرق تغييرات DNS ما يصل إلى 48 ساعة
                                للانتشار عالميًا. هذا يعني أن نطاقك قد لا يعمل
                                مباشرة بعد إجراء هذه التغييرات.`}
      </p>
    </div>
  </div>
</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">إدارة الاشتراك</h2>
                    <p className="text-muted-foreground">
                      عرض وتحديث خطة الاشتراك الخاصة بك
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {subscriptionPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`relative ${plan.current ? "border-primary border-2" : ""} ${plan.popular ? "shadow-md" : ""}`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                          <Badge className="bg-amber-500 text-white border-0">
                            الأكثر شيوعًا
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription className="flex items-end gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">
                            ${plan.price}
                          </span>
                          <span className="text-muted-foreground">
                            / شهريًا
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                          {plan.limitations &&
                            plan.limitations.map((limitation, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-muted-foreground"
                              >
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">{limitation}</span>
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {plan.current ? (
                          <Button variant="outline" className="w-full" disabled>
                            <Check className="h-4 w-4 ml-1" />
                            الخطة الحالية
                          </Button>
                        ) : (
                          <Button
                            variant={plan.popular ? "default" : "outline"}
                            className="w-full"
                            onClick={() => handleSubscriptionChange(plan.id)}
                          >
                            الترقية
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      تفاصيل الفوترة
                    </CardTitle>
                    <CardDescription>
                      إدارة طرق الدفع وسجل الفواتير الخاص بك
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCardIcon className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">
                              تنتهي في 12/2025
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">الافتراضية</Badge>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-3">
                          الفواتير الأخيرة
                        </h3>
                        <div className="rounded-lg border overflow-hidden">
                          <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                            <div className="col-span-4">التاريخ</div>
                            <div className="col-span-4">المبلغ</div>
                            <div className="col-span-4">الحالة</div>
                          </div>
                          <div className="grid grid-cols-12 gap-4 p-3 border-t">
                            <div className="col-span-4">15 أكتوبر 2023</div>
                            <div className="col-span-4">$19.99</div>
                            <div className="col-span-4">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                مدفوعة
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-12 gap-4 p-3 border-t">
                            <div className="col-span-4">15 سبتمبر 2023</div>
                            <div className="col-span-4">$19.99</div>
                            <div className="col-span-4">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                مدفوعة
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة طريقة دفع
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 ml-1" />
                      تنزيل الفواتير
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Themes Tab */}
              <TabsContent value="themes" className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">سمات الموقع</h2>
                    <p className="text-muted-foreground">
                      اختر وتخصيص سمة موقعك
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="تصفية حسب الفئة" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع السمات</SelectItem>
                        <SelectItem value="business">أعمال</SelectItem>
                        <SelectItem value="portfolio">معرض أعمال</SelectItem>
                        <SelectItem value="restaurant">مطاعم</SelectItem>
                        <SelectItem value="ecommerce">
                          متاجر إلكترونية
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <PaintBucket className="h-4 w-4 ml-1" />
                      تخصيص السمة الحالية
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {isLoadingThemes ? (
    [1, 2, 3, 4].map((i) => (
      <Card key={i} className="overflow-hidden">
        <Skeleton className="aspect-video w-full rounded-none" />
        <CardHeader className="pb-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <Skeleton className="h-6 w-24" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    ))
  ) : (
    themes.map((theme) => (
      <Card
        key={theme.id}
        className={`overflow-hidden ${theme.active ? "border-primary border-2" : ""}`}
      >
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={theme.thumbnail || "/placeholder.svg"}
                          alt={theme.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {theme.name}
                          </CardTitle>
                          {theme.popular && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800"
                            >
                              <Star className="h-3 w-3 ml-1" />
                              شائع
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {theme.category === "business" && "أعمال"}
                          {theme.category === "portfolio" && "معرض أعمال"}
                          {theme.category === "restaurant" && "مطاعم"}
                          {theme.category === "ecommerce" && "متاجر إلكترونية"}
                        </Badge>
                      </CardContent>
                      <CardFooter>
      {theme.active ? (
        <Button variant="outline" className="w-full" disabled>
          <Check className="h-4 w-4 ml-1" />
          السمة النشطة
        </Button>
      ) : (
        <Button
          variant="default"
          className="w-full"
          onClick={() => handleActivateTheme(theme.id)}
        >
          <Sparkles className="h-4 w-4 ml-1" />
          تنشيط السمة
        </Button>
      )}
    </CardFooter>
                    </Card>
                  )))}


                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
<DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا النطاق؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleDeleteDomain}>
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
</Dialog>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}