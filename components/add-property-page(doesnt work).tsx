"use client";

import React, { useState, useRef, useEffect } from "react";
import { uploadSingleFile } from '@/utils/uploadSingle';
import { uploadMultipleFiles } from '@/utils/uploadMultiple';
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

// تعريف نوع صورة العقار
type PropertyImage = {
  id: string;
  file: File;
  url: string;
};

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
  const [thumbnailImage, setThumbnailImage] = useState<PropertyImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);
  const [floorPlanImages, setFloorPlanImages] = useState<PropertyImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // إضافة حالة التحميل
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        setThumbnailImage({
          id: Date.now().toString(),
          file,
          url: event.target.result.toString(),
        });
        if (errors.thumbnail) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.thumbnail;
            return newErrors;
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setGalleryImages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              file,
              url: event.target.result.toString(),
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setFloorPlanImages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              file,
              url: event.target.result.toString(),
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeThumbnail = () => {
    setThumbnailImage(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((image) => image.id !== id));
  };

  const removeFloorPlanImage = (id: string) => {
    setFloorPlanImages((prev) => prev.filter((image) => image.id !== id));
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
    if (!thumbnailImage) newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      // رفع الصورة الرئيسية
      let featuredImageUrl = "";
      if (thumbnailImage) {
        const uploadResult = await uploadSingleFile(thumbnailImage.file, 'properties');
        featuredImageUrl = uploadResult.url; // استخراج الرابط من الاستجابة
      }

      // رفع صور المعرض
      let galleryUrls: string[] = [];
      if (galleryImages.length > 0) {
        const files = galleryImages.map(image => image.file);
        const uploadResults = await uploadMultipleFiles(files, 'properties');
        if (uploadResults && Array.isArray(uploadResults)) {
          galleryUrls = uploadResults.map(file => file.url); // استخراج الروابط
        } else {
          console.error("Error: uploadResults is not an array", uploadResults);
          throw new Error("فشل في رفع صور المعرض");
        }
      }

      // رفع مخططات الطوابق
      let floorPlanningUrls: string[] = [];
      if (floorPlanImages.length > 0) {
        const files = floorPlanImages.map(image => image.file);
        const uploadResults = await uploadMultipleFiles(files, 'properties');
        if (uploadResults && Array.isArray(uploadResults)) {
          floorPlanningUrls = uploadResults.map(file => file.url); // استخراج الروابط
        } else {
          console.error("Error: uploadResults is not an array", uploadResults);
          throw new Error("فشل في رفع مخططات الطوابق");
        }
      }

      // إعداد البيانات وفقًا لصيغة API
      const requestData = {
        title: formData.title,
        address: formData.address,
        price: Number(formData.price),
        type: formData.type,
        beds: Number(formData.bedrooms),
        bath: Number(formData.bathrooms),
        size: Number(formData.size),
        features: formData.features.split("، ").filter((f) => f),
        status: publish ? 1 : 0,
        featured_image: featuredImageUrl,
        floor_planning_image: floorPlanningUrls,
        gallery: galleryUrls,
        description: formData.description,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        featured: formData.featured,
        area: Number(formData.size),
        city_id: 1,
        category_id: 1,
      };

      // إرسال الطلب إلى API
      const response = await axiosInstance.post("https://taearif.com/api/properties", requestData);

      console.log("Property created:", response.data);
      router.push("/properties");
    } catch (error: any) {
      console.error("Error saving property:", error);
      if (error.response) {
        alert(`فشل الإنشاء: ${error.response.data.message || "خطأ في الخادم"}`);
      } else {
        alert("حدث خطأ في الاتصال بالشبكة");
      }
    } finally {
      setIsLoading(false);
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
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ كمسودة"}
                </Button>
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "جاري النشر..." : "نشر العقار"}
                </Button>
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
                          {thumbnailImage && (
                            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                              <img
                                src={thumbnailImage.url}
                                alt="Property thumbnail"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={removeThumbnail}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          <Button
                            variant="outline"
                            className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => thumbnailInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6" />
                            <span>تحميل صورة</span>
                          </Button>
                          <input
                            type="file"
                            ref={thumbnailInputRef}
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />
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
                          {galleryImages.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-40 w-40 overflow-hidden rounded-md border"
                            >
                              <img
                                src={image.url}
                                alt="Property gallery"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() => removeGalleryImage(image.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => galleryInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6" />
                            <span>تحميل صورة</span>
                          </Button>
                          <input
                            type="file"
                            multiple
                            ref={galleryInputRef}
                            className="hidden"
                            onChange={handleGalleryUpload}
                          />
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
                          {floorPlanImages.map((image, index) => (
                            <div
                              key={index}
                              className="relative h-40 w-40 overflow-hidden rounded-md border"
                            >
                              <img
                                src={image.url}
                                alt="Floor plan"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() => removeFloorPlanImage(image.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-dashed"
                            onClick={() => floorPlanInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6" />
                            <span>تحميل مخطط</span>
                          </Button>
                          <input
                            type="file"
                            multiple
                            ref={floorPlanInputRef}
                            className="hidden"
                            onChange={handleFloorPlanUpload}
                          />
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
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSubmit(false)}
                      disabled={isLoading}
                    >
                      {isLoading ? "جاري الحفظ..." : "حفظ كمسودة"}
                    </Button>
                    <Button
                      onClick={() => handleSubmit(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? "جاري النشر..." : "نشر العقار"}
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