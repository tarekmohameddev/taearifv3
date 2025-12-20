"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { defaultComponents } from "@/lib-liveeditor/defaultComponents";
import {
  AVAILABLE_SECTIONS,
  createDefaultData,
} from "@/components/tenant/live-editor/EditorSidebar";
import {
  getComponentDisplayName,
  applyAutoExpandLogic,
} from "@/services-liveeditor/live-editor";
import { ComponentInstance } from "@/lib-liveeditor/types";

// ============================================================================
// useEffect Hooks للـ LiveEditor
// ============================================================================

export function useLiveEditorEffects(state: any) {
  const {
    user,
    authLoading,
    tenantId,
    fetchTenantData,
    tenantLoading,
    tenantData,
    initialized,
    setInitialized,
    pageComponents,
    setPageComponents,
    registeredComponents,
    setRegisteredComponents,
    slug,
  } = state;

  const router = useRouter();

  // Authentication Effect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Tenant Data Loading Effect
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId as string);
    }
  }, [tenantId, fetchTenantData]);

  // Database Loading Effect
  useEffect(() => {
    if (!initialized && !authLoading && !tenantLoading && tenantData) {
      // Always load data into editorStore when tenantData is available
      const editorStore = useEditorStore.getState();

      console.log("🔄 Loading tenant data into editorStore:", {
        tenantData: !!tenantData,
        hasComponentSettings: !!tenantData?.componentSettings,
        hasGlobalComponentsData: !!tenantData?.globalComponentsData,
      });

      // Load data into editorStore
      editorStore.loadFromDatabase(tenantData);

      // Load page components from database or use defaults
      if (
        tenantData?.componentSettings?.[slug] &&
        Object.keys(tenantData.componentSettings[slug]).length > 0
      ) {
        const pageSettings = tenantData.componentSettings[slug];
        const dbComponents = Object.entries(pageSettings).map(
          ([id, comp]: [string, any]) => {
            // استعادة النوع الصحيح من componentName أو id إذا كان type غير صحيح
            let correctType = comp.type;
            if (comp.type === "unknown" || !comp.type) {
              // محاولة استخراج النوع من componentName أولاً
              if (comp.componentName && comp.componentName !== "undefined") {
                const componentName = comp.componentName.replace(/^\d+$/, ""); // إزالة الأرقام من البداية
                if (componentName.startsWith("header")) correctType = "header";
                else if (componentName.startsWith("hero")) correctType = "hero";
                else if (componentName.startsWith("halfTextHalfImage"))
                  correctType = "halfTextHalfImage";
                else if (componentName.startsWith("propertySlider"))
                  correctType = "propertySlider";
                else if (componentName.startsWith("ctaValuation"))
                  correctType = "ctaValuation";
              }

              // إذا لم نتمكن من استخراج النوع من componentName، جرب من id
              if (!correctType || correctType === "unknown") {
                const idParts = comp.id.split("-");
                if (idParts.length > 0) {
                  const idType = idParts[0];
                  if (idType === "header") correctType = "header";
                  else if (idType === "hero") correctType = "hero";
                  else if (idType === "half") correctType = "halfTextHalfImage";
                  else if (idType === "property")
                    correctType = "propertySlider";
                  else if (idType === "cta") correctType = "ctaValuation";
                  else if (idType === "22821795") {
                    // هذا يبدو أنه UUID، نحتاج إلى تحديد النوع بناءً على position والصفحة
                    const position = comp.position || 0;

                    // تحديد النوع بناءً على الصفحة والموقع
                    if (position === 0) correctType = "header";
                    else if (position === 1) correctType = "hero";
                    else if (position === 2) correctType = "halfTextHalfImage";
                    else if (position === 3) correctType = "propertySlider";
                    else if (position === 4) correctType = "ctaValuation";
                    else correctType = "header";
                  }
                }
              }
            }

            return {
              id: id,
              type: correctType,
              name:
                comp.name ||
                getComponentDisplayName(correctType) ||
                "Component",
              // Debug log for cards components
              ...(correctType === "cards" && {
                debug: {
                  originalType: comp.type,
                  componentName: comp.componentName,
                  correctType,
                  hasData: !!comp.data,
                },
              }),
              componentName: (() => {
                // إذا كان componentName undefined أو "undefined"، أنشئ واحد جديد
                if (!comp.componentName || comp.componentName === "undefined") {
                  if (correctType && correctType !== "unknown") {
                    return `${correctType}1`;
                  } else {
                    // إذا لم نتمكن من تحديد النوع، استخدم "unknown1"
                    return "unknown1";
                  }
                }
                return comp.componentName;
              })(),
              data:
                comp.data && Object.keys(comp.data).length > 0
                  ? comp.data
                  : correctType && correctType !== "unknown"
                    ? createDefaultData(correctType)
                    : {
                        texts: {
                          title: "Component Title",
                          subtitle: "This is a component description.",
                        },
                        colors: {
                          background: "#FFFFFF",
                          textColor: "#1F2937",
                        },
                      },
              position: 0, // سيتم تحديثه لاحقاً بناءً على ترتيب المصفوفة
              layout: comp.layout || {
                row: 0, // سيتم تحديثه لاحقاً بناءً على ترتيب المصفوفة
                col: 0,
                span: 2,
              },
            };
          },
        );

        // التحقق من وجود تخطيطات متضاربة وإعادة بنائها إذا لزم الأمر
        const hasLayoutInfo = dbComponents.every(
          (c) => c.layout && c.layout.span,
        );
        if (!hasLayoutInfo) {
          // إذا كانت البيانات قديمة ولا تحتوي على تخطيط، قم ببناء تخطيط افتراضي
          dbComponents.sort((a, b) => a.position - b.position);
          dbComponents.forEach((comp, index) => {
            comp.layout = { row: index, col: 0, span: 2 };
            comp.position = index; // تحديث position أيضاً
          });
        }
        setPageComponents(dbComponents as ComponentInstance[]);
      } else {
        // استيراد createInitialComponents من الخدمة
        const {
          createInitialComponents,
        } = require("@/services-liveeditor/live-editor");
        setPageComponents(createInitialComponents(slug));
      }

      // Initialize default inputs2 data in editorStore if no inputs2 components exist
      const hasInputs2InStore =
        Object.keys(editorStore.inputs2States || {}).length > 0;

      if (!hasInputs2InStore) {
        console.log(
          "🔍 No inputs2 data in editorStore, initializing default inputs2 data",
        );
        const {
          getDefaultInputs2Data,
        } = require("@/context-liveeditor/editorStoreFunctions/inputs2Functions");
        const defaultInputs2Data = getDefaultInputs2Data();

        editorStore.ensureComponentVariant(
          "inputs2",
          "inputs2-default",
          defaultInputs2Data,
        );
        console.log("✅ Default inputs2 data initialized in editorStore");
      }

      setInitialized(true);
    }
  }, [
    initialized,
    authLoading,
    tenantLoading,
    tenantData,
    slug,
    setPageComponents,
    setInitialized,
  ]);

  // Registered Components Effect
  useEffect(() => {
    const componentsMap: Record<string, any> = {};

    Object.entries(defaultComponents).forEach(([section, components]) => {
      componentsMap[section] = components;
    });

    if (tenantData?.componentSettings) {
      Object.entries(tenantData.componentSettings).forEach(
        ([section, components]) => {
          if (typeof components === "object" && components !== null) {
            componentsMap[section] = {
              ...(componentsMap[section] || {}),
              ...components,
            };
          }
        },
      );
    }

    setRegisteredComponents(componentsMap);
  }, [tenantData, setRegisteredComponents]);

  // Component Names Update Effect
  useEffect(() => {
    if (Object.keys(registeredComponents).length > 0) {
      setPageComponents((current: any[]) =>
        current.map((component: any) => {
          const definition = AVAILABLE_SECTIONS.find(
            (s) => s.type === component.type,
          );
          if (definition) {
            // Only update componentName if it's not already set from database
            // This prevents overriding cards3 with cards2 from defaultComponents
            if (
              !component.componentName ||
              component.componentName === "undefined"
            ) {
              const componentName =
                registeredComponents[slug]?.[definition.component] ||
                (defaultComponents as any)[slug]?.[definition.component] ||
                `${definition.component}1`;

              return { ...component, componentName };
            }
          }
          return component;
        }),
      );
    }
  }, [registeredComponents, slug, setPageComponents]);

  // Store Sync Effect - تعطيل المزامنة التلقائية لتجنب الكتابة فوق البيانات
  // useEffect(() => {
  //   useEditorStore.getState().setPageComponentsForPage(slug, pageComponents);
  // }, [pageComponents, slug]);

  // Sync pageComponents from store when pageComponentsByPage changes (for theme changes)
  const lastSyncedRef = useRef<string>("");
  // Subscribe to pageComponentsByPage changes for current page
  const storePageComponents = useEditorStore(
    (state) => state.pageComponentsByPage[slug]
  );

  useEffect(() => {
    // Only sync if already initialized to avoid conflicts with initial load
    if (!initialized) return;

    if (storePageComponents && storePageComponents.length > 0) {
      // Create a signature to detect actual changes
      const storeSignature = storePageComponents
        .map((c) => `${c.id}-${c.type}-${c.componentName}`)
        .sort()
        .join(",");

      const currentSignature = pageComponents
        .map((c) => `${c.id}-${c.type}-${c.componentName}`)
        .sort()
        .join(",");

      // Only update if signatures are different and we haven't synced this exact state
      if (
        storeSignature !== currentSignature &&
        lastSyncedRef.current !== storeSignature
      ) {
        lastSyncedRef.current = storeSignature;
        setPageComponents(storePageComponents);
      }
    }
  }, [initialized, slug, storePageComponents, pageComponents, setPageComponents]);

  // Update current page in store
  useEffect(() => {
    useEditorStore.getState().setCurrentPage(slug);
  }, [slug]);

  // Setup Save Function Effect
  useEffect(() => {
    const saveFn = () => {
      // Force update the store with current pageComponents state
      useEditorStore.getState().forceUpdatePageComponents(slug, pageComponents);
    };

    // Set the save function in the store
    useEditorStore.getState().setOpenSaveDialog(saveFn);

    // Cleanup: reset to empty function when component unmounts or slug changes
    return () => {
      useEditorStore.getState().setOpenSaveDialog(() => {});
    };
  }, [slug, pageComponents]);
}
