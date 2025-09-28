import { v4 as uuidv4 } from "uuid";
import { ComponentInstance } from "@/lib/types";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";
import { defaultComponents } from "@/lib/defaultComponents";
import { getPageDefinition } from "./pageDefinitionService";

// دالة إنشاء المكونات الافتراضية بناءً على الصفحة
export const createInitialComponents = (
  pageSlug: string,
): ComponentInstance[] => {
  const pageDefinition = getPageDefinition(pageSlug);
  if (pageDefinition) {
    return pageDefinition.map((definition, index) => {
      const defaultName =
        (defaultComponents as any)?.[pageSlug]?.[definition.type] ||
        `${definition.type}1`;
      return {
        id: uuidv4(),
        type: definition.type,
        name: definition.name,
        componentName: defaultName,
        data: createDefaultData(definition.type),
        position: index, // إضافة خاصية position
        layout: {
          row: index, // كل مكون في صف منفصل
          col: 0,
          span: 2, // يأخذ عرض العمودين
        },
      } as ComponentInstance;
    });
  }

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
    const defaultName =
      (defaultComponents as any)?.[item.type] || `${item.type}1`;

    return {
      id: uuidv4(),
      type: item.type,
      name: item.name || item.type.charAt(0).toUpperCase() + item.type.slice(1),
      componentName: item.componentName || defaultName,
      data: createDefaultData(item.type),
      position: item.layout?.row ?? index, // إضافة خاصية position
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
    const defaultName =
      (defaultComponents as any)?.[pageSlug]?.[type] ||
      (defaultComponents as any)?.homepage?.[type] ||
      `${type}1`;

    return {
      id: uuidv4(),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      componentName: defaultName,
      data: createDefaultData(type),
      position: index, // إضافة خاصية position
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
