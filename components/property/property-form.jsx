"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import { PropertyCounter } from "@/components/property/propertyCOMP/property-counter";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted rounded-md z-[-1]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
      </div>
    </div>
  ),
});

/**
 * @typedef {Object} PropertyFormProps
 * @property {'add' | 'edit'} mode
 */

/**
 * @param {PropertyFormProps} props 
 */
export default function PropertyForm({ mode }) {
  const { homepage: { setupProgressData, fetchSetupProgressData } } = useStore();
  const {
    propertiesManagement: { properties, loading, isInitialized },
    setPropertiesManagement,
    fetchProperties,
  } = useStore();
  const [submitError, setSubmitError] = useState(null);
  const { userData, fetchUserData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
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
    features: [],
    status: "draft",
    featured: false,
    latitude: 24.766316905850978,
    longitude: 46.73579692840576,
    city_id: null,
    district_id: null,
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
    private_parking: "",
    facade_id: "",
    length: "",
    width: "",
    street_width_north: "",
    street_width_south: "",
    street_width_east: "",
    street_width_west: "",
    building_age: "",
    payment_method: "",
    pricePerMeter: "",
    PropertyType: "",
  });

  const [currentFeature, setCurrentFeature] = useState("");
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
  const [facades, setFacades] = useState([]);

  const thumbnailInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const floorPlansInputRef = useRef(null);

  // جلب بيانات العقار للتعديل
  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchProperty = async () => {
        try {
          const response = await axiosInstance.get(`/properties/${id}`);
          const property = response.data.data.property;
          const projectsResponse = await axiosInstance.get("/user/projects");
          const projects = projectsResponse.data.data.user_projects;
          setProjects(projects);

          const matchedProject = projects.find(
            (p) => p.id === property.project_id,
          );

          // معالجة الميزات
          let featuresArray = [];
          if (property.features) {
            if (typeof property.features === 'string') {
              featuresArray = property.features
                .split(',')
                .map(feature => feature.trim())
                .filter(feature => feature.length > 0);
            } else if (Array.isArray(property.features)) {
              featuresArray = property.features;
            }
          }

          setFormData({
            ...formData,
            project_id: matchedProject ? matchedProject.id.toString() : "",
            title: property.title || "",
            category: property.category_id?.toString() || "",
            description: property.description || "",
            address: property.address || "",
            price: property.price || "",
            transaction_type: property.type || "",
            bedrooms: property.beds?.toString() || "",
            bathrooms: property.bath?.toString() || "",
            size: property.size?.toString() || "",
            features: featuresArray,
            status: property.status === 1 ? "published" : "draft",
            featured: property.featured || false,
            latitude: property.latitude || 24.766316905850978,
            longitude: property.longitude || 46.73579692840576,
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
            payment_method: property.payment_method || "",
            pricePerMeter: property.pricePerMeter || "",
            type: property.PropertyType || "",
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
    }
  }, [mode, id]);

  // جلب البيانات الأساسية
  useEffect(() => {
    if (mode === 'add' && !isInitialized && !loading) {
      fetchProperties();
    }
  }, [fetchProperties, isInitialized, loading, properties, mode]);

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/user/projects");
        setProjects(response.data.data.user_projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("حدث خطأ أثناء جلب المشاريع.");
      }
    };
    if (mode === 'add') {
      fetchProjects();
    }
  }, [mode]);

  // فحص الحد الأقصى للعقارات (للإضافة فقط)
  React.useEffect(() => {
    if (mode === 'add' &&
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
  }, [properties, router, mode]);

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

  const years = [];
  for (let year = 2030; year >= 1925; year--) {
    years.push(year);
  }

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

  const handleCounterChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "اسم العقار مطلوب";
    if (!formData.address) newErrors.address = "عنوان العقار مطلوب";
    if (mode === 'add' && !images.thumbnail)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
    if (mode === 'edit' && !previews.thumbnail && !images.thumbnail)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
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

        // رفع الصور للإضافة أو إذا تم تغييرها في التعديل
        if (images.thumbnail) {
          const uploadedFile = await uploadSingleFile(
            images.thumbnail,
            "property",
          );
          thumbnailPath = mode === 'add' 
            ? uploadedFile.path.replace("https://taearif.com", "")
            : uploadedFile.url;
        }

        if (images.gallery.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.gallery,
            "property",
          );
          galleryPaths = mode === 'add'
            ? uploadedFiles.map((f) => f.path.replace("https://taearif.com", ""))
            : uploadedFiles.map((f) => f.url);
        }

        if (images.floorPlans.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.floorPlans,
            "property",
          );
          floorPlansPaths = mode === 'add'
            ? uploadedFiles.map((f) => f.path.replace("https://taearif.com", ""))
            : uploadedFiles.map((f) => f.url);
        }

        const propertyData = {
          title: formData.title,
          address: formData.address,
          price: Number(formData.price),
          beds: parseInt(formData.bedrooms),
          bath: parseInt(formData.bathrooms),
          size: parseInt(formData.size),
          features: mode === 'add' 
            ? formData.features.join(", ")
            : formData.features,
          status: publish ? 1 : 0,
          featured_image: thumbnailPath || previews.thumbnail,
          floor_planning_image: floorPlansPaths.length > 0 ? floorPlansPaths : previews.floorPlans,
          gallery: galleryPaths.length > 0 ? galleryPaths : previews.gallery,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          featured: formData.featured,
          area: parseInt(formData.size),
          project_id: formData.project_id,
          purpose: formData.transaction_type,
          category_id: parseInt(formData.category),
          city_id: formData.city_id,
          state_id: formData.district_id,
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
          facade_id: parseInt(formData.facade_id) || 0,
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          street_width_north: parseFloat(formData.street_width_north) || 0,
          street_width_south: parseFloat(formData.street_width_south) || 0,
          street_width_east: parseFloat(formData.street_width_east) || 0,
          street_width_west: parseFloat(formData.street_width_west) || 0,
          building_age: parseFloat(formData.building_age) || 0,
          payment_method: formData.payment_method || null,
          pricePerMeter: formData.pricePerMeter || 0,
          type: formData.PropertyType || "",
        };

        let response;
        if (mode === 'add') {
          response = await axiosInstance.post("/properties", propertyData);
          toast.success("تم نشر العقار بنجاح");
          const currentState = useStore.getState();
          const createdProperty = response.data.user_property;
          createdProperty.status = createdProperty.status === true ? "منشور" : "مسودة";
          const updatedProperties = [createdProperty, ...currentState.propertiesManagement.properties];
          setPropertiesManagement({ properties: updatedProperties });
          
          // تحديث خطوات الإعداد
          const setpOB = { "step": "properties" };
          await axiosInstance.post("/steps/complete", setpOB);
          await fetchSetupProgressData();
        } else {
          response = await axiosInstance.post(`/properties/${id}`, propertyData);
          toast.success(publish ? "تم تحديث ونشر العقار بنجاح" : "تم حفظ التغييرات كمسودة");
          const currentState = useStore.getState();
          const updatedProperty = response.data.property;
          updatedProperty.status = updatedProperty.status === 1 ? "منشور" : "مسودة";
          const updatedProperties = currentState.propertiesManagement.properties.map((prop) =>
            prop.id === updatedProperty.id ? updatedProperty : prop,
          );
          setPropertiesManagement({ properties: updatedProperties });
        }

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

  const handleCitySelect = (cityId) => {
    setFormData((prev) => ({ ...prev, city_id: cityId, district_id: null }));
  };

  const pageTitle = mode === 'add' ? 'إضافة عقار جديد' : 'تعديل العقار';
  const submitButtonText = mode === 'add' ? 'نشر العقار' : 'حفظ ونشر التغييرات';
  const draftButtonText = mode === 'add' ? 'حفظ كمسودة' : 'حفظ التغييرات كمسودة';

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {mode === 'add' && hasReachedLimit && (
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
                  {pageTitle}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الحفظ..." : draftButtonText}
                  </Button>
                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الحفظ..." : submitButtonText}
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
                    <Label htmlFor="title">اسم العقار</Label>
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
                      <Label htmlFor="price">المبلغ</Label>
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
                      <Label htmlFor="payment_method">طريقة الدفع</Label>
                      <Select
                        name="payment_method"
                        value={formData.payment_method}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "payment_method", value },
                          })
                        }
                      >
                        <SelectTrigger
                          id="payment_method"
                          className={errors.payment_method ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر طريقة الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">شهري</SelectItem>
                          <SelectItem value="quarterly">ربع سنوي</SelectItem>
                          <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                          <SelectItem value="annual">سنوي</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.payment_method && (
                        <p className="text-sm text-red-500">
                          {errors.payment_method}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
  <Label htmlFor="pricePerMeter">سعر المتر</Label>
  <Input
    id="pricePerMeter"
    name="pricePerMeter"
    type="number"
    placeholder="750000"
    value={formData.pricePerMeter}
    onChange={handleInputChange}
    className={errors.pricePerMeter ? "border-red-500" : ""}
  />
  {errors.pricePerMeter && (
    <p className="text-sm text-red-500">{errors.pricePerMeter}</p>
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
                        className={errors.transaction_type ? "border-red-500" : ""}
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
                    {errors.transaction_type && (
                      <p className="text-sm text-red-500">
                        {errors.transaction_type}
                      </p>
                    )}
                  </div>
                  </div>



                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">فئة العقار</Label>
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
                          <SelectValue placeholder="اختر الفئة" />
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="PropertyType">نوع العقار</Label>
                    <Select
                      name="PropertyType"
                      value={formData.PropertyType}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "PropertyType", value },
                        })
                      }
                    >
                      <SelectTrigger
                        id="PropertyType"
                        className={errors.PropertyType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">سكني</SelectItem>
                        <SelectItem value="commercial">تجاري</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.PropertyType && (
                      <p className="text-sm text-red-500">
                        {errors.PropertyType}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل العقار</CardTitle>
                  <CardDescription>أدخل مواصفات وميزات العقار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featureInput">الميزات</Label>
                    <div className="flex gap-2">
                      <Input
                        id="featureInput"
                        placeholder="أدخل ميزة"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (
                              currentFeature.trim() !== "" &&
                              !formData.features.includes(currentFeature.trim())
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                features: [...prev.features, currentFeature.trim()],
                              }));
                              setCurrentFeature("");
                            }
                          }
                        }}
                        className={errors.features ? "border-red-500" : ""}
                      />
                      <Button
                        onClick={() => {
                          if (
                            currentFeature.trim() !== "" &&
                            !formData.features.includes(currentFeature.trim())
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              features: [...prev.features, currentFeature.trim()],
                            }));
                            setCurrentFeature("");
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.features && (
                      <p className="text-sm text-red-500">{errors.features}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label className="text-foreground">الميزات المضافة</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-200
                            px-2 sm:px-3 
                            py-1 sm:py-1.5
                            text-sm sm:text-base
                            rounded-full 
                            flex items-center gap-1 sm:gap-2
                            transition-all duration-200
                            hover:bg-gray-300 dark:hover:bg-gray-600
                            group
                          "
                        >
                          <span className="max-w-[100px] sm:max-w-none truncate">{feature}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                features: prev.features.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                            className="
                              h-auto w-auto p-0.5 sm:p-1
                              hover:bg-transparent
                              text-gray-500 dark:text-gray-400
                              hover:text-red-600 dark:hover:text-red-400
                              transition-colors duration-200
                            "
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {formData.features.length > 0 && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {formData.features.length} ميزة مضافة
                      </p>
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal = e.currentTarget.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split('.');
                            const validValue = parts.length > 2 
                              ? parts[0] + '.' + parts.slice(1).join('')
                              : numbersAndDecimal;
                            
                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
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
                  <div className="space-y-4 whitespace-nowraps">
                    <h3 className="text-lg font-semibold text-right">
                      مرافق العقار
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 whitespace-nowraps">
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
                            {isLoading ? "جاري الحفظ..." : draftButtonText}
                          </Button>
                          <Button
                            onClick={() => handleSubmit(true)}
                            disabled={isLoading}
                          >
                            {isLoading ? "جاري الحفظ..." : submitButtonText}
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