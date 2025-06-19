"use client";

import {
  Download,
  Filter,
  Grid3X3,
  List,
  Search,
  Star,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useStore from "@/context/Store"; 

export function AppsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("apps");
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, error } = sidebarData;
  const categories = [
    "الكل",
    "نماذج",
    "تسويق",
    "اجتماعي",
    "تحليلات",
    "تجارة إلكترونية",
    "اتصالات",
    "قانوني",
    "وسائط",
    "أعمال",
  ];

  const [installedApps, setInstalledApps] = useState(
    apps.filter((app) => app.installed),
  );

  useEffect(() => {
    const fetchApps = async () => {
      const loadingToast = toast.loading("جاري تحميل التطبيقات...");
      try {
        const res = await axiosInstance.get("/apps");
        const fetchedApps = res.data.data.apps;
        setApps(fetchedApps);

        const installed = fetchedApps.filter((app) => app.installed === true);
        setInstalledApps(installed);

        toast.dismiss(loadingToast);
        toast.success("تم تحميل التطبيقات بنجاح");
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error("فشل في تحميل التطبيقات");
        console.error("Failed to load apps:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleInstall = async (appId: string) => {
    const loadingToast = toast.loading("جاري تثبيت التطبيق...");
    try {
      await axiosInstance.post("/apps/install", {
        app_id: Number(appId),
      });

      const updatedApps = apps.map((app) => {
        if (app.id === appId) {
          return { ...app, installed: true };
        }
        return app;
      });

      setApps(updatedApps);

      const updatedInstalledApps = updatedApps.filter(
        (app) => app.installed === true,
      );
      setInstalledApps(updatedInstalledApps);

      fetchSideMenus("apps");
      toast.dismiss(loadingToast);
      toast.success("تم تثبيت التطبيق بنجاح");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("فشل في تثبيت التطبيق");
      console.error("فشل في تثبيت التطبيق:", error);
    }
  };

  const handleUninstall = async (appId: string) => {
    const loadingToast = toast.loading("جاري إزالة التطبيق...");
    try {
      await axiosInstance.post(`/apps/uninstall/${appId}`);

      const updatedApps = apps.map((app) => {
        if (app.id === appId) {
          return { ...app, installed: false };
        }
        return app;
      });

      setApps(updatedApps);

      const updatedInstalledApps = updatedApps.filter(
        (app) => app.installed === true,
      );
      setInstalledApps(updatedInstalledApps);
      fetchSideMenus("apps");

      toast.dismiss(loadingToast);
      toast.success("تم إزالة التطبيق بنجاح");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("فشل في إزالة التطبيق");
      console.error("فشل في إزالة تثبيت التطبيق:", error);
    }
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  if (loading) {
    return <div className="p-6 text-center">جاري تحميل التطبيقات...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  التطبيقات والتكاملات
                </h1>
                <p className="text-muted-foreground">
                  تعزيز موقعك بتطبيقات وتكاملات قوية
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
                  <span className="sr-only">عرض الشبكة</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">عرض القائمة</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      تصفية
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تصفية التطبيقات</DialogTitle>
                      <DialogDescription>
                        تضييق نطاق التطبيقات حسب معايير محددة
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">السعر</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            مجاني
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            مدفوع
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            اشتراك
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">التقييم</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            4+ نجوم
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            3+ نجوم
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            جميع التقييمات
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">الميزات</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            مميز
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            جديد
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            شائع
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">إعادة تعيين</Button>
                      <Button>تطبيق الفلاتر</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن التطبيقات..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all">
              {/* <TabsList className="flex w-full overflow-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category === "الكل" ? "all" : category.toLowerCase()}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList> */}

              <TabsContent value="all" className="mt-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    التطبيقات المثبتة
                  </h2>
                  {installedApps.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <h3 className="text-lg font-medium">
                        لم يتم تثبيت أي تطبيقات حتى الآن
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        تصفح سوق التطبيقات أدناه للعثور على تطبيقات لموقعك
                      </p>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {installedApps.map((app) => (
                        <AppCard
                          key={app.id}
                          app={app}
                          onInstall={handleInstall}
                          onUninstall={handleUninstall}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {installedApps.map((app) => (
                        <AppListItem
                          key={app.id}
                          app={app}
                          onInstall={handleInstall}
                          onUninstall={handleUninstall}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">سوق التطبيقات</h2>
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredApps
                        .filter(
                          (app) =>
                            !installedApps.some(
                              (installed) => installed.id === app.id,
                            ),
                        )
                        .map((app) => (
                          <AppCard
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApps
                        .filter(
                          (app) =>
                            !installedApps.some(
                              (installed) => installed.id === app.id,
                            ),
                        )
                        .map((app) => (
                          <AppListItem
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {categories.slice(1).map((category) => (
                <TabsContent
                  key={category}
                  value={category.toLowerCase()}
                  className="mt-6"
                >
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredApps
                        .filter((app) => app.category === category)
                        .map((app) => (
                          <AppCard
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApps
                        .filter((app) => app.category === category)
                        .map((app) => (
                          <AppListItem
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

interface AppProps {
  app: any;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}

function AppCard({ app, onInstall, onUninstall }: AppProps) {
  const isInstalled = app.installed || false;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md border p-1 h-12 w-12 flex items-center justify-center">
              <img
                src={app.icon || "/placeholder.svg"}
                alt={app.name}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-base">{app.name}</CardTitle>
              <CardDescription className="text-xs">
                بواسطة {app.developer}
              </CardDescription>
            </div>
          </div>
          {app.featured && (
            <Badge variant="secondary" className="text-xs">
              مميز
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {app.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{app.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({app.reviews})
            </span>
          </div>
          <Badge variant={app.price === "مجاني" ? "outline" : "secondary"}>
            {app.price}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {isInstalled ? (
          <>
            <Button variant="outline" size="sm" className="w-full">
              تكوين
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onUninstall(app.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="w-full gap-1"
            onClick={() => onInstall(app.id)}
          >
            <Download className="h-4 w-4" />
            تثبيت
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AppListItem({ app, onInstall, onUninstall }: AppProps) {
  const isInstalled = app.installed || false;

  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="p-4 sm:w-64 flex items-center gap-3">
          <div className="rounded-md border p-1 h-12 w-12 flex items-center justify-center">
            <img
              src={app.icon || "/placeholder.svg"}
              alt={app.name}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h3 className="font-medium">{app.name}</h3>
            <p className="text-xs text-muted-foreground">
              بواسطة {app.developer}
            </p>
          </div>
        </div>
        <div className="flex-1 p-4 border-t sm:border-t-0 sm:border-r">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{app.description}</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{app.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({app.reviews})
                  </span>
                </div>
                <Badge
                  variant={app.price === "مجاني" ? "outline" : "secondary"}
                >
                  {app.price}
                </Badge>
                {app.featured && (
                  <Badge variant="secondary" className="text-xs">
                    مميز
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {app.category}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              {isInstalled ? (
                <>
                  <Button variant="outline" size="sm">
                    تكوين
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onUninstall(app.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={() => onInstall(app.id)}
                >
                  <Download className="h-4 w-4" />
                  تثبيت
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
