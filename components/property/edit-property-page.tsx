"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { uploadMultipleFiles } from "@/utils/uploadMultiple";
import useStore from "@/context/Store";
import { PropertyCounter } from "@/components/property/propertyCOMP/property-counter";
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";

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

export default function EditPropertyPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();
  const { setPropertiesManagement } = useStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: "",
    category_id: "",
    address: "",
    price: "",
    type: "",
    transaction_type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: "",
    status: "draft",
    featured: false,
    latitude: 24.766316905850978,
    longitude: 46.73579692840576,
    category: "",
    size: "",
    length: "",
    width: "",
    facade_id: "",
    street_width_north: "",
    street_width_south: "",
    street_width_east: "",
    street_width_west: "",
    building_age: "",
    rooms: "",
    floors: "",
    floor_number: "",
    driver_room: "",
    maid_room: "",
    dining_room: "",
    living_room: "",
    majlis: "",
    storage_room: "",
    basement: "",
    swimming_pool: "",
    kitchen: "",
    balcony: "",
    garden: "",
    annex: "",
    elevator: "",
    city_id: null,
    district_id: null,
    private_parking: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<{
    thumbnail: File | null;
    gallery: File[];
    floorPlans: File[];
  }>({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
  });
  const [previews, setPreviews] = useState<{
    thumbnail: string | null;
    gallery: string[];
    floorPlans: string[];
  }>({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
  });
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const floorPlansInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [facades, setFacades] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axiosInstance.get("/user/projects");
  //       setProjects(response.data.data.user_projects);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //       toast.error("حدث خطأ أثناء جلب أنواع العقارات.");
  //     }
  //   };
  //   fetchCategories();
  // }, []);

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
    axiosInstance
      .get("/property/facades")
      .then((response) => {
        setFacades(response.data.data);
      })
      .catch((error) => {
        console.error("خطأ في جلب الواجهات:", error);
      });
  }, []);

  // جلب بيانات العقار عند تحميل الصفحة
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get(`/properties/${id}`);
        const property = response.data.data.property;
        const projectsResponse = await axiosInstance.get("/user/projects");
        const projects = projectsResponse.data.data.user_projects;
        setProjects(projects);

        // البحث عن المشروع المطابق
        const matchedProject = projects.find(
          (p) => p.id === property.project_id,
        );

        setFormData({
          ...formData,
          project_id: matchedProject ? matchedProject.id.toString() : "",
          title: property.title || "",
          category_id: property.category_id || "",
          description: property.description || "",
          address: property.address || "",
          price: property.price || "",
          type: property.type || "",
          transaction_type: property.transaction_type || "",
          bedrooms: property.beds?.toString() || "",
          bathrooms: property.bath?.toString() || "",
          area: property.area?.toString() || "",
          features: property.features?.join(", ") || "",
          status: property.status === 1 ? "published" : "draft",
          featured: property.featured || false,
          latitude: property.latitude || 24.766316905850978,
          longitude: property.longitude || 46.73579692840576,
          category: property.category_id?.toString() || "",
          size: property.size?.toString() || "",
          length: property.length?.toString() || "",
          width: property.width?.toString() || "",
          facade_id: property.facade_id?.toString() || "",
          street_width_north: property.street_width_north?.toString() || "",
          street_width_south: property.street_width_south?.toString() || "",
          street_width_east: property.street_width_east?.toString() || "",
          street_width_west: property.street_width_west?.toString() || "",
          building_age: property.building_age?.toString() || "",
          rooms: property.rooms?.toString() || "",
          floors: property.floors?.toString() || "",
          floor_number: property.floor_number?.toString() || "",
          driver_room: property.driver_room?.toString() || "",
          maid_room: property.maid_room?.toString() || "",
          dining_room: property.dining_room?.toString() || "",
          living_room: property.living_room?.toString() || "",
          majlis: property.majlis?.toString() || "",
          storage_room: property.storage_room?.toString() || "",
          basement: property.basement?.toString() || "",
          swimming_pool: property.swimming_pool?.toString() || "",
          kitchen: property.kitchen?.toString() || "",
          balcony: property.balcony?.toString() || "",
          garden: property.garden?.toString() || "",
          annex: property.annex?.toString() || "",
          elevator: property.elevator?.toString() || "",
          private_parking: property.private_parking?.toString() || "",
          city_id: property.city_id,
          district_id: property.state_id,
        });
        setPreviews({
          thumbnail: property.featured_image || null,
          gallery: property.gallery || [],
          floorPlans: property.floor_planning_image || [],
        });
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب بيانات العقار. يرجى المحاولة مرة أخرى.");
      }
    };
    fetchProperty();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMapPositionChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };
  const years = [];
  for (let year = 2030; year >= 1925; year--) {
    years.push(year);
  }
  const triggerFileInput = (type: "thumbnail" | "gallery" | "floorPlans") => {
    if (type === "thumbnail" && thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
    } else if (type === "gallery" && galleryInputRef.current) {
      galleryInputRef.current.click();
    } else if (type === "floorPlans" && floorPlansInputRef.current) {
      floorPlansInputRef.current.click();
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "gallery" | "floorPlans",
  ) => {
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
          toast.error("يرجى تحميل ملفات صور فقط (JPG, PNG, GIF)");
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
      toast.success("تم بنجاح");
    }

    e.target.value = "";
  };

  const removeImage = (
    type: "thumbnail" | "gallery" | "floorPlans",
    index?: number,
  ) => {
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
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "إسم العقار مطلوب";
    if (!formData.description) newErrors.description = "وصف العقار مطلوب";
    // if (!formData.address) newErrors.address = "عنوان العقار مطلوب";
    // if (!formData.price) newErrors.price = "السعر مطلوب";
    // if (!formData.type) newErrors.type = "نوع العقار مطلوب";
    // if (!formData.transaction_type)
    // newErrors.transaction_type = "نوع القائمة مطلوب";
    // if (!formData.bedrooms) newErrors.bedrooms = "عدد غرف النوم مطلوب";
    // if (!formData.bathrooms) newErrors.bathrooms = "عدد الحمامات مطلوب";
    // if (!formData.area) newErrors.area = "مساحة العقار مطلوبة";
    // if (!formData.features) newErrors.features = "ميزات العقار مطلوبة";
    if (!previews.thumbnail && !images.thumbnail)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
    // if (previews.gallery.length === 0 && images.gallery.length === 0)
    // newErrors.gallery = "يجب إضافة صورة واحدة على الأقل في معرض الصور";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (validateForm()) {
      setSubmitError(null); // إعادة تعيين رسالة الخطأ عند كل محاولة
      setIsLoading(true);
      setUploading(true);

      try {
        let thumbnailUrl: string | null = null;
        let galleryUrls: string[] = [];
        let floorPlansUrls: string[] = [];

        if (images.thumbnail) {
          const uploadedFile = await uploadSingleFile(
            images.thumbnail,
            "property",
          );
          thumbnailUrl = uploadedFile.url;
        }

        if (images.gallery.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.gallery,
            "property",
          );
          galleryUrls = uploadedFiles.map((f) => f.url);
        }

        if (images.floorPlans.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.floorPlans,
            "property",
          );
          floorPlansUrls = uploadedFiles.map((f) => f.url);
        }
        const propertyData = {
          title: formData.title,
          address: formData.address,
          price: formData.price,

          project_id: formData.project_id,
          category_id: parseInt(formData.category),
          type: formData.type,

          beds: parseInt(formData.bedrooms),
          bath: parseInt(formData.bathrooms),
          area: parseInt(formData.area),
          features: formData.features.split(",").map((f) => f.trim()),
          status: publish ? 1 : 0,
          featured_image: thumbnailUrl || previews.thumbnail,
          floor_planning_image:
            floorPlansUrls.length > 0 ? floorPlansUrls : previews.floorPlans,
          gallery: galleryUrls.length > 0 ? galleryUrls : previews.gallery,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          featured: formData.featured,
          city_id: formData.city_id,
          state_id: formData.district_id,
          size: parseInt(formData.size) || 0,
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          facade_id: parseInt(formData.facade_id) || 0,
          street_width_north: parseFloat(formData.street_width_north) || 0,
          street_width_south: parseFloat(formData.street_width_south) || 0,
          street_width_east: parseFloat(formData.street_width_east) || 0,
          street_width_west: parseFloat(formData.street_width_west) || 0,
          building_age: parseFloat(formData.building_age) || 0,
          rooms: parseInt(formData.rooms) || 0,
          floors: parseInt(formData.floors) || 0,
          floor_number: parseInt(formData.floor_number) || 0,
          driver_room: parseInt(formData.driver_room) || 0,
          maid_room: parseInt(formData.maid_room) || 0,
          dining_room: parseInt(formData.dining_room) || 0,
          living_room: parseInt(formData.living_room) || 0,
          majlis: parseInt(formData.majlis) || 0,
          storage_room: parseInt(formData.storage_room) || 0,
          basement: parseInt(formData.basement) || 0,
          swimming_pool: parseInt(formData.swimming_pool) || 0,
          kitchen: parseInt(formData.kitchen) || 0,
          balcony: parseInt(formData.balcony) || 0,
          garden: parseInt(formData.garden) || 0,
          annex: parseInt(formData.annex) || 0,
          elevator: parseInt(formData.elevator) || 0,
          private_parking: parseInt(formData.private_parking) || 0,
        };
        const response = await axiosInstance.post(
          `/properties/${id}`,
          propertyData,
        );
        toast.success(
          publish ? "تم تحديث ونشر العقار بنجاح" : "تم حفظ التغييرات كمسودة",
        );
        setIsLoading(false);
        const currentState = useStore.getState();
        const updatedProperty = response.data.property;
        updatedProperty.status =
          updatedProperty.status === 1 ? "منشور" : "مسودة";
        const updatedProperties =
          currentState.propertiesManagement.properties.map((prop) =>
            prop.id === updatedProperty.id ? updatedProperty : prop,
          );
        setPropertiesManagement({
          properties: updatedProperties,
        });

        router.push("/properties");
      } catch (error) {
        setSubmitError("حدث خطأ أثناء حفظ العقار. يرجى المحاولة مرة أخرى.");
        console.error("Error updating property:", error);
        setIsLoading(false);
        toast.error("حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.");
      } finally {
        setUploading(false);
        setIsLoading(false);
      }
    } else {
      setSubmitError("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      toast.error("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
    }
  };

  const handleCounterChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitySelect = (cityId) => {
    setFormData((prev) => ({ ...prev, city_id: cityId, district_id: null }));
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
                  تعديل العقار
                </h1>
              </div>
              <div className="flex gap-2 flex-col">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleSubmit(false)}>
                    حفظ التغييرات كمسودة
                  </Button>
                  <Button onClick={() => handleSubmit(true)}>
                    حفظ ونشر التغييرات
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
                    <Label htmlFor="title">إسم العقار</Label>
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
                      <Label htmlFor="type">نوع القائمة</Label>
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
                          <SelectItem value="sale">للبيع</SelectItem>
                          <SelectItem value="rent">للإيجار</SelectItem>
                          <SelectItem value="sold">مباعة</SelectItem>
                          <SelectItem value="rented">مؤجرة</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-red-500">{errors.type}</p>
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

                  <div className="space-y-4 z-9999">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="city" className="mb-1">
                          اختر المدينة
                        </Label>
                        <CitySelector
                          selectedCityId={formData.city_id}
                          onCitySelect={handleCitySelect}
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="neighborhood" className="mb-1">
                          اختر الحي
                        </Label>
                        <DistrictSelector
                          selectedCityId={formData.city_id}
                          selectedDistrictId={formData.district_id}
                          onDistrictSelect={(districtId) =>
                            setFormData((prev) => ({
                              ...prev,
                              district_id: districtId,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل العقار</CardTitle>
                  <CardDescription>أدخل مواصفات وميزات العقار</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {/* <div className="space-y-2">
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
                      {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms}</p>}
                    </div> */}

                    {/* <div className="space-y-2">
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
                      {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms}</p>}
                    </div> */}
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

                  <div className="flex items-center space-x-2 pt-4 gap-2">
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

                  {/* الخصائص - Property Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">
                      الخصائص
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size">المساحة</Label>
                        <Input
                          id="size"
                          name="size"
                          value={formData.size}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          قدم مربع
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">طول القطعة</Label>
                        <Input
                          id="length"
                          name="length"
                          value={formData.length}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="width">عرض القطعة</Label>
                        <Input
                          id="width"
                          name="width"
                          value={formData.width}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facade_id">الواجهة</Label>
                        <Select
                          value={formData.facade_id?.toString() || ""}
                          onValueChange={(value) =>
                            handleSelectChange("facade_id", value)
                          }
                        >
                          <SelectTrigger id="facade_id" dir="rtl">
                            <SelectValue placeholder="اختر الواجهة" />
                          </SelectTrigger>
                          <SelectContent>
                            {facades.map((facade) => (
                              <SelectItem
                                key={facade.id}
                                value={facade.id.toString()}
                              >
                                {facade.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street_width_north">
                          عرض الشارع الشمالي
                        </Label>
                        <Input
                          id="street_width_north"
                          name="street_width_north"
                          value={formData.street_width_north}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street_width_south">
                          عرض الشارع الجنوبي
                        </Label>
                        <Input
                          id="street_width_south"
                          name="street_width_south"
                          value={formData.street_width_south}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street_width_east">
                          عرض الشارع الشرقي
                        </Label>
                        <Input
                          id="street_width_east"
                          name="street_width_east"
                          value={formData.street_width_east}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street_width_west">
                          عرض الشارع الغربي
                        </Label>
                        <Input
                          id="street_width_west"
                          name="street_width_west"
                          value={formData.street_width_west}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyDigits = e.currentTarget.value.replace(
                              /\D/g,
                              "",
                            );
                            handleInputChange({
                              // نمرر نفس الحدث لكن بقيمة منقحة
                              target: {
                                name: e.currentTarget.name,
                                value: onlyDigits,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="building_age">سنة البناء</Label>
                        <Select
                          value={formData.building_age}
                          onValueChange={(value) =>
                            handleSelectChange("building_age", value)
                          }
                        >
                          <SelectTrigger id="building_age" dir="rtl">
                            <SelectValue placeholder="اختر سنة البناء" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {/* مرافق العقار - Property Features */}
                  <div className="space-y-4  whitespace-nowraps">
                    <h3 className="text-lg font-semibold text-right">
                      مرافق العقار
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 whitespace-nowraps ">
                      <PropertyCounter
                        label="الغرف"
                        value={formData.rooms}
                        onChange={(value) =>
                          handleCounterChange("rooms", value)
                        }
                      />
                      <PropertyCounter
                        label="الأدوار"
                        value={formData.floors}
                        onChange={(value) =>
                          handleCounterChange("floors", value)
                        }
                      />
                      <PropertyCounter
                        label="رقم الدور"
                        value={formData.floor_number}
                        onChange={(value) =>
                          handleCounterChange("floor_number", value)
                        }
                      />
                      <PropertyCounter
                        label="غرفة السائق"
                        value={formData.driver_room}
                        onChange={(value) =>
                          handleCounterChange("driver_room", value)
                        }
                      />

                      <PropertyCounter
                        label="غرفة الخادمات"
                        value={formData.maid_room}
                        onChange={(value) =>
                          handleCounterChange("maid_room", value)
                        }
                      />
                      <PropertyCounter
                        label="غرفة الطعام"
                        value={formData.dining_room}
                        onChange={(value) =>
                          handleCounterChange("dining_room", value)
                        }
                      />
                      <PropertyCounter
                        label="الصالة"
                        value={formData.living_room}
                        onChange={(value) =>
                          handleCounterChange("living_room", value)
                        }
                      />
                      <PropertyCounter
                        label="المجلس"
                        value={formData.majlis}
                        onChange={(value) =>
                          handleCounterChange("majlis", value)
                        }
                      />

                      <PropertyCounter
                        label="المخزن"
                        value={formData.storage_room}
                        onChange={(value) =>
                          handleCounterChange("storage_room", value)
                        }
                      />
                      <PropertyCounter
                        label="القبو"
                        value={formData.basement}
                        onChange={(value) =>
                          handleCounterChange("basement", value)
                        }
                      />
                      <PropertyCounter
                        label="المسبح"
                        value={formData.swimming_pool}
                        onChange={(value) =>
                          handleCounterChange("swimming_pool", value)
                        }
                      />
                      <PropertyCounter
                        label="المطبخ"
                        value={formData.kitchen}
                        onChange={(value) =>
                          handleCounterChange("kitchen", value)
                        }
                      />

                      <PropertyCounter
                        label="الشرفة"
                        value={formData.balcony}
                        onChange={(value) =>
                          handleCounterChange("balcony", value)
                        }
                      />
                      <PropertyCounter
                        label="الحديقة"
                        value={formData.garden}
                        onChange={(value) =>
                          handleCounterChange("garden", value)
                        }
                      />
                      <PropertyCounter
                        label="الملحق"
                        value={formData.annex}
                        onChange={(value) =>
                          handleCounterChange("annex", value)
                        }
                      />
                      <PropertyCounter
                        label="المصعد"
                        value={formData.elevator}
                        onChange={(value) =>
                          handleCounterChange("elevator", value)
                        }
                      />

                      <PropertyCounter
                        label="موقف سيارة مخصص"
                        value={formData.private_parking}
                        onChange={(value) =>
                          handleCounterChange("private_parking", value)
                        }
                      />
                    </div>
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
                        disabled={uploading}
                      >
                        <div className="flex items-center gap-2">
                          {uploading ? (
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
                          {uploading ? (
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
                          {uploading ? (
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
                <CardFooter className="flex justify-between border-t p-6">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/properties")}
                  >
                    إلغاء
                  </Button>
                  <div className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSubmit(false)}
                      >
                        حفظ التغييرات كمسودة
                      </Button>
                      <Button
                        onClick={() => handleSubmit(true)}
                        disabled={isLoading}
                      >
                        {isLoading ? "جاري الحفظ..." : "حفظ ونشر التغييرات"}
                      </Button>
                    </div>
                    {submitError && (
                      <div className="text-red-500 text-sm mt-2">
                        {submitError}
                      </div>
                    )}
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
