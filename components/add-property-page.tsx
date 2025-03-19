"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedSidebar } from "@/components/enhanced-sidebar";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";

// Dynamically import the MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">جاري تحميل الخريطة...</p>
    </div>
  ),
});

export default function AddPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    type: "",
    listingType: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    features: "",
    status: "draft",
    featured: false,
    latitude: 25.2048,
    longitude: 55.2708,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<{
    thumbnail: string[];
    gallery: string[];
    floorPlans: string[];
  }>({
    thumbnail: [],
    gallery: [],
    floorPlans: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleImageUpload = (type: "thumbnail" | "gallery" | "floorPlans") => {
    // Simulate image upload - in a real app, this would handle file selection and upload
    const newImage = `/placeholder.svg?height=300&width=500&text=Image${Math.floor(Math.random() * 1000)}`;
    setImages((prev) => ({
      ...prev,
      [type]: [...prev[type], newImage],
    }));
  };

  const removeImage = (
    type: "thumbnail" | "gallery" | "floorPlans",
    index: number,
  ) => {
    setImages((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "عنوان العقار مطلوب";
    if (!formData.address) newErrors.address = "عنوان العقار مطلوب";
    if (!formData.price) newErrors.price = "السعر مطلوب";
    if (!formData.type) newErrors.type = "نوع العقار مطلوب";
    if (!formData.listingType) newErrors.listingType = "نوع القائمة مطلوب";
    if (!formData.bedrooms) newErrors.bedrooms = "عدد غرف النوم مطلوب";
    if (!formData.bathrooms) newErrors.bathrooms = "عدد الحمامات مطلوب";
    if (!formData.size) newErrors.size = "مساحة العقار مطلوبة";
    if (images.thumbnail.length === 0)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (validateForm()) {
      try {
        // تحضير البيانات وفقًا لصيغة API
        const requestData = {
          title: formData.title,
          address: formData.address,
          price: Number(formData.price),
          type: formData.type,
          beds: Number(formData.bedrooms),
          bath: Number(formData.bathrooms),
          size: Number(formData.size),
          features: formData.features.split("، ").filter((f) => f), // تقسيم الميزات
          status: publish ? 1 : 0, // 1 للمنشور، 0 للمسودة
          featured_image: images.thumbnail[0], // الصورة الرئيسية الأولى
          gallery: images.gallery, // معرض الصور
          description: formData.description,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          featured: formData.featured,
          area: Number(formData.size), // افتراض أن area نفس size إذا لم تكن موجودة
          city_id: 1, // أضف مصدر هذه البيانات من النموذج أو اجعلها اختيارية
          category_id: 1, // نفس الملاحظة أعلاه
        };

        // إرسال الطلب إلى API
        const response = await axiosInstance.post("/properties", requestData);

        // عند النجاح
        console.log("Property created:", response.data);
        router.push("/properties");
      } catch (error) {
        // معالجة الأخطاء
        if (error.response) {
          console.error("API Error:", error.response.data);
          // عرض رسالة خطأ من API للعميل
          alert(`فشل الإنشاء: ${error.response.data.message}`);
        } else {
          console.error("Network Error:", error.message);
          alert("حدث خطأ في الاتصال بالشبكة");
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/properties")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  إضافة عقار جديد
                </h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleSubmit(false)}>
                  حفظ كمسودة
                </Button>
                <Button onClick={() => handleSubmit(true)}>نشر العقار</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العقار الأساسية</CardTitle>
                  <CardDescription>
                    أدخل المعلومات الأساسية للعقار
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان العقار</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="شقة حديثة مع إطلالة على المدينة"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف العقار</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="شقة جميلة مع تشطيبات حديثة وإطلالات رائعة على المدينة"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 شارع الرئيسي، دبي، الإمارات العربية المتحدة"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="750000"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="listingType">نوع القائمة</Label>
                      <Select
                        name="listingType"
                        value={formData.listingType}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "listingType", value },
                          } as any)
                        }
                      >
                        <SelectTrigger
                          id="listingType"
                          className={errors.listingType ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="للبيع">للبيع</SelectItem>
                          <SelectItem value="للإيجار">للإيجار</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.listingType && (
                        <p className="text-sm text-red-500">
                          {errors.listingType}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">نوع العقار</Label>
                      <Select
                        name="type"
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "type", value },
                          } as any)
                        }
                      >
                        <SelectTrigger
                          id="type"
                          className={errors.type ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="فيلا">فيلا</SelectItem>
                          <SelectItem value="شقة">شقة</SelectItem>
                          <SelectItem value="تاون هاوس">تاون هاوس</SelectItem>
                          <SelectItem value="استوديو">استوديو</SelectItem>
                          <SelectItem value="بنتهاوس">بنتهاوس</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-red-500">{errors.type}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                      <RadioGroup
                        defaultValue="draft"
                        className="flex gap-4"
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "status", value },
                          } as any)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="draft" id="draft" />
                          <Label htmlFor="draft" className="mr-2">
                            مسودة
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="published" id="published" />
                          <Label htmlFor="published" className="mr-2">
                            منشور
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل العقار</CardTitle>
                  <CardDescription>أدخل مواصفات وميزات العقار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">غرف النوم</Label>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        placeholder="2"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className={errors.bedrooms ? "border-red-500" : ""}
                      />
                      {errors.bedrooms && (
                        <p className="text-sm text-red-500">
                          {errors.bedrooms}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">الحمامات</Label>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        placeholder="2"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className={errors.bathrooms ? "border-red-500" : ""}
                      />
                      {errors.bathrooms && (
                        <p className="text-sm text-red-500">
                          {errors.bathrooms}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">المساحة (قدم مربع)</Label>
                      <Input
                        id="size"
                        name="size"
                        type="number"
                        placeholder="1200"
                        value={formData.size}
                        onChange={handleInputChange}
                        className={errors.size ? "border-red-500" : ""}
                      />
                      {errors.size && (
                        <p className="text-sm text-red-500">{errors.size}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">الميزات (مفصولة بفواصل)</Label>
                    <Input
                      id="features"
                      name="features"
                      placeholder="شرفة، أرضيات خشبية، أجهزة منزلية حديثة"
                      value={formData.features}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("featured", checked)
                      }
                    />
                    <Label htmlFor="featured" className="mr-2">
                      عرض هذا العقار في الصفحة الرئيسية
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>موقع العقار</CardTitle>
                  <CardDescription>حدد موقع العقار على الخريطة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[400px] rounded-md border">
                    <MapComponent
                      latitude={Number(formData.latitude)}
                      longitude={Number(formData.longitude)}
                      onPositionChange={(lat, lng) =>
                        handleLocationChange(lat, lng)
                      }
                      showSearch={true}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">خط العرض</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">خط الطول</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>صور العقار</CardTitle>
                  <CardDescription>قم بتحميل صور العقار</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="thumbnail">
                    <TabsList className="mb-4">
                      <TabsTrigger value="thumbnail">
                        الصورة الرئيسية
                      </TabsTrigger>
                      <TabsTrigger value="gallery">معرض الصور</TabsTrigger>
                      <TabsTrigger value="floorPlans">
                        مخططات الطوابق
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="thumbnail">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          {images.thumbnail.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-40 w-40 overflow-hidden rounded-md border"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt="Property thumbnail"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() => removeImage("thumbnail", index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => handleImageUpload("thumbnail")}
                          >
                            <Upload className="h-6 w-6" />
                            <span>تحميل صورة</span>
                          </Button>
                        </div>
                        {errors.thumbnail && (
                          <p className="text-sm text-red-500">
                            {errors.thumbnail}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          قم بتحميل صورة رئيسية واحدة على الأقل للعقار. هذه
                          الصورة ستظهر في قوائم البحث.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="gallery">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          {images.gallery.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-40 w-40 overflow-hidden rounded-md border"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt="Property gallery"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() => removeImage("gallery", index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => handleImageUpload("gallery")}
                          >
                            <Upload className="h-6 w-6" />
                            <span>تحميل صورة</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          قم بتحميل صور متعددة لإظهار مختلف جوانب العقار. يمكنك
                          تحميل ما يصل إلى 10 صور.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="floorPlans">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          {images.floorPlans.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-40 w-40 overflow-hidden rounded-md border"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt="Floor plan"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() => removeImage("floorPlans", index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => handleImageUpload("floorPlans")}
                          >
                            <Upload className="h-6 w-6" />
                            <span>تحميل مخطط</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          قم بتحميل مخططات الطوابق لمساعدة العملاء على فهم تخطيط
                          العقار.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/properties")}
                  >
                    إلغاء
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSubmit(false)}
                    >
                      حفظ كمسودة
                    </Button>
                    <Button onClick={() => handleSubmit(true)}>
                      نشر العقار
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
