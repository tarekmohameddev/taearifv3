"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Upload,
  X,
  Loader2,
  ImageIcon,
  Plus,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { uploadMultipleFiles } from "@/utils/uploadMultiple";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted rounded-md">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
      </div>
    </div>
  ),
});

export default function AddPropertyPage() {
  const {
    propertiesManagement: { properties, loading, isInitialized },
    setPropertiesManagement,
    fetchProperties,
  } = useStore();
  const [submitError, setSubmitError] = useState(null);
  const { userData, fetchUserData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  let hasReachedLimit;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    category: "",
    project_id: "",
    transaction_type: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    features: "",
    status: "draft",
    featured: false,
    latitude: 24.766316905850978,
    longitude: 46.73579692840576,
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
  });
  const [previews, setPreviews] = useState({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
  });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!isInitialized && !loading) {
      fetchProperties();
    }
  }, [fetchProperties, isInitialized, loading, properties]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/properties/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطأ أثناء جلب أنواع العقارات.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/user/projects");
        setProjects(response.data.data.user_projects);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطأ أثناء جلب أنواع العقارات.");
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    if (
      properties.length >=
      useAuthStore.getState().userData?.real_estate_limit_number
    ) {
      toast.error(
        `لا يمكنك إضافة أكثر من ${useAuthStore.getState().userData?.real_estate_limit_number} عقارات`,
      );
      hasReachedLimit =
        properties.length >=
        (useAuthStore.getState().userData?.real_estate_limit_number || 10);
      router.push("/properties");
    }
  }, [properties, router]);

  const thumbnailInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const floorPlansInputRef = useRef(null);

  const handleInputChange = (e) => {
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

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMapPositionChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const triggerFileInput = (type) => {
    if (type === "thumbnail" && thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
    } else if (type === "gallery" && galleryInputRef.current) {
      galleryInputRef.current.click();
    } else if (type === "floorPlans" && floorPlansInputRef.current) {
      floorPlansInputRef.current.click();
    }
  };

  const handleFileChange = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "thumbnail") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى تحميل ملفات صور فقط (JPG, PNG, GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("يجب أن يكون حجم الملف أقل من 5 ميجابايت");
        return;
      }
      setImages((prev) => ({ ...prev, thumbnail: file }));
      setPreviews((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
      }));
    } else {
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("يجب أن تكون الصور بصيغة JPG أو PNG أو GIF فقط");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("يجب أن يكون حجم الملف أقل من 5 ميجابايت");
          return false;
        }
        return true;
      });
      setImages((prev) => ({
        ...prev,
        [type]: [...prev[type], ...validFiles],
      }));
      setPreviews((prev) => ({
        ...prev,
        [type]: [
          ...prev[type],
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }

    e.target.value = "";
  };

  const removeImage = (type, index) => {
    if (type === "thumbnail") {
      setImages((prev) => ({ ...prev, thumbnail: null }));
      setPreviews((prev) => ({ ...prev, thumbnail: null }));
    } else {
      setImages((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
      setPreviews((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "عنوان العقار مطلوب";
    if (!formData.address) newErrors.address = "عنوان العقار مطلوب";
    // if (!formData.price) newErrors.price = "السعر مطلوب";
    // if (!formData.category) newErrors.category = "نوع العقار مطلوب";
    // if (!formData.transaction_type)
    //   newErrors.transaction_type = "نوع القائمة مطلوب";
    // if (!formData.bedrooms) newErrors.bedrooms = "عدد غرف النوم مطلوب";
    // if (!formData.bathrooms) newErrors.bathrooms = "عدد الحمامات مطلوب";
    // if (!formData.size) newErrors.size = "مساحة العقار مطلوبة";
    // if (!formData.features) newErrors.features = "الميزات مطلوبة";
    if (!images.thumbnail)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
    // if (!images.gallery.length)
    //   newErrors.gallery = "يجب تحميل صورة واحدة على الأقل في معرض الصور";
    if (!formData.address) newErrors.address = "عنوان العقار مطلوب";
    if (!formData.description)
      newErrors.description = "من فضلك اكتب وصف للعقار";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish) => {
    setSubmitError(null);
    if (validateForm()) {
      setIsLoading(true);
      setUploading(true);

      try {
        let thumbnailPath = null;
        let galleryPaths = [];
        let floorPlansPaths = [];

        if (images.thumbnail) {
          const uploadedFile = await uploadSingleFile(
            images.thumbnail,
            "property",
          );
          thumbnailPath = uploadedFile.path.replace("https://taearif.com", "");
        }

        if (images.gallery.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.gallery,
            "property",
          );
          galleryPaths = uploadedFiles.map((f) =>
            f.path.replace("https://taearif.com", ""),
          );
        }

        if (images.floorPlans.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.floorPlans,
            "property",
          );
          floorPlansPaths = uploadedFiles.map((f) =>
            f.path.replace("https://taearif.com", ""),
          );
        }

        const propertyData = {
          title: formData.title,
          address: formData.address,
          price: Number(formData.price),
          project_id: formData.project_id,
          beds: parseInt(formData.bedrooms),
          bath: parseInt(formData.bathrooms),
          size: parseInt(formData.size),
          features: formData.features.split(",").map((f) => f.trim()),
          type: formData.transaction_type,
          status: publish ? 1 : 0,
          featured_image: thumbnailPath,
          floor_planning_image: floorPlansPaths,
          gallery: galleryPaths,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          featured: formData.featured,
          area: parseInt(formData.size),
          city_id: 1,
          category_id: parseInt(formData.category),
        };

        let response = await axiosInstance.post("/properties", propertyData);
        toast.success("تم نشر العقار بنجاح");
        const currentState = useStore.getState();
        const createdProject = response.data.user_property;
        createdProject.status =
          createdProject.status === true ? "منشور" : "مسودة";
        const updatedProperties = [
          createdProject,
          ...currentState.propertiesManagement.properties,
        ];
        setPropertiesManagement({
          properties: updatedProperties,
        });
        router.push("/properties");
      } catch (error) {
        toast.error("حدث خطأ أثناء حفظ العقار. يرجى المحاولة مرة أخرى.");
        setSubmitError("حدث خطأ أثناء حفظ العقار. يرجى المحاولة مرة أخرى.");
      } finally {
        setUploading(false);
        setIsLoading(false);
      }
    } else {
      toast.error("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      setSubmitError("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {hasReachedLimit && (
              <div
                className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">تنبيه!</strong>
                <span className="block sm:inline">
                  {" "}
                  لقد وصلت إلى الحد الأقصى لعدد العقارات المسموح به (10 عقارات).
                  لا يمكنك إضافة المزيد من العقارات.
                </span>
              </div>
            )}
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
              <div className="flex flex-col items-end gap-2">
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
                    {isLoading ? "جاري الحفظ..." : "نشر العقار"}
                  </Button>
                </div>
                {submitError && (
                  <div className="text-red-500 text-sm mt-2">{submitError}</div>
                )}
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
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 شارع الرئيسي"
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
                      <Label htmlFor="transaction_type">نوع القائمة</Label>
                      <Select
                        name="transaction_type"
                        value={formData.transaction_type}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "transaction_type", value },
                          })
                        }
                      >
                        <SelectTrigger
                          id="transaction_type"
                          className={
                            errors.transaction_type ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">للبيع</SelectItem>
                          <SelectItem value="rent">للإيجار</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.transaction_type && (
                        <p className="text-sm text-red-500">
                          {errors.transaction_type}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">نوع العقار</Label>
                      <Select
                        name="category"
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger
                          id="category"
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">المشروع</Label>
                      <Select
                        name="project"
                        value={formData.project_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            project_id: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="project"
                          className={errors.project_id ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر المشروع" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id.toString()}
                            >
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.project && (
                        <p className="text-sm text-red-500">{errors.project}</p>
                      )}
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
                      className={errors.features ? "border-red-500" : ""}
                    />
                    {errors.features && (
                      <p className="text-sm text-red-500">{errors.features}</p>
                    )}
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
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      <div className="border rounded-md h-[400px] overflow-hidden">
                        <MapComponent
                          latitude={formData.latitude}
                          longitude={formData.longitude}
                          onPositionChange={handleMapPositionChange}
                          showSearch={true}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="latitude">خط العرض</Label>
                        </div>
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
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="longitude">خط الطول</Label>
                        </div>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="0.000001"
                          value={formData.longitude}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="text-sm font-medium mb-2">تعليمات:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• انقر على الخريطة لتحديد موقع العقار</li>
                          <li>• اسحب العلامة لضبط الموقع بدقة</li>
                          <li>• استخدم شريط البحث للعثور على موقع محدد</li>
                          <li>• يمكنك أيضًا إدخال الإحداثيات يدويًا</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>صورة العقار الرئيسية</CardTitle>
                  <CardDescription>
                    قم بتحميل صورة رئيسية تمثل العقار
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="border rounded-md p-2 flex-1 w-full">
                      <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                        {previews.thumbnail ? (
                          <>
                            <img
                              src={previews.thumbnail}
                              alt="Property thumbnail"
                              className="h-full w-full object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => removeImage("thumbnail")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-1/3">
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                      />
                      <Button
                        variant="outline"
                        className="h-12 w-full"
                        onClick={() => triggerFileInput("thumbnail")}
                        disabled={uploading.thumbnail}
                      >
                        <div className="flex items-center gap-2">
                          {uploading.thumbnail ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Upload className="h-5 w-5" />
                          )}
                          <span>رفع صورة</span>
                        </div>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف
                        هو 5 ميجابايت.
                      </p>
                      {errors.thumbnail && (
                        <p className="text-xs text-red-500">
                          {errors.thumbnail}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>معرض صور العقار</CardTitle>
                  <CardDescription>
                    قم بتحميل صور متعددة لعرض تفاصيل العقار
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previews.gallery.map((preview, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-2 relative"
                        >
                          <div className="h-40 bg-muted rounded-md overflow-hidden">
                            <img
                              src={preview}
                              alt={`Gallery image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 h-6 w-6"
                            onClick={() => removeImage("gallery", index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-center mt-2 truncate">
                            صورة {index + 1}
                          </p>
                        </div>
                      ))}
                      <div
                        className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => triggerFileInput("gallery")}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {uploading.gallery ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
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
                      onChange={(e) => handleFileChange(e, "gallery")}
                    />
                    {errors.gallery && (
                      <p className="text-red-500 text-sm">{errors.gallery}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع صور بصيغة JPG أو PNG. الحد الأقصى لعدد الصور هو
                      10.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>مخططات الطوابق</CardTitle>
                  <CardDescription>
                    قم بتحميل مخططات الطوابق والتصاميم الهندسية للعقار
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previews.floorPlans.map((preview, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-2 relative"
                        >
                          <div className="h-40 bg-muted rounded-md overflow-hidden">
                            <img
                              src={preview}
                              alt={`Floor plan ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 h-6 w-6"
                            onClick={() => removeImage("floorPlans", index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-center mt-2 truncate">
                            مخطط {index + 1}
                          </p>
                        </div>
                      ))}
                      <div
                        className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => triggerFileInput("floorPlans")}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {uploading.floorPlans ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          إضافة مخطط
                        </p>
                      </div>
                    </div>
                    <input
                      ref={floorPlansInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "floorPlans")}
                    />
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع مخططات بصيغة JPG أو PNG. الحد الأقصى لعدد
                      المخططات هو 5.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardFooter className="flex flex-col items-end border-t p-6 space-y-4">
                  <div className="w-full">
                    <div className="flex justify-between w-full">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/properties")}
                      >
                        إلغاء
                      </Button>
                      <div className="flex flex-col items-end gap-2">
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
                            {isLoading ? "جاري الحفظ..." : "نشر العقار"}
                          </Button>
                        </div>
                        {submitError && (
                          <div className="text-red-500 text-sm mt-2">
                            {submitError}
                          </div>
                        )}
                      </div>
                    </div>
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
