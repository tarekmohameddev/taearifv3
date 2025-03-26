"use client";

import { useState,useEffect  } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Plus,
  Save,
  Trash2,
  MoveUp,
  MoveDown,
  ExternalLink,
  LinkIcon,
  Menu,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedSidebar } from "@/components/enhanced-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import toast from 'react-hot-toast';






interface MenuItem {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
  isActive: boolean;
  order: number;
  parentId: number | null;
  showOnMobile: boolean;
  showOnDesktop: boolean;
}

interface MenuSettings {
  menuPosition: 'top' | 'left' | 'right';
  menuStyle: 'buttons' | 'underline' | 'minimal';
  mobileMenuType: 'hamburger' | 'sidebar' | 'fullscreen';
  isSticky: boolean;
  isTransparent: boolean;
}







export default function MenuManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<MenuSettings>({
    menuPosition: 'top',
    menuStyle: 'buttons',
    mobileMenuType: 'hamburger',
    isSticky: true,
    isTransparent: false,
  });

  const [newMenuItem, setNewMenuItem] = useState({
    label: "",
    url: "",
    isExternal: false,
    isActive: true,
    parentId: null,
    showOnMobile: true,
    showOnDesktop: true,
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  
  
  useEffect(() => {
    console.log(`settings`,settings)
    
  }, [settings]);

  
  
  
  
  
  
  const topLevelItems = menuItems
    .filter((item) => item.parentId === null)
    .sort((a, b) => a.order - b.order);

  // Get child items for a parent
  const getChildItems = (parentId) => {
    return menuItems
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  };

  // Add new menu item
  const handleAddMenuItem = () => {
    if (newMenuItem.label.trim() === "" || newMenuItem.url.trim() === ""){
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      console.log("error")
      console.log("newMenuItem",newMenuItem)
      return;
    }
    
    const newItem = {
      ...newMenuItem,
      id: Date.now(),
      order: topLevelItems.length + 1,
    };

    setMenuItems([...menuItems, newItem]);
    toast.success("تمت إضافة عنصر القائمة بنجاح");

    setNewMenuItem({
      label: "",
      url: "",
      isExternal: false,
      isActive: true,
      parentId: null,
      showOnMobile: true,
      showOnDesktop: true,
    });
  };

  const handleRemoveMenuItem = (id: number) => {
    const itemsToDelete = [id, ...menuItems.filter(item => item.parentId === id).map(item => item.id)];
    setMenuItems(menuItems.filter(item => !itemsToDelete.includes(item.id)));
    toast.success("تم حذف عنصر القائمة بنجاح");
  };



  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = toast.loading("جاري تحميل بيانات القائمة...");
      try {
        const response = await axiosInstance.get('/content/menu');
        setMenuItems(response.data.data.menuItems);
        setSettings(response.data.data.settings);
        toast.success("تم تحميل بيانات القائمة بنجاح", { id: loadingToast });
      } catch (error) {
        toast.error("فشل في تحميل بيانات القائمة", { id: loadingToast });
      }
    };
    fetchData();
  }, []);


  const handleMoveItemUp = (id) => {
    const item = menuItems.find((item) => item.id === id);
    const itemsInSameLevel = menuItems
      .filter((i) => i.parentId === item.parentId)
      .sort((a, b) => a.order - b.order);
    const index = itemsInSameLevel.findIndex((i) => i.id === id);

    if (index <= 0) return;

    const updatedItems = [...menuItems];
    const currentItem = updatedItems.find((i) => i.id === id);
    const prevItem = updatedItems.find(
      (i) => i.id === itemsInSameLevel[index - 1].id,
    );

    const tempOrder = currentItem.order;
    currentItem.order = prevItem.order;
    prevItem.order = tempOrder;

    setMenuItems(updatedItems);
    toast.success("تم تحريك العنصر للأعلى");
  };

  const handleMoveItemDown = (id) => {
    const item = menuItems.find((item) => item.id === id);
    const itemsInSameLevel = menuItems
      .filter((i) => i.parentId === item.parentId)
      .sort((a, b) => a.order - b.order);
    const index = itemsInSameLevel.findIndex((i) => i.id === id);

    if (index >= itemsInSameLevel.length - 1) return;

    const updatedItems = [...menuItems];
    const currentItem = updatedItems.find((i) => i.id === id);
    const nextItem = updatedItems.find(
      (i) => i.id === itemsInSameLevel[index + 1].id,
    );

    const tempOrder = currentItem.order;
    currentItem.order = nextItem.order;
    nextItem.order = tempOrder;

    setMenuItems(updatedItems);
    toast.success("تم تحريك العنصر للأسفل");
  };

  const handleToggleActive = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
    toast.success("تم تغيير حالة العنصر");
  };

  const handleToggleMobile = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, showOnMobile: !item.showOnMobile } : item,
      ),
    );
    toast.success("تم تغيير إعدادات عرض الجوال");
  };

  const handleToggleDesktop = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, showOnDesktop: !item.showOnDesktop } : item,
      ),
    );
    toast.success("تم تغيير إعدادات عرض سطح المكتب");
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setMenuItems(
      menuItems.map((item) =>
        item.id === editingItem.id ? editingItem : item,
      ),
    );

    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast.success("تم حفظ التغييرات بنجاح");
  };

  const handleSave = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("جاري حفظ التغييرات...");
    
    try {
      const parentItems = menuItems.filter(item => item.parentId === null).sort((a, b) => a.order - b.order);
      const updatedItems = menuItems.map(item => {
        if (item.parentId === null) {
          const index = parentItems.findIndex(parent => parent.id === item.id);
          return { ...item, order: index + 1 };
        }
        return item;
      });

      const parentIds = [...new Set(updatedItems.filter(item => item.parentId !== null).map(item => item.parentId))];
      parentIds.forEach(parentId => {
        const children = updatedItems.filter(item => item.parentId === parentId).sort((a, b) => a.order - b.order);
        children.forEach((child, index) => {
          const childIndex = updatedItems.findIndex(item => item.id === child.id);
          if (childIndex !== -1) {
            updatedItems[childIndex].order = index + 1;
          }
        });
      });

      await axiosInstance.put('/content/menu', {
        menuItems: updatedItems,
        settings: settings,
      });

      toast.success("تم حفظ التغييرات بنجاح", { id: loadingToast });
    } catch (error) {
      toast.error("فشل في حفظ التغييرات", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMenuItem = (item) => {
    const children = getChildItems(item.id);

    return (
      <div key={item.id} className="border rounded-lg mb-3">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <span
                  className={`font-medium ${!item.isActive ? "text-muted-foreground" : ""}`}
                >
                  {item.label}
                </span>
                {item.isExternal && (
                  <ExternalLink className="h-3 w-3 mr-1 text-muted-foreground" />
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                <LinkIcon className="h-3 w-3 ml-1" />
                {item.url}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end mr-4">
                <div className="flex items-center mb-1">
                  <span className="text-xs ml-2">نشط</span>
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => handleToggleActive(item.id)}
                    size="sm"
                  />
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${item.showOnMobile ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    جوال
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${item.showOnDesktop ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    سطح المكتب
                  </span>
                </div>
              </div>

              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItemUp(item.id)}
                  className="h-8 w-8"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItemDown(item.id)}
                  className="h-8 w-8"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditItem(item)}
                  className="h-8 w-8"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveMenuItem(item.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {children.length > 0 && (
          <div className="border-t px-4 py-2 bg-muted/20">
            <div className="text-xs font-medium mb-2">العناصر الفرعية:</div>
            <div className="pr-4 border-r-2 border-muted">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="border rounded-lg mb-2 bg-background"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span
                            className={`font-medium ${!child.isActive ? "text-muted-foreground" : ""}`}
                          >
                            {child.label}
                          </span>
                          {child.isExternal && (
                            <ExternalLink className="h-3 w-3 mr-1 text-muted-foreground" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center">
                          <LinkIcon className="h-3 w-3 ml-1" />
                          {child.url}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end mr-4">
                          <div className="flex items-center mb-1">
                            <span className="text-xs ml-2">نشط</span>
                            <Switch
                              checked={child.isActive}
                              onCheckedChange={() =>
                                handleToggleActive(child.id)
                              }
                              size="sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${child.showOnMobile ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              جوال
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${child.showOnDesktop ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              سطح المكتب
                            </span>
                          </div>
                        </div>

                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveItemUp(child.id)}
                            className="h-8 w-8"
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveItemDown(child.id)}
                            className="h-8 w-8"
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditItem(child)}
                            className="h-8 w-8"
                          >
                            <Menu className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveMenuItem(child.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
                <h1 className="text-2xl font-bold">إدارة قائمة التنقل</h1>
                <p className="text-muted-foreground">
                  تخصيص روابط التنقل في موقعك
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

          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="menu">قائمة التنقل</TabsTrigger>
              <TabsTrigger value="settings">إعدادات القائمة</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إضافة عنصر جديد للقائمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="item-label">عنوان الرابط</Label>
                        <Input
                          id="item-label"
                          placeholder="مثال: من نحن"
                          value={newMenuItem.label}
                          onChange={(e) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              label: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="item-url">الرابط</Label>
                        <Input
                          id="item-url"
                          placeholder="مثال: /about"
                          value={newMenuItem.url}
                          onChange={(e) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              url: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="item-parent">
                          العنصر الأب (اختياري)
                        </Label>
                        <Select
                          value={
                            newMenuItem.parentId
                              ? newMenuItem.parentId.toString()
                              : "none"
                          }
                          onValueChange={(value) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              parentId:
                                value !== "none"
                                  ? Number.parseInt(value)
                                  : null,
                            })
                          }
                        >
                          <SelectTrigger id="item-parent">
                            <SelectValue placeholder="اختر العنصر الأب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">بدون عنصر أب</SelectItem>
                            {topLevelItems.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-external">رابط خارجي</Label>
                        <Switch
                          id="item-external"
                          checked={newMenuItem.isExternal}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              isExternal: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-active">نشط</Label>
                        <Switch
                          id="item-active"
                          checked={newMenuItem.isActive}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              isActive: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-mobile">إظهار على الجوال</Label>
                        <Switch
                          id="item-mobile"
                          checked={newMenuItem.showOnMobile}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              showOnMobile: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-desktop">
                          إظهار على سطح المكتب
                        </Label>
                        <Switch
                          id="item-desktop"
                          checked={newMenuItem.showOnDesktop}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              showOnDesktop: checked,
                            })
                          }
                        />
                      </div>

                      <Button
                        onClick={handleAddMenuItem}
                        className="w-full mt-6"
                      >
                        <Plus className="h-4 w-4 ml-1" /> إضافة عنصر للقائمة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>عناصر القائمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topLevelItems.map(renderMenuItem)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات القائمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menu-position">موضع القائمة</Label>
                <Select
                  value={settings.menuPosition}
                  onValueChange={(value: any) => setSettings({ ...settings, menuPosition: value })}
                >
                  <SelectTrigger id="menu-position">
                    <SelectValue placeholder="اختر موضع القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">أعلى الصفحة</SelectItem>
                    <SelectItem value="left">يسار الصفحة</SelectItem>
                    <SelectItem value="right">يمين الصفحة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menu-style">نمط القائمة</Label>
                <Select
                  value={settings.menuStyle}
                  onValueChange={(value: any) => setSettings({ ...settings, menuStyle: value })}
                >
                  <SelectTrigger id="menu-style">
                    <SelectValue placeholder="اختر نمط القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">قياسي</SelectItem>
                    <SelectItem value="buttons">أزرار</SelectItem>
                    <SelectItem value="underline">خط تحتي</SelectItem>
                    <SelectItem value="minimal">بسيط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile-menu-type">نوع قائمة الجوال</Label>
                <Select
                  value={settings.mobileMenuType}
                  onValueChange={(value: any) => setSettings({ ...settings, mobileMenuType: value })}
                >
                  <SelectTrigger id="mobile-menu-type">
                    <SelectValue placeholder="اختر نوع قائمة الجوال" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hamburger">قائمة همبرغر</SelectItem>
                    <SelectItem value="sidebar">قائمة منسدلة</SelectItem>
                    <SelectItem value="fullscreen">ملء الشاشة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sticky-menu">قائمة ثابتة عند التمرير</Label>
                <Switch
                  id="sticky-menu"
                  checked={settings.isSticky}
                  onCheckedChange={(checked) => setSettings({ ...settings, isSticky: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="transparent-menu">قائمة شفافة</Label>
                <Switch
                  id="transparent-menu"
                  checked={settings.isTransparent}
                  onCheckedChange={(checked) => setSettings({ ...settings, isTransparent: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

              <Card>
                <CardHeader>
                  <CardTitle>نصائح لتحسين قائمة التنقل</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pr-5 space-y-2 text-sm">
                    <li>استخدم عناوين واضحة وموجزة للروابط</li>
                    <li>حافظ على عدد العناصر الرئيسية بين 5-7 عناصر</li>
                    <li>رتب العناصر حسب الأهمية من اليمين إلى اليسار</li>
                    <li>استخدم القوائم المنسدلة فقط عند الضرورة</li>
                    <li>
                      تأكد من أن القائمة تعمل بشكل جيد على جميع أحجام الشاشات
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل عنصر القائمة</DialogTitle>
            <DialogDescription>
              قم بتعديل خصائص عنصر القائمة هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-label">عنوان الرابط</Label>
                <Input
                  id="edit-label"
                  value={editingItem.label}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, label: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-url">الرابط</Label>
                <Input
                  id="edit-url"
                  value={editingItem.url}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parent">العنصر الأب</Label>
                <Select
                  value={
                    editingItem.parentId
                      ? editingItem.parentId.toString()
                      : "none"
                  }
                  onValueChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      parentId:
                        value !== "none" ? Number.parseInt(value) : null,
                    })
                  }
                  disabled={getChildItems(editingItem.id).length > 0}
                >
                  <SelectTrigger id="edit-parent">
                    <SelectValue placeholder="اختر العنصر الأب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون عنصر أب</SelectItem>
                    {topLevelItems
                      .filter((item) => item.id !== editingItem.id)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {getChildItems(editingItem.id).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    لا يمكن تغيير العنصر الأب لأن هذا العنصر يحتوي على عناصر
                    فرعية.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-external">رابط خارجي</Label>
                <Switch
                  id="edit-external"
                  checked={editingItem.isExternal}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, isExternal: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-active">نشط</Label>
                <Switch
                  id="edit-active"
                  checked={editingItem.isActive}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, isActive: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-mobile">إظهار على الجوال</Label>
                <Switch
                  id="edit-mobile"
                  checked={editingItem.showOnMobile}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, showOnMobile: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-desktop">إظهار على سطح المكتب</Label>
                <Switch
                  id="edit-desktop"
                  checked={editingItem.showOnDesktop}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, showOnDesktop: checked })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
