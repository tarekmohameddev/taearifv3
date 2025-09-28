import { AvailableSection } from "./types";
import { getComponentsBySection, COMPONENTS } from "@/lib-liveeditor/ComponentsList";

// تعريفات الأقسام المتاحة للإضافة من القائمة المركزية
export const AVAILABLE_SECTIONS: AvailableSection[] = getComponentsBySection("homepage").map(component => ({
  type: component.id,
  name: component.displayName,
  section: component.section,
  component: component.name,
  description: component.description,
}));

// أيقونات الأقسام من القائمة المركزية
export const SECTION_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(COMPONENTS).map(([key, component]) => [key, component.icon])
);

// الحصول على أيقونة القسم
export const getSectionIcon = (type: string): string => {
  return SECTION_ICONS[type] || "🎯";
};
