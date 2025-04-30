"use client";
import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Bath,
  Bed,
  Building,
  Copy,
  Edit,
  ExternalLink,
  Filter,
  Grid3X3,
  Heart,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Ruler,
  Share2,
  Trash2,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";

function SkeletonPropertyCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-gray-300"></div>
      </div>
      <CardHeader className="p-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="h-8 w-full bg-gray-300 rounded"></div>
        <div className="h-8 w-full bg-gray-300 rounded"></div>
      </CardFooter>
    </Card>
  );
}

export function PropertiesManagementPage() {
  // حالة للتحكم في فتح وإغلاق النافذة المنبثقة
  const [isLimitReached, setIsLimitReached] = useState(false);
  const { clickedONSubButton } = useAuthStore();

  const router = useRouter();
  const {
    propertiesManagement: {
      viewMode,
      priceRange,
      favorites,
      properties,
      loading,
      error,
      isInitialized,
    },
    setPropertiesManagement,
    fetchProperties,
  } = useStore();

  const normalizeStatus = (status) => {
    if (status === "1" || status === 1) return "منشور";
    if (status === "0" || status === 0) return "مسودة";
    return status;
  };

  const clickedONButton = async () => {
    clickedONSubButton();
    router.push("/settings");
  };


  const normalizedProperties = useMemo(() => {
    return properties.map((property) => ({
      ...property,
      status: normalizeStatus(property.status),
    }));
  }, [properties]);

  const setViewMode = (mode: "grid" | "list") => {
    setPropertiesManagement({ viewMode: mode });
  };

  const handlePriceRangeChange = (newRange: number[]) => {
    setPropertiesManagement({ priceRange: newRange });
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setPropertiesManagement({ favorites: newFavorites });
  };

  const handleDeleteProperty = async (id: string) => {
    const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا العقار؟");
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`properties/${id}`);
        toast.success("تم حذف العقار بنجاح");
        setPropertiesManagement({
          properties: properties.filter((p) => p.id !== id),
        });
      } catch (error) {
        toast.error("فشل في حذف العقار");
        console.error("Error deleting property:", error);
      }
    }
  };

  useEffect(() => {
    if (!isInitialized && !loading) {
      fetchProperties();
    }
    console.log("Properties", properties);
  }, [fetchProperties, isInitialized, loading, properties]);

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <SkeletonPropertyCard key={idx} />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  إدارة العقارات
                </h1>
                <p className="text-muted-foreground">
                  أضف وأدرج قوائم العقارات لموقعك على الويب
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      فلتر
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>فلتر العقارات</DialogTitle>
                      <DialogDescription>
                        قم بتحسين البحث الخاص بك بمعايير محددة
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>نوع العقار</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "House",
                            "Apartment",
                            "Condo",
                            "Townhouse",
                            "Loft",
                          ].map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={`type-${type}`} />
                              <label htmlFor={`type-${type}`} />
                              <label
                                htmlFor={`type-${type}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>الحالة</Label>
                        <RadioGroup defaultValue="all">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="status-all" />
                            <Label htmlFor="status-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="for-sale"
                              id="status-for-sale"
                            />
                            <Label htmlFor="status-for-sale">For Sale</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="for-rent"
                              id="status-for-rent"
                            />
                            <Label htmlFor="status-for-rent">For Rent</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label>نطاق السعر</Label>
                          <span className="text-sm text-muted-foreground">
                            ${priceRange[0].toLocaleString()} - $
                            {priceRange[1].toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          defaultValue={priceRange}
                          max={2000000}
                          min={0}
                          step={10000}
                          onValueChange={handlePriceRangeChange}
                          className="py-4"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bedrooms">غرف النوم</Label>
                          <Select>
                            <SelectTrigger id="bedrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bathrooms">حمام</Label>
                          <Select>
                            <SelectTrigger id="bathrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="size">
                            الحد الأدنى للمساحة (قدم مربع)
                          </Label>
                          <Input id="size" type="number" placeholder="Any" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Reset</Button>
                      <Button>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  className="gap-1"
                  onClick={() => {
                    const propertiesLength = properties?.length || 0;
                    const limit =
                      useAuthStore.getState().userData
                        ?.real_estate_limit_number;
                    if (propertiesLength >= limit) {
                      setIsLimitReached(true); 
                    } else {
                      router.push("/properties/add");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  إضافة عقار
                </Button>
              </div>
            </div>

            {/* نافذة منبثقة عند الوصول للحد الأقصى */}
            <Dialog open={isLimitReached} onOpenChange={setIsLimitReached}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-red-500">
                    لقد وصلت للحد الأقصى للإضافة
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    برجاء ترقية الباقة لإضافة المزيد من العقارات.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLimitReached(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={clickedONButton}>
                    اشتراك
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {loading ? (
              renderSkeletons()
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">جميع العقارات</TabsTrigger>
                  <TabsTrigger value="for-sale">للبيع</TabsTrigger>
                  <TabsTrigger value="for-rent">للإيجار</TabsTrigger>
                  <TabsTrigger value="published">منشور</TabsTrigger>
                  <TabsTrigger value="drafts">مسودات</TabsTrigger>
                  <TabsTrigger value="featured">مميزة</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {normalizedProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(
                            property.id.toString(),
                          )}
                          onToggleFavorite={toggleFavorite}
                          onDelete={handleDeleteProperty}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {normalizedProperties.map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(
                            property.id.toString(),
                          )}
                          onToggleFavorite={toggleFavorite}
                          onDelete={handleDeleteProperty}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: any;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: PropertyCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={
              property.thumbnail ||
              property.featured_image ||
              "/placeholder.svg"
            }
            alt={property.title || property.contents[0].title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {property.featured && (
          <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            مميز
          </div>
        )}
        <div
          className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
            property.status === "منشور"
              ? "bg-green-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {property.status}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 bottom-2 rounded-full bg-background/80 hover:bg-background"
          onClick={() => onToggleFavorite(property.id)}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="sr-only">Toggle favorite</span>
        </Button>
      </div>
      <CardHeader className="p-4">
        <div className="flex flex-row-reverse items-start justify-between">
          <div>
            <CardTitle className="whitespace-nowrap">
              {property.title || property.contents[0].title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground flex flex-row-reverse items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.address || property.contents[0].address}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() =>
                  router.push("/properties/" + property.id + "/edit")
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const domain = useAuthStore.getState().userData?.domain || "";
                  const url = domain.startsWith("http")
                    ? `${domain}property/${property.title}`
                    : `https://${domain}/property/${property.title}`;
                  window.open(url, "_blank");
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                معاينة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                مضاعفة
              </DropdownMenuItem>
              {property.status === "مسودة" ? (
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  نشر
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  إلغاء النشر
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                شارك
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(property.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف العقار
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="text-lg font-semibold flex flex-row-reverse gap-1">
          {property.transaction_type === "sale" ? (
            <>
              <span>بسعر {property.price.toLocaleString()}</span>
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-5 h-5 filter brightness-0 contrast-100"
              />
            </>
          ) : (
            <>
              <span>بسعر {property.price.toLocaleString()}</span>
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-5 h-5 filter brightness-0 contrast-100"
              />
              <span>شهر/</span>
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm ">
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">غرفة</span>
            <span className="font-medium flex flex-row-reverse items-center gap-1">
              <Bed className="h-3 w-3" />
              {property.beds}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">حمام</span>
            <span className="font-medium flex flex-row-reverse items-center gap-1">
              <Bath className="h-3 w-3" /> {property.bath}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">مساحة</span>
            <span className="font-medium flex flex-row-reverse items-center gap-1">
              <Ruler className="h-3 w-3" /> {property.area || property.size} m²
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {property.features
            ?.slice(0, 3)
            .map((feature: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              >
                {feature}
              </span>
            ))}
          {property.features?.length > 3 && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              +{property.features?.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row-reverse gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1"
          onClick={() => router.push("/properties/" + property.id + "/edit")}
        >
          <Edit className="h-3.5 w-3.5" />
          تعديل
        </Button>
        <Button size="sm" variant="secondary" className="w-full gap-1"
                        onClick={() => {
                          const domain = useAuthStore.getState().userData?.domain || "";
                          const url = domain.startsWith("http")
                            ? `${domain}property/${property.slug}`
                            : `https://${domain}/property/${property.slug}`;
                          window.open(url, "_blank");
                        }}
                        >
          <ExternalLink className="h-3.5 w-3.5" />
          معاينة
        </Button>
      </CardFooter>
    </Card>
  );
}

function PropertyListItem({
  property,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: PropertyCardProps) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row-reverse">
        <div className="relative sm:w-1/3 md:w-1/4">
          <div className="aspect-[16/9] sm:aspect-auto sm:h-full w-full overflow-hidden">
            <img
              src={
                property.thumbnail ||
                property.featured_image ||
                "/placeholder.svg"
              }
              alt={property.title || property.contents[0].title}
              className="h-full w-full object-cover"
            />
          </div>
          {property.featured && (
            <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              مميز
            </div>
          )}
          <div
            className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
              property.status === "منشور"
                ? "bg-green-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {property.status}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 bottom-2 rounded-full bg-background/80 hover:bg-background"
            onClick={() => onToggleFavorite(property.id)}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-row-reverse items-start justify-between">
            <div>
              <h3 className="font-semibold">
                {property.title || property.contents[0].title}
              </h3>
              <p className="text-sm text-muted-foreground flex flex-row-reverse items-center gap-1">
                <MapPin className="h-3 w-3" />{" "}
                {property.address || property.contents[0].address}
              </p>
            </div>
            <div className="text-lg font-semibold">
              {property.transaction_type === "sale" ? (
                <div className="flex items-center gap-1">
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-5 h-5 filter brightness-0 contrast-100"
                  />
                  <span>بسعر {property.price.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>شهر/</span>
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-5 h-5 filter brightness-0 contrast-100"
                  />
                  <span>بسعر {property.price.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex flex-row-reverse items-center gap-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{property.type}</span>
            </div>
            <div className="flex flex-row-reverse items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.beds} غرفة</span>
            </div>
            <div className="flex flex-row-reverse items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bath} حمام</span>
            </div>
            <div className="flex flex-row-reverse items-center gap-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{property.size || property.area} م² </span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {property.features.map((feature: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              >
                {feature}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-3.5 w-3.5" />
              تعديل
            </Button>
            <Button variant="secondary" size="sm"
                onClick={() => {
                              const domain = useAuthStore.getState().userData?.domain || "";
                              const url = domain.startsWith("http")
                                ? `${domain}property/${property.title}`
                                : `https://${domain}/property/${property.title}`;
                              window.open(url, "_blank");
                            }}
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              معاينة
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  مضاعفة
                </DropdownMenuItem>
                {property.status === "مسودة" ? (
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    نشر
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    إلغاء النشر
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  شارك
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(property.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
