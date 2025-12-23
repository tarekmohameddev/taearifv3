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
        themeChangeTimestamp: editorStore.themeChangeTimestamp,
      });

      // ⭐ CRITICAL: Check if theme was recently changed
      // If themeChangeTimestamp > 0, prioritize pageComponentsByPage from store
      // over tenantData.componentSettings to avoid loading old theme data
      const themeChangeTimestamp = editorStore.themeChangeTimestamp;
      const hasRecentThemeChange = themeChangeTimestamp > 0;

      // Load data into editorStore
      editorStore.loadFromDatabase(tenantData);

      // ⭐ PRIORITY LOGIC: Check store first if theme was recently changed
      const storePageComponents = editorStore.pageComponentsByPage[slug];
      
      if (hasRecentThemeChange && storePageComponents !== undefined) {
        // Theme was recently changed - use store data (new theme) instead of tenantData (old theme)
        console.log("🔄 Theme recently changed - using store data instead of tenantData:", {
          slug,
          storeComponentCount: storePageComponents.length,
          tenantDataComponentCount: tenantData?.componentSettings?.[slug] 
            ? Object.keys(tenantData.componentSettings[slug]).length 
            : 0,
        });
        setPageComponents(storePageComponents || []);
      } else if (
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
        // ⭐ FALLBACK: If no tenantData and no store data, check store first
        // This handles the case where theme was changed but tenantData wasn't updated yet
        if (storePageComponents !== undefined) {
          console.log("🔄 No tenantData for page, using store data:", {
            slug,
            componentCount: storePageComponents.length,
          });
          setPageComponents(storePageComponents || []);
        } else {
          // استيراد createInitialComponents من الخدمة
          const {
            createInitialComponents,
          } = require("@/services-liveeditor/live-editor");
          setPageComponents(createInitialComponents(slug));
        }
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
  
  // Subscribe to currentTheme changes to detect theme restore
  const currentTheme = useEditorStore((state) => state.WebsiteLayout?.currentTheme);
  const themeChangeTimestamp = useEditorStore((state) => state.themeChangeTimestamp);

  useEffect(() => {
    // Only sync if already initialized to avoid conflicts with initial load
    if (!initialized) return;

    // Create a more comprehensive signature that includes data hash
    const createSignature = (components: any[]) => {
      if (!components || components.length === 0) return "empty";
      return components
        .map((c) => {
          // Include data hash in signature to detect data changes
          const dataHash = JSON.stringify(c.data || {});
          return `${c.id}-${c.type}-${c.componentName}-${dataHash.substring(0, 50)}`;
        })
        .sort()
        .join(",");
    };

    // ⭐ CRITICAL: Force sync if themeChangeTimestamp changed (after theme restore)
    // This ensures immediate update after clearAllStates() and restore
    // We need to check the store directly to get the latest data, not rely on subscription
    if (themeChangeTimestamp > 0) {
      // Get fresh data from store (bypass subscription timing issues)
      const store = useEditorStore.getState();
      const freshStorePageComponents = store.pageComponentsByPage[slug];
      
      if (freshStorePageComponents !== undefined) {
        const storeSignature = createSignature(freshStorePageComponents);
        console.log("[LiveEditorEffects] Force sync after theme change:", {
          slug,
          componentCount: freshStorePageComponents.length,
          signature: storeSignature.substring(0, 100),
        });
        setPageComponents(freshStorePageComponents || []);
        lastSyncedRef.current = storeSignature;
        return;
      } else {
        // If storePageComponents is undefined, set to empty array to clear iframe
        console.log("[LiveEditorEffects] No components found for page after theme change, clearing:", slug);
        setPageComponents([]);
        lastSyncedRef.current = "empty";
        return;
      }
    }

    // Normal sync: Force sync if storePageComponents exists (even if empty array)
    if (storePageComponents !== undefined) {
      const storeSignature = createSignature(storePageComponents);
      const currentSignature = createSignature(pageComponents);

      // Force update if:
      // 1. Signatures are different
      // 2. We haven't synced this exact state
      // 3. Store has components but current doesn't (or vice versa)
      // 4. Store changed from undefined to defined (or vice versa)
      const shouldUpdate =
        storeSignature !== currentSignature &&
        (lastSyncedRef.current !== storeSignature ||
          (storePageComponents.length > 0 && pageComponents.length === 0) ||
          (storePageComponents.length === 0 && pageComponents.length > 0));

      if (shouldUpdate) {
        console.log("[LiveEditorEffects] Normal sync triggered:", {
          slug,
          componentCount: storePageComponents.length,
          shouldUpdate,
        });
        lastSyncedRef.current = storeSignature;
        setPageComponents(storePageComponents || []);
      }
    } else {
      // ⭐ NEW: If storePageComponents is undefined but we have pageComponents, clear them
      // This handles the case where clearAllStates() was called but pageComponents wasn't updated
      if (pageComponents.length > 0) {
        console.log("[LiveEditorEffects] Clearing pageComponents (store is undefined):", slug);
        setPageComponents([]);
        lastSyncedRef.current = "empty";
      }
    }
  }, [initialized, slug, storePageComponents, pageComponents, setPageComponents, currentTheme, themeChangeTimestamp]);

  // Reset sync ref when theme changes to force re-sync
  useEffect(() => {
    if (themeChangeTimestamp > 0) {
      lastSyncedRef.current = "";
    }
  }, [themeChangeTimestamp]);

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

