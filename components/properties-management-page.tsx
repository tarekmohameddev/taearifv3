"use client";

import { useState, useEffect } from "react";
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
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedSidebar } from "@/components/enhanced-sidebar";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store"; // استيراد useStore


// مكون SkeletonPropertyCard (لن يتغير شكله)
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
  const router = useRouter();
  const {
    propertiesManagement: {       
      viewMode,
      priceRange,
      favorites,
      properties,
      loading,
      error,
      isInitialized },
      setPropertiesManagement,
    fetchProperties,
  } = useStore();

  const setViewMode = (mode: "grid" | "list") => {
    setPropertiesManagement({ viewMode: mode });
  };

  // دالة تغيير نطاق السعر
  const handlePriceRangeChange = (newRange: number[]) => {
    setPropertiesManagement({ priceRange: newRange });
  };

  // دالة تبديل المفضلة
  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setPropertiesManagement({ favorites: newFavorites });
  };

  // جلب البيانات عند التحميل الأولي
  useEffect(() => {
    if (!isInitialized && !loading) {
      fetchProperties();
    }
  }, [fetchProperties, isInitialized, loading]);

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
                          onValueChange={handlePriceRangeChange} // تم التعديل هنا
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
                          <Label htmlFor="bathrooms">الحمامات</Label>
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
                            الحد الأدنى للحجم (قدم مربع)
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
                  onClick={() => (router.push("/properties/add"))}
                >
                  <Plus className="h-4 w-4" />
                  إضافة عقار
                </Button>
              </div>
            </div>

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
                      {properties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(
                            property.id.toString(),
                          )}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(
                            property.id.toString(),
                          )}
                          onToggleFavorite={toggleFavorite} // تم التعديل هنا
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="for-sale" className="mt-4">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {properties
                        .filter((property) => property.listingType === "للبيع")
                        .map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties
                        .filter((property) => property.listingType === "للبيع")
                        .map((property) => (
                          <PropertyListItem
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="for-rent" className="mt-4">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {properties
                        .filter(
                          (property) => property.listingType === "للإيجار",
                        )
                        .map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties
                        .filter(
                          (property) => property.listingType === "للإيجار",
                        )
                        .map((property) => (
                          <PropertyListItem
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="published" className="mt-4">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {properties
                        .filter((property) => property.status === "منشور")
                        .map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties
                        .filter((property) => property.status === "منشور")
                        .map((property) => (
                          <PropertyListItem
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="drafts" className="mt-4">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {properties
                        .filter((property) => property.status === "مسودة")
                        .map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties
                        .filter((property) => property.status === "مسودة")
                        .map((property) => (
                          <PropertyListItem
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="featured" className="mt-4">
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {properties
                        .filter((property) => property.featured)
                        .map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties
                        .filter((property) => property.featured)
                        .map((property) => (
                          <PropertyListItem
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString(),
                            )}
                            onToggleFavorite={(id) => toggleFavorite(id)}
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
}

function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={property.thumbnail || "/placeholder.svg"}
            alt={property.title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {property.featured && (
          <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Featured
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
          className="absolute right-2 bottom-2 rounded-full bg-background/80 hover:bg-background"
          onClick={() => onToggleFavorite(property.id)}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="sr-only">Toggle favorite</span>
        </Button>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="whitespace-nowrap">
              {property.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {property.address}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                تعديل القائمة
              </DropdownMenuItem>
              <DropdownMenuItem>
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
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                حذف القائمة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="text-lg font-semibold">
          {property.listingType === "للبيع"
            ? `$${property.price.toLocaleString()}`
            : `$${property.price.toLocaleString()}/شهر`}
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">الأسرة</span>
            <span className="font-medium flex items-center gap-1">
              <Bed className="h-3 w-3" /> {property.beds}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">الحمامات</span>
            <span className="font-medium flex items-center gap-1">
              <Bath className="h-3 w-3" /> {property.bath}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">حجم</span>
            <span className="font-medium flex items-center gap-1">
              <Ruler className="h-3 w-3" /> {property.area} ft²
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {property.features
            .slice(0, 3)
            .map((feature: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              >
                {feature}
              </span>
            ))}
          {property.features.length > 3 && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              +{property.features.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full gap-1">
          <Edit className="h-3.5 w-3.5" />
          تعديل
        </Button>
        <Button size="sm" variant="secondary" className="w-full gap-1">
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
}: PropertyCardProps) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-1/3 md:w-1/4">
          <div className="aspect-[16/9] sm:aspect-auto sm:h-full w-full overflow-hidden">
            <img
              src={property.thumbnail || "/placeholder.svg"}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
          {property.featured && (
            <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Featured
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
            className="absolute right-2 bottom-2 rounded-full bg-background/80 hover:bg-background"
            onClick={() => onToggleFavorite(property.id)}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {property.address}
              </p>
            </div>
            <div className="text-lg font-semibold">
              {property.listingType === "للبيع"
                ? `$${property.price.toLocaleString()}`
                : `$${property.price.toLocaleString()}/شهر`}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{property.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{property.size} ft²</span>
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
              Edit
            </Button>
            <Button variant="secondary" size="sm">
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Preview
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
                <DropdownMenuItem className="text-destructive focus:text-destructive">
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

