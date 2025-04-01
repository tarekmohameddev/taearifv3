"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";

export default function CategoriesManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "تصميم الويب",
      slug: "web-design",
      description: "تصميمات مواقع ويب جميلة لجميع أنواع الشركات",
      isActive: true,
      order: 1,
    },
    {
      id: 2,
      name: "تطبيقات الجوال",
      slug: "mobile-apps",
      description: "تطبيقات مخصصة لنظامي iOS و Android",
      isActive: true,
      order: 2,
    },
    {
      id: 3,
      name: "الهوية البصرية",
      slug: "branding",
      description: "خدمات تصميم هوية بصرية كاملة",
      isActive: true,
      order: 3,
    },
    {
      id: 4,
      name: "تحسين محركات البحث",
      slug: "seo",
      description: "تحسين ظهور موقعك في نتائج البحث",
      isActive: false,
      order: 4,
    },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim() === "") return;

    const slug = newCategory.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.name,
        slug: slug,
        description: newCategory.description,
        isActive: true,
        order: categories.length + 1,
      },
    ]);

    setNewCategory({
      name: "",
      description: "",
    });
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleToggleActive = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, isActive: !category.isActive }
          : category,
      ),
    );
  };

  const handleMoveUp = (id) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index <= 0) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index - 1];
    newCategories[index - 1] = temp;

    // Update order values
    newCategories.forEach((category, i) => {
      category.order = i + 1;
    });

    setCategories(newCategories);
  };

  const handleMoveDown = (id) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index >= categories.length - 1) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + 1];
    newCategories[index + 1] = temp;

    // Update order values
    newCategories.forEach((category, i) => {
      category.order = i + 1;
    });

    setCategories(newCategories);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success toast
      alert("تم حفظ التصنيفات بنجاح!");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <EnhancedSidebar activeTab="content" />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/content">
                <Button variant="outline" size="icon" className="h-8 w-8 mr-2">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">التصنيفات</h1>
                <p className="text-muted-foreground">
                  إدارة تصنيفات المحتوى في موقعك
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">جاري الحفظ...</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="h-4 w-4 ml-1" />
                  حفظ التغييرات
                </span>
              )}
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إدارة التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                التصنيفات تساعد في تنظيم محتوى موقعك وتسهل على الزوار العثور على
                ما يبحثون عنه.
              </p>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveUp(category.id)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveDown(category.id)}
                            disabled={index === categories.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            الرابط: {category.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={category.isActive}
                            onCheckedChange={() =>
                              handleToggleActive(category.id)
                            }
                            id={`active-${category.id}`}
                          />
                          <Label
                            htmlFor={`active-${category.id}`}
                            className="text-sm"
                          >
                            {category.isActive ? "نشط" : "معطل"}
                          </Label>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{category.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة تصنيف جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">اسم التصنيف</Label>
                  <Input
                    id="category-name"
                    placeholder="مثال: تطوير الويب"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إنشاء الرابط تلقائيًا من اسم التصنيف.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-description">الوصف (اختياري)</Label>
                  <Textarea
                    id="category-description"
                    placeholder="وصف مختصر لهذا التصنيف"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="h-4 w-4 ml-1" /> إضافة تصنيف
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نصائح للتصنيفات الفعالة</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pr-5 space-y-2 text-sm">
                <li>استخدم أسماء تصنيفات قصيرة ووصفية</li>
                <li>استخدم تصنيفات منطقية ومفهومة للزوار</li>
                <li>لا تنشئ الكثير من التصنيفات - حافظ على البساطة</li>
                <li>رتب التصنيفات حسب الأهمية أو الشعبية</li>
                <li>
                  استخدم خاصية التفعيل/التعطيل لإخفاء التصنيفات مؤقتًا دون حذفها
                </li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
