"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Upload,
  X,
  Plus,
  ImageIcon,
  MapPin,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedSidebar } from "@/components/enhanced-sidebar";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";

// Dynamically import the Map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
      <p className="text-muted-foreground">جاري تحميل الخريطة...</p>
    </div>
  ),
});

// تعريف نوع صورة المشروع
type ProjectImage = {
  id: string;
  file: File;
  url: string;
};

// تعريف واجهة المشروع الجديد، مع إضافة "amenities" كمجموعة نصوص مفصولة بفواصل
interface INewProject {
  id: string;
  name: string;
  location: string;
  price: string;
  status: string;
  completionDate: string;
  units: number;
  developer: string;
  description: string;
  featured: boolean;
  latitude: number;
  longitude: number;
  amenities: string; // مدخل نصي للمرافق، مفصول بفواصل
}

export default function AddProjectPage(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const plansInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // حالة المشروع الجديدة مع إضافة amenities
  const [newProject, setNewProject] = useState<INewProject>({
    id: "",
    name: "",
    location: "",
    price: "",
    status: "",
    completionDate: "",
    units: 0,
    developer: "",
    description: "",
    featured: false,
    latitude: 25.276987, // افتراضي (دبي)
    longitude: 55.296249, // افتراضي (دبي)
    amenities: "",
  });

  const [thumbnailImage, setThumbnailImage] = useState<ProjectImage | null>(
    null,
  );
  const [planImages, setPlanImages] = useState<ProjectImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (formErrors[id]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (value === "" || !isNaN(Number.parseFloat(value))) {
      setNewProject((prev) => ({
        ...prev,
        [id]: value === "" ? 0 : Number.parseFloat(value),
      }));
    }
  };

  const handleMapPositionChange = (lat: number, lng: number) => {
    setNewProject((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setNewProject((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (formErrors[id]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewProject((prev) => ({
      ...prev,
      featured: checked,
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
        if (formErrors.thumbnail) {
          setFormErrors((prev) => {
            const updated = { ...prev };
            delete updated.thumbnail;
            return updated;
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePlansUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPlanImages((prev) => [
            ...prev,
            {
              id:
                Date.now().toString() +
                Math.random().toString(36).substring(2, 9),
              file,
              url: event.target.result.toString(),
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
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
              id:
                Date.now().toString() +
                Math.random().toString(36).substring(2, 9),
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

  const removePlanImage = (id: string) => {
    setPlanImages((prev) => prev.filter((image) => image.id !== id));
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((image) => image.id !== id));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!newProject.name.trim()) {
      errors.name = "اسم المشروع مطلوب";
    }
    if (!newProject.location.trim()) {
      errors.location = "الموقع مطلوب";
    }
    if (!newProject.price.trim()) {
      errors.price = "السعر مطلوب";
    }
    if (!newProject.status) {
      errors.status = "الحالة مطلوبة";
    }
    if (!newProject.completionDate.trim()) {
      errors.completionDate = "تاريخ الإنجاز مطلوب";
    }
    if (!newProject.developer.trim()) {
      errors.developer = "المطور مطلوب";
    }
    if (!newProject.description.trim()) {
      errors.description = "الوصف مطلوب";
    }
    if (!thumbnailImage) {
      errors.thumbnail = "صورة المشروع الرئيسية مطلوبة";
    }
    if (isNaN(newProject.latitude) || isNaN(newProject.longitude)) {
      errors.coordinates = "إحداثيات الموقع غير صحيحة";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProject = async (
    status: "منشور" | "مسودة" | "Pre-construction",
  ) => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      // إعداد بيانات المشروع المطلوب إرسالها
      const projectData = {
        name: newProject.name,
        location: newProject.location,
        price: newProject.price,
        status: newProject.status, // يمكنك تعديلها إذا أردت استخدام status المُرسل كوسيلة
        completion_date: newProject.completionDate,
        units: newProject.units,
        developer: newProject.developer,
        description: newProject.description,
        thumbnail: thumbnailImage ? thumbnailImage.url : "",
        featured: newProject.featured,
        gallery: galleryImages.map((img) => img.url),
        amenities: newProject.amenities
          ? newProject.amenities.split(",").map((amenity) => amenity.trim())
          : [],
      };

      console.log("Saving project:", projectData);

      // إرسال الطلب عبر POST إلى API
      await axiosInstance.post("https://taearif.com/api/projects", projectData);

      // إعادة التوجيه بعد النجاح
      router.push("/projects");
    } catch (error: any) {
      console.error("Error saving project:", error);
      // يمكنك إضافة إشعار (toast) هنا لإظهار الخطأ للمستخدم
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="projects" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/projects")}
                  className="h-8 w-8"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">العودة</span>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  إضافة مشروع جديد
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSaveProject("مسودة")}
                  disabled={isLoading}
                >
                  حفظ كمسودة
                </Button>
                <Button
                  onClick={() => handleSaveProject("منشور")}
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحفظ..." : "نشر المشروع"}
                </Button>
              </div>
            </div>

            {/* معلومات المشروع */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات المشروع</CardTitle>
                <CardDescription>
                  أدخل التفاصيل الأساسية للمشروع العقاري الجديد
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">اسم المشروع</Label>
                    <Input
                      id="name"
                      placeholder="سكاي لاين ريزيدنس"
                      value={newProject.name}
                      onChange={handleInputChange}
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      placeholder="وسط المدينة، نيويورك"
                      value={newProject.location}
                      onChange={handleInputChange}
                      className={formErrors.location ? "border-red-500" : ""}
                    />
                    {formErrors.location && (
                      <p className="text-xs text-red-500">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">السعر الابتدائي</Label>
                    <Input
                      id="price"
                      placeholder="من $750,000"
                      value={newProject.price}
                      onChange={handleInputChange}
                      className={formErrors.price ? "border-red-500" : ""}
                    />
                    {formErrors.price && (
                      <p className="text-xs text-red-500">{formErrors.price}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="units">عدد الوحدات</Label>
                    <Input
                      id="units"
                      placeholder="120"
                      type="number"
                      value={newProject.units || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger
                        id="status"
                        className={formErrors.status ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="منشور">منشور</SelectItem>
                        <SelectItem value="مسودة">مسودة</SelectItem>
                        <SelectItem value="Pre-construction">
                          Pre-construction
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.status && (
                      <p className="text-xs text-red-500">
                        {formErrors.status}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="completionDate">تاريخ الإنجاز</Label>
                    <Input
                      id="completionDate"
                      placeholder="2025"
                      value={newProject.completionDate}
                      onChange={handleInputChange}
                      className={
                        formErrors.completionDate ? "border-red-500" : ""
                      }
                    />
                    {formErrors.completionDate && (
                      <p className="text-xs text-red-500">
                        {formErrors.completionDate}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="developer">المطور</Label>
                    <Input
                      id="developer"
                      placeholder="مجموعة التطوير الحضري"
                      value={newProject.developer}
                      onChange={handleInputChange}
                      className={formErrors.developer ? "border-red-500" : ""}
                    />
                    {formErrors.developer && (
                      <p className="text-xs text-red-500">
                        {formErrors.developer}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amenities">المرافق (افصلها بفواصل)</Label>
                    <Input
                      id="amenities"
                      placeholder="حمام سباحة, نادي رياضي, حديقة على السطح"
                      value={newProject.amenities}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="featured"
                      checked={newProject.featured}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="featured" className="mr-2">
                      عرض هذا المشروع في الصفحة الرئيسية
                    </Label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="شقق فاخرة عالية الارتفاع مع إطلالات بانورامية على المدينة"
                    rows={3}
                    value={newProject.description}
                    onChange={handleInputChange}
                    className={formErrors.description ? "border-red-500" : ""}
                  />
                  {formErrors.description && (
                    <p className="text-xs text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Location */}
            <Card>
              <CardHeader>
                <CardTitle>موقع المشروع على الخريطة</CardTitle>
                <CardDescription>
                  حدد موقع المشروع على الخريطة أو أدخل الإحداثيات يدويًا
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[400px] w-full rounded-md overflow-hidden border">
                  {mapLoaded && (
                    <MapComponent
                      latitude={newProject.latitude}
                      longitude={newProject.longitude}
                      onPositionChange={handleMapPositionChange}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">خط العرض (Latitude)</Label>
                    <Input
                      id="latitude"
                      placeholder="25.276987"
                      value={newProject.latitude.toString()}
                      onChange={handleCoordinateChange}
                      className={formErrors.coordinates ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">خط الطول (Longitude)</Label>
                    <Input
                      id="longitude"
                      placeholder="55.296249"
                      value={newProject.longitude.toString()}
                      onChange={handleCoordinateChange}
                      className={formErrors.coordinates ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {formErrors.coordinates && (
                  <p className="text-xs text-red-500">
                    {formErrors.coordinates}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <p>
                    انقر على الخريطة لتحديد موقع المشروع أو اسحب العلامة لتغيير
                    الموقع
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>صورة المشروع الرئيسية</CardTitle>
                <CardDescription>
                  قم بتحميل صورة رئيسية تمثل المشروع العقاري
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="border rounded-md p-2 flex-1 w-full">
                    <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                      {thumbnailImage ? (
                        <>
                          <img
                            src={thumbnailImage.url || "/placeholder.svg"}
                            alt="Project thumbnail"
                            className="h-full w-full object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={removeThumbnail}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full md:w-1/3">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                    <Button
                      variant="outline"
                      className="h-12 w-full"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        <span>رفع صورة</span>
                      </div>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو
                      5 ميجابايت.
                    </p>
                    {formErrors.thumbnail && (
                      <p className="text-xs text-red-500">
                        {formErrors.thumbnail}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Plans Upload */}
            <Card>
              <CardHeader>
                <CardTitle>مخططات المشروع</CardTitle>
                <CardDescription>
                  قم بتحميل مخططات الطوابق والتصاميم الهندسية للمشروع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {planImages.map((image) => (
                      <div
                        key={image.id}
                        className="border rounded-md p-2 relative"
                      >
                        <div className="h-40 bg-muted rounded-md overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Project plan"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 h-6 w-6"
                          onClick={() => removePlanImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-center mt-2 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                    <div
                      className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => plansInputRef.current?.click()}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        إضافة مخطط
                      </p>
                    </div>
                  </div>
                  <input
                    ref={plansInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePlansUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    يمكنك رفع مخططات بصيغة JPG أو PNG. الحد الأقصى لعدد المخططات
                    هو 10.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Gallery Upload */}
            <Card>
              <CardHeader>
                <CardTitle>معرض صور المشروع</CardTitle>
                <CardDescription>
                  قم بتحميل صور متعددة لعرض تفاصيل المشروع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((image) => (
                      <div
                        key={image.id}
                        className="border rounded-md p-2 relative"
                      >
                        <div className="h-40 bg-muted rounded-md overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Gallery image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 h-6 w-6"
                          onClick={() => removeGalleryImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-center mt-2 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                    <div
                      className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        إضافة صورة
                      </p>
                    </div>
                  </div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    يمكنك رفع صور بصيغة JPG أو PNG. الحد الأقصى لعدد الصور هو
                    20.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/projects")}
                >
                  إلغاء
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSaveProject("مسودة")}
                    disabled={isLoading}
                  >
                    حفظ كمسودة
                  </Button>
                  <Button
                    onClick={() => handleSaveProject("منشور")}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الحفظ..." : "نشر المشروع"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
