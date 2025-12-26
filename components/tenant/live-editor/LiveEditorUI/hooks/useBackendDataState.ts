// ============================================================================
// Hook for managing backend data state
// ============================================================================

import { useState, useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";

interface UseBackendDataStateProps {
  pageComponents: any[];
  slug: string | undefined;
  globalHeaderData: any;
  globalFooterData: any;
  globalFooterVariant: string;
  themeChangeTimestamp: number;
  selectedComponentId: string | null;
  staticPagesData: Record<string, any>;
}

export function useBackendDataState({
  pageComponents,
  slug,
  globalHeaderData,
  globalFooterData,
  globalFooterVariant,
  themeChangeTimestamp,
  selectedComponentId,
  staticPagesData,
}: UseBackendDataStateProps) {
  const [backendDataState, setBackendDataState] = useState<{
    componentsWithMergedData: Array<{
      [key: string]: any;
      mergedData: any;
    }>;
    globalHeaderData: any;
    globalFooterData: any;
  }>({
    componentsWithMergedData: [],
    globalHeaderData: null,
    globalFooterData: null,
  });

  // تحديث البيانات المدمجة عند تغيير أي مصدر بيانات
  useEffect(() => {
    // Check if this is a static page
    const editorStore = useEditorStore.getState();
    const staticPageData = editorStore.getStaticPageData(slug);
    const isStaticPage = !!staticPageData;

    // ⭐ CRITICAL: Force re-compute for static pages when theme changes
    // This ensures we get the latest data from staticPagesData after theme change
    if (isStaticPage && themeChangeTimestamp > 0) {
      // Force re-read staticPageData to ensure we have the latest data
      const freshStaticPageData = editorStore.getStaticPageData(slug);
      if (freshStaticPageData) {
        // Log removed for production
      }
    }

    // 1. معالجة pageComponents مع mergedData
    const componentsWithMergedData = pageComponents
      .filter(
        (component: any) =>
          !component.componentName?.startsWith("header") &&
          !component.componentName?.startsWith("footer"),
      )
      .map((component: any) => {
        // For static pages, get componentName and id from staticPagesData (more up-to-date)
        let finalComponentName = component.componentName;
        let finalId = component.id;
        if (isStaticPage && staticPageData) {
          // First try to find by id, then by componentName (in case id changed)
          let storeComp = staticPageData.components.find(
            (sc: any) => sc.id === component.id
          );
          // If not found by id, try to find by componentName (for cases where id was updated)
          if (!storeComp) {
            storeComp = staticPageData.components.find(
              (sc: any) => sc.componentName === component.componentName
            );
          }
          if (storeComp) {
            finalComponentName = storeComp.componentName;
            finalId = storeComp.id; // ✅ Sync id (should match componentName for static pages)
          }
        }

        // قراءة البيانات من editorStore
        // For static pages, use finalId (which may have been updated to match componentName)
        const storeData = useEditorStore
          .getState()
          .getComponentData(component.type, finalId);

        // دمج البيانات: أولوية للبيانات من editorStore
        const mergedData =
          storeData && Object.keys(storeData).length > 0
            ? storeData
            : component.data;

        return {
          ...component,
          id: finalId, // ✅ Use updated id (should match componentName for static pages)
          componentName: finalComponentName, // ✅ Use updated componentName from staticPagesData
          mergedData,
        };
      });

    // 2. تحديث state
    setBackendDataState({
      componentsWithMergedData,
      globalHeaderData: globalHeaderData || null,
      globalFooterData: globalFooterData || null,
    });
  }, [
    pageComponents,
    slug, // ✅ Add slug to detect static pages and trigger update when page changes
    globalHeaderData,
    globalFooterData,
    globalFooterVariant, // ⭐ NEW: Update when footer variant changes
    themeChangeTimestamp, // ⭐ NEW: Force update when theme changes
    selectedComponentId, // للتأكد من تحديث البيانات عند تغيير المكون المحدد
    staticPagesData, // ⭐ NEW: Trigger update when static pages change
  ]);

  return { backendDataState, setBackendDataState };
}


