"use client";
import CustomTitle from "@/components/CustomTitle";
import Head from "next/head";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Separator } from "@/components/ui/separator";
import toast from 'react-hot-toast';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Plus,
  Trash2,
  GripVertical,
  ChevronLeft,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function FooterManagementPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [footerData, setFooterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/content/footer",
        );
        console.log("get response", response);
        if (response.data.status === "success") {
          setFooterData(response.data.data.settings);
        } else {
          throw new Error("فشل في جلب البيانات");
        }
      } catch (err) {
        setError(err.message);
        toast.error("فشل في تحميل بيانات التذييل");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const socialIcons = {
    facebook: <Facebook className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    youtube: <Youtube className="h-5 w-5" />,
  };

  const socialPlatforms = [
    { value: "facebook", label: "فيسبوك" },
    { value: "twitter", label: "تويتر" },
    { value: "instagram", label: "انستغرام" },
    { value: "linkedin", label: "لينكد إن" },
    { value: "youtube", label: "يوتيوب" },
  ];

  const handleGeneralChange = (field, value) => {
    setFooterData({
      ...footerData,
      general: {
        ...footerData?.general,
        [field]: value,
      },
    });
  };

  const handleSocialChange = (id, field, value) => {
    setFooterData({
      ...footerData,
      social: footerData.social.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const addSocialPlatform = () => {
    const newId = (footerData.social.length + 1).toString();
    setFooterData({
      ...footerData,
      social: [
        ...footerData.social,
        {
          id: newId,
          platform: "facebook",
          url: "https://facebook.com/",
          enabled: true,
        },
      ],
    });
  };

  const removeSocialPlatform = (id) => {
    setFooterData({
      ...footerData,
      social: footerData.social.filter((item) => item.id !== id),
    });
  };

  const handleColumnChange = (columnId, field, value) => {
    setFooterData({
      ...footerData,
      columns: footerData.columns.map((column) =>
        column.id === columnId ? { ...column, [field]: value } : column,
      ),
    });
  };

  const handleColumnLinkChange = (columnId, linkId, field, value) => {
    setFooterData({
      ...footerData,
      columns: footerData.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            links: column.links.map((link) =>
              link.id === linkId ? { ...link, [field]: value } : link,
            ),
          };
        }
        return column;
      }),
    });
  };

  const addColumnLink = (columnId) => {
    const column = footerData.columns.find((col) => col.id === columnId);
    if (column) {
      const newLinkId = `${columnId}-${column.links.length + 1}`;
      setFooterData({
        ...footerData,
        columns: footerData.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              links: [
                ...col.links,
                { id: newLinkId, text: "رابط جديد", url: "/" },
              ],
            };
          }
          return col;
        }),
      });
    }
  };

  const removeColumnLink = (columnId, linkId) => {
    setFooterData({
      ...footerData,
      columns: footerData.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            links: column.links.filter((link) => link.id !== linkId),
          };
        }
        return column;
      }),
    });
  };

  const addColumn = () => {
    const newId = (footerData.columns.length + 1).toString();
    setFooterData({
      ...footerData,
      columns: [
        ...footerData.columns,
        {
          id: newId,
          title: "عنوان جديد",
          links: [{ id: `${newId}-1`, text: "رابط جديد", url: "/" }],
          enabled: true,
        },
      ],
    });
  };

  const removeColumn = (columnId) => {
    setFooterData({
      ...footerData,
      columns: footerData.columns.filter((column) => column.id !== columnId),
    });
  };

  const handleNewsletterChange = (field, value) => {
    setFooterData({
      ...footerData,
      newsletter: {
        ...footerData.newsletter,
        [field]: value,
      },
    });
  };

  const handleStyleChange = (field, value) => {
    setFooterData({
      ...footerData,
      style: {
        ...footerData.style,
        [field]: value,
      },
    });
  };

  const saveChanges = async () => {
    setIsSaving(true); // تعيين isSaving إلى true عند البدء
    try {
      const response = await axiosInstance.put(
        "https://taearif.com/api/content/footer",
        footerData,
      );

      if (response.data.status === "success") {
        toast.success("تم حفظ التغييرات بنجاح");
      }
    } catch (err) {
      toast.error("فشل في حفظ التغييرات");
    } finally {
      setIsSaving(false); // إعادة isSaving إلى false بعد الانتهاء
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <EnhancedSidebar activeTab="content" setActiveTab={() => {}} />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <EnhancedSidebar activeTab="content" setActiveTab={() => {}} />
          <main className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }
  if (!footerData) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <EnhancedSidebar activeTab="content" setActiveTab={() => {}} />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => window.history.back()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">رجوع</span>
                  </Button>
                  <h1 className="text-2xl font-bold">إدارة تذييل الصفحة</h1>
                </div>
                <p className="text-muted-foreground">
                  تخصيص تذييل موقعك ومعلومات الاتصال
                </p>
              </div>
              <Button onClick={saveChanges} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الحفظ
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="general">معلومات عامة</TabsTrigger>
              <TabsTrigger value="social">وسائل التواصل</TabsTrigger>
              <TabsTrigger value="columns">أعمدة التذييل</TabsTrigger>
              <TabsTrigger value="newsletter">النشرة البريدية</TabsTrigger>
              <TabsTrigger value="style">المظهر</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الاتصال</CardTitle>
                  <CardDescription>
                    معلومات الاتصال التي ستظهر في تذييل موقعك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">اسم الشركة</Label>
                      <Input
                        id="companyName"
                        value={footerData?.general?.companyName}
                        onChange={(e) =>
                          handleGeneralChange("companyName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={footerData?.general?.email}
                        onChange={(e) =>
                          handleGeneralChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={footerData?.general?.phone}
                        onChange={(e) =>
                          handleGeneralChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHours">ساعات العمل</Label>
                      <Input
                        id="workingHours"
                        value={footerData?.general?.workingHours}
                        onChange={(e) =>
                          handleGeneralChange("workingHours", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Textarea
                      id="address"
                      value={footerData?.general?.address}
                      onChange={(e) =>
                        handleGeneralChange("address", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="showContactInfo"
                      checked={footerData?.general?.showContactInfo}
                      onCheckedChange={(checked) =>
                        handleGeneralChange("showContactInfo", checked)
                      }
                    />
                    <Label htmlFor="showContactInfo">عرض معلومات الاتصال</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="showWorkingHours"
                      checked={footerData?.general?.showWorkingHours}
                      onCheckedChange={(checked) =>
                        handleGeneralChange("showWorkingHours", checked)
                      }
                    />
                    <Label htmlFor="showWorkingHours">عرض ساعات العمل</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>حقوق النشر</CardTitle>
                  <CardDescription>
                    نص حقوق النشر الذي سيظهر في أسفل الموقع
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="copyrightText">نص حقوق النشر</Label>
                    <Input
                      id="copyrightText"
                      value={footerData?.general?.copyrightText}
                      onChange={(e) =>
                        handleGeneralChange("copyrightText", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="showCopyright"
                      checked={footerData?.general?.showCopyright}
                      onCheckedChange={(checked) =>
                        handleGeneralChange("showCopyright", checked)
                      }
                    />
                    <Label htmlFor="showCopyright">عرض حقوق النشر</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
                  <CardDescription>
                    أضف روابط وسائل التواصل الاجتماعي لموقعك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {footerData.social.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {socialIcons[item.platform]}
                      </div>
                      <div className="grid flex-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`platform-${item.id}`}>المنصة</Label>
                          <Select
                            value={item.platform}
                            onValueChange={(value) =>
                              handleSocialChange(item.id, "platform", value)
                            }
                          >
                            <SelectTrigger id={`platform-${item.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {socialPlatforms.map((platform) => (
                                <SelectItem
                                  key={platform.value}
                                  value={platform.value}
                                >
                                  <div className="flex items-center gap-2">
                                    {socialIcons[platform.value]}
                                    <span>{platform.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`url-${item.id}`}>الرابط</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`url-${item.id}`}
                              value={item.url}
                              onChange={(e) =>
                                handleSocialChange(
                                  item.id,
                                  "url",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                              <Switch
                                id={`enabled-${item.id}`}
                                checked={item.enabled}
                                onCheckedChange={(checked) =>
                                  handleSocialChange(
                                    item.id,
                                    "enabled",
                                    checked,
                                  )
                                }
                              />
                              <Label
                                htmlFor={`enabled-${item.id}`}
                                className="whitespace-nowrap"
                              >
                                تفعيل
                              </Label>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeSocialPlatform(item.id)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">حذف</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addSocialPlatform}
                    className="w-full"
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة منصة جديدة
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="columns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>أعمدة التذييل</CardTitle>
                  <CardDescription>
                    أضف وعدل أعمدة الروابط في تذييل موقعك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {footerData.columns.map((column) => (
                      <Card key={column.id} className="border-dashed">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor={`column-title-${column.id}`}>
                                عنوان العمود
                              </Label>
                              <Input
                                id={`column-title-${column.id}`}
                                value={column.title}
                                onChange={(e) =>
                                  handleColumnChange(
                                    column.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                id={`column-enabled-${column.id}`}
                                checked={column.enabled}
                                onCheckedChange={(checked) =>
                                  handleColumnChange(
                                    column.id,
                                    "enabled",
                                    checked,
                                  )
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeColumn(column.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">حذف العمود</span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>الروابط</Label>
                              <Badge variant="outline">
                                {column.links.length}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {column.links.map((link) => (
                                <div
                                  key={link.id}
                                  className="flex items-center gap-2 rounded-md border p-2"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <div className="grid flex-1 gap-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <Input
                                        placeholder="نص الرابط"
                                        value={link.text}
                                        onChange={(e) =>
                                          handleColumnLinkChange(
                                            column.id,
                                            link.id,
                                            "text",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <Input
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) =>
                                          handleColumnLinkChange(
                                            column.id,
                                            link.id,
                                            "url",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeColumnLink(column.id, link.id)
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">حذف الرابط</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addColumnLink(column.id)}
                            className="w-full"
                          >
                            <Plus className="ml-2 h-4 w-4" />
                            إضافة رابط
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    <Card
                      className="flex h-full cursor-pointer flex-col items-center justify-center border-dashed p-6 text-center transition-colors hover:bg-muted/50"
                      onClick={addColumn}
                    >
                      <div className="mb-4 rounded-full bg-primary/10 p-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-1 font-medium">إضافة عمود جديد</h3>
                      <p className="text-sm text-muted-foreground">
                        إضافة مجموعة روابط جديدة
                      </p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletter" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>النشرة البريدية</CardTitle>
                  <CardDescription>
                    إعدادات نموذج الاشتراك في النشرة البريدية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="newsletter-enabled"
                      checked={footerData.newsletter.enabled}
                      onCheckedChange={(checked) =>
                        handleNewsletterChange("enabled", checked)
                      }
                    />
                    <Label htmlFor="newsletter-enabled">
                      تفعيل النشرة البريدية
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newsletter-title">
                      عنوان النشرة البريدية
                    </Label>
                    <Input
                      id="newsletter-title"
                      value={footerData.newsletter.title}
                      onChange={(e) =>
                        handleNewsletterChange("title", e.target.value)
                      }
                      disabled={!footerData.newsletter.enabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newsletter-description">
                      وصف النشرة البريدية
                    </Label>
                    <Textarea
                      id="newsletter-description"
                      value={footerData.newsletter.description}
                      onChange={(e) =>
                        handleNewsletterChange("description", e.target.value)
                      }
                      disabled={!footerData.newsletter.enabled}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-placeholder">
                        نص العنصر النائب
                      </Label>
                      <Input
                        id="newsletter-placeholder"
                        value={footerData.newsletter.placeholderText}
                        onChange={(e) =>
                          handleNewsletterChange(
                            "placeholderText",
                            e.target.value,
                          )
                        }
                        disabled={!footerData.newsletter.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-button">نص الزر</Label>
                      <Input
                        id="newsletter-button"
                        value={footerData.newsletter.buttonText}
                        onChange={(e) =>
                          handleNewsletterChange("buttonText", e.target.value)
                        }
                        disabled={!footerData.newsletter.enabled}
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>ملاحظة</AlertTitle>
                    <AlertDescription>
                      يجب تكوين خدمة البريد الإلكتروني في إعدادات الموقع لتلقي
                      اشتراكات النشرة البريدية.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>مظهر التذييل</CardTitle>
                  <CardDescription>
                    تخصيص مظهر وتنسيق تذييل موقعك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="footer-layout">تخطيط التذييل</Label>
                      <Select
                        value={footerData.style.layout}
                        onValueChange={(value) =>
                          handleStyleChange("layout", value)
                        }
                      >
                        <SelectTrigger id="footer-layout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-width">عرض كامل</SelectItem>
                          <SelectItem value="contained">محتوى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footer-columns">عدد الأعمدة</Label>
                      <Select
                        value={footerData.style.columns.toString()}
                        onValueChange={(value) =>
                          handleStyleChange("columns", Number.parseInt(value))
                        }
                      >
                        <SelectTrigger id="footer-columns">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 عمود</SelectItem>
                          <SelectItem value="2">2 عمود</SelectItem>
                          <SelectItem value="3">3 أعمدة</SelectItem>
                          <SelectItem value="4">4 أعمدة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="background-color">لون الخلفية</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{
                            backgroundColor: footerData.style.backgroundColor,
                          }}
                        />
                        <Input
                          id="background-color"
                          value={footerData.style.backgroundColor}
                          onChange={(e) =>
                            handleStyleChange("backgroundColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="text-color">لون النص</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{
                            backgroundColor: footerData.style.textColor,
                          }}
                        />
                        <Input
                          id="text-color"
                          value={footerData.style.textColor}
                          onChange={(e) =>
                            handleStyleChange("textColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">لون التمييز</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{
                            backgroundColor: footerData.style.accentColor,
                          }}
                        />
                        <Input
                          id="accent-color"
                          value={footerData.style.accentColor}
                          onChange={(e) =>
                            handleStyleChange("accentColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="show-social-icons"
                        checked={footerData.style.showSocialIcons}
                        onCheckedChange={(checked) =>
                          handleStyleChange("showSocialIcons", checked)
                        }
                      />
                      <Label htmlFor="show-social-icons">
                        عرض أيقونات وسائل التواصل الاجتماعي
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="social-icons-position">
                        موضع أيقونات التواصل الاجتماعي
                      </Label>
                      <Select
                        value={footerData.style.socialIconsPosition}
                        onValueChange={(value) =>
                          handleStyleChange("socialIconsPosition", value)
                        }
                        disabled={!footerData.style.showSocialIcons}
                      >
                        <SelectTrigger id="social-icons-position">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">أعلى التذييل</SelectItem>
                          <SelectItem value="bottom">أسفل التذييل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
