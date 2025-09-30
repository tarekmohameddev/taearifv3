import { v4 as uuidv4 } from "uuid";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";
import { PAGE_DEFINITIONS } from "@/lib-liveeditor/defaultComponents";
import { getPageDefinition } from "./pageDefinitionService";

// دالة إنشاء المكونات الافتراضية بناءً على الصفحة
export const createInitialComponents = (
  pageSlug: string,
): ComponentInstance[] => {
  console.log("🔧 createInitialComponents - Creating components for page:", pageSlug);
  const pageDefinition = getPageDefinition(pageSlug);
  console.log("🔧 createInitialComponents - Page definition:", pageDefinition);
  
  if (pageDefinition) {
    const components = pageDefinition.map((definition, index) => {
      console.log("🔧 createInitialComponents - Processing component:", {
        type: definition.type,
        componentName: definition.componentName,
        name: definition.name
      });
      
      // استخدام componentName من البيانات الافتراضية بدلاً من إنشاء اسم افتراضي
      return {
        id: uuidv4(),
        type: definition.type,
        name: definition.name,
        componentName: definition.componentName, // ✅ استخدام componentName الصحيح من البيانات
        data: definition.data || createDefaultData(definition.type), // استخدام البيانات من PAGE_DEFINITIONS
        position: definition.position || index,
        layout: definition.layout || {
          row: index,
          col: 0,
          span: 2,
        },
      } as ComponentInstance;
    });
    
    console.log("🔧 createInitialComponents - Created components:", components);
    return components;
  }

  console.log("🔧 createInitialComponents - No page definition found for:", pageSlug);
  // إذا لم تكن الصفحة معرفة، إرجاع مصفوفة فارغة
  return [];
};

// دالة إنشاء مكون واحد
export const createSingleComponent = (
  type: string,
  componentName: string,
  rowIndex: number = 0,
  colIndex: number = 0,
  span: number = 2,
): ComponentInstance => {
  return {
    id: uuidv4(),
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    componentName,
    data: createDefaultData(type),
    position: rowIndex, // إضافة خاصية position
    layout: {
      row: rowIndex,
      col: colIndex,
      span,
    },
  } as ComponentInstance;
};

// دالة إنشاء مكونات متعددة
export const createMultipleComponents = (
  components: Array<{
    type: string;
    componentName: string;
    rowIndex?: number;
    colIndex?: number;
    span?: number;
  }>,
): ComponentInstance[] => {
  return components.map((comp, index) => {
    const component = createSingleComponent(
      comp.type,
      comp.componentName,
      comp.rowIndex ?? index,
      comp.colIndex ?? 0,
      comp.span ?? 2,
    );
    // تأكد من أن position صحيح
    component.position = comp.rowIndex ?? index;
    return component;
  });
};

// دالة إنشاء مكونات بناءً على قالب
export const createComponentsFromTemplate = (
  template: Array<{
    type: string;
    name?: string;
    componentName?: string;
    layout?: {
      row?: number;
      col?: number;
      span?: number;
    };
  }>,
): ComponentInstance[] => {
  return template.map((item, index) => {
    // استخدام componentName المحدد أو إنشاء اسم افتراضي
    const defaultName = item.componentName || `${item.type}1`;

    return {
      id: uuidv4(),
      type: item.type,
      name: item.name || item.type.charAt(0).toUpperCase() + item.type.slice(1),
      componentName: defaultName,
      data: createDefaultData(item.type),
      position: item.layout?.row ?? index,
      layout: {
        row: item.layout?.row ?? index,
        col: item.layout?.col ?? 0,
        span: item.layout?.span ?? 2,
      },
    } as ComponentInstance;
  });
};

// دالة إنشاء مكونات لصفحة مخصصة
export const createCustomPageComponents = (
  pageSlug: string,
  componentTypes: string[],
): ComponentInstance[] => {
  return componentTypes.map((type, index) => {
    // استخدام PAGE_DEFINITIONS للبحث عن componentName الصحيح
    const pageData = (PAGE_DEFINITIONS as any)[pageSlug];
    let defaultName = `${type}1`; // افتراضي
    
    if (pageData) {
      // البحث عن المكون في البيانات الافتراضية
      const componentEntry = Object.entries(pageData).find(([id, comp]: [string, any]) => 
        comp.type === type
      );
      if (componentEntry) {
        defaultName = componentEntry[1].componentName;
      }
    }

    return {
      id: uuidv4(),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      componentName: defaultName,
      data: createDefaultData(type),
      position: index,
      layout: {
        row: index,
        col: 0,
        span: 2,
      },
    } as ComponentInstance;
  });
};

// دالة إنشاء مكون مع بيانات مخصصة
export const createComponentWithCustomData = (
  type: string,
  componentName: string,
  customData: any,
  layout?: {
    row?: number;
    col?: number;
    span?: number;
  },
): ComponentInstance => {
      return {
      id: uuidv4(),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      componentName,
      data: { ...createDefaultData(type), ...customData },
      position: layout?.row ?? 0, // إضافة خاصية position
      layout: {
        row: layout?.row ?? 0,
        col: layout?.col ?? 0,
        span: layout?.span ?? 2,
      },
    } as ComponentInstance;
};
