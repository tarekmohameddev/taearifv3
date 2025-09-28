import { ComponentInstance } from "@/lib/types";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";

// تعريف الصفحات المتاحة وأقسامها
export const PAGE_DEFINITIONS: Record<string, ComponentInstance[]> = {
  homepage: [
    {
      id: "header",
      type: "header",
      name: "Header",
      componentName: "header1",
      data: createDefaultData("header"),
    },
    {
      id: "hero",
      type: "hero",
      name: "Hero",
      componentName: "hero1",
      data: createDefaultData("hero"),
    },
    {
      id: "halfTextHalfImage",
      type: "halfTextHalfImage",
      name: "Half Text Half Image",
      componentName: "halfTextHalfImage1",
      data: createDefaultData("halfTextHalfImage"),
    },
    {
      id: "propertySlider",
      type: "propertySlider",
      name: "Property Slider",
      componentName: "propertySlider1",
      data: createDefaultData("propertySlider"),
    },
    {
      id: "ctaValuation",
      type: "ctaValuation",
      name: "CTA Valuation",
      componentName: "ctaValuation1",
      data: createDefaultData("ctaValuation"),
    },
  ],
};

// دالة الحصول على تعريف صفحة معينة
export const getPageDefinition = (
  pageSlug: string,
): ComponentInstance[] | undefined => {
  return PAGE_DEFINITIONS[pageSlug];
};

// دالة التحقق من وجود تعريف للصفحة
export const hasPageDefinition = (pageSlug: string): boolean => {
  return !!PAGE_DEFINITIONS[pageSlug];
};

// دالة الحصول على جميع أسماء الصفحات المعرفة
export const getDefinedPageNames = (): string[] => {
  return Object.keys(PAGE_DEFINITIONS);
};

// دالة إنشاء تعريف صفحة جديد
export const createPageDefinition = (
  pageSlug: string,
  components: ComponentInstance[],
): void => {
  PAGE_DEFINITIONS[pageSlug] = components;
};

// دالة حذف تعريف صفحة
export const removePageDefinition = (pageSlug: string): boolean => {
  if (PAGE_DEFINITIONS[pageSlug]) {
    delete PAGE_DEFINITIONS[pageSlug];
    return true;
  }
  return false;
};

// دالة تحديث تعريف صفحة موجودة
export const updatePageDefinition = (
  pageSlug: string,
  components: ComponentInstance[],
): boolean => {
  if (PAGE_DEFINITIONS[pageSlug]) {
    PAGE_DEFINITIONS[pageSlug] = components;
    return true;
  }
  return false;
};

// دالة الحصول على عدد المكونات في صفحة معينة
export const getPageComponentCount = (pageSlug: string): number => {
  const definition = getPageDefinition(pageSlug);
  return definition ? definition.length : 0;
};
