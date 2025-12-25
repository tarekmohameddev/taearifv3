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
// Helper Functions for Static Pages
// ============================================================================

/**
 * Returns the default component configuration for a static page
 * @param slug - The slug of the static page
 * @returns Default component configuration or null if not found
 */
function getDefaultComponentForStaticPage(slug: string) {
  const defaults: Record<string, any> = {
    project: {
      id: "projectDetails1",
      type: "projectDetails",
      name: "Project Details",
      componentName: "projectDetails1",
      data: { projectSlug: "", visible: true },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    // يمكن إضافة صفحات ثابتة أخرى لاحقاً
    // products: { ... },
    // checkout: { ... },
  };
  
  return defaults[slug] || null;
}

/**
 * Checks if a page is a static page based on tenantData or editorStore
 * @param slug - The slug of the page to check
 * @param tenantData - Tenant data from getTenant
 * @param editorStore - Editor store instance
 * @returns true if the page is a static page, false otherwise
 */
function isStaticPage(
  slug: string,
  tenantData: any,
  editorStore: any
): boolean {
  if (!slug) return false;
  
  // Check if page exists in tenantData.StaticPages
  // Handle both formats: [slug, components] or { slug, components }
  const staticPageFromTenant = tenantData?.StaticPages?.[slug];
  if (staticPageFromTenant) {
    // Format 1: Array [slug, components]
    if (Array.isArray(staticPageFromTenant) && staticPageFromTenant.length === 2) {
      return true;
    }
    // Format 2: Object { slug, components }
    if (typeof staticPageFromTenant === "object" && !Array.isArray(staticPageFromTenant)) {
      return true;
    }
  }
  
  // Check if page exists in editorStore.staticPagesData
  const staticPageData = editorStore.getStaticPageData(slug);
  if (staticPageData) {
    return true;
  }
  
  return false;
}

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
    // Always load data into editorStore when tenantData is available
    const editorStore = useEditorStore.getState();
    
    // Check if this is a static page
    const pageIsStatic = isStaticPage(slug, tenantData, editorStore);
    
    // For static pages, always check even if initialized
    const shouldLoad = pageIsStatic 
      ? (!authLoading && !tenantLoading && tenantData)
      : (!initialized && !authLoading && !tenantLoading && tenantData);
    
    if (shouldLoad) {
      console.log("🔄 Loading tenant data into editorStore:", {
        tenantData: !!tenantData,
        hasComponentSettings: !!tenantData?.componentSettings,
        hasGlobalComponentsData: !!tenantData?.globalComponentsData,
        hasStaticPages: !!tenantData?.StaticPages,
        themeChangeTimestamp: editorStore.themeChangeTimestamp,
        slug,
        isStaticPage: pageIsStatic,
      });

      // ⭐ CRITICAL: Check if theme was recently changed
      // If themeChangeTimestamp > 0, prioritize pageComponentsByPage from store
      // over tenantData.componentSettings to avoid loading old theme data
      const themeChangeTimestamp = editorStore.themeChangeTimestamp;
      const hasRecentThemeChange = themeChangeTimestamp > 0;

      // ⭐ PRIORITY LOGIC: Check store first before loading from tenantData
      // This prevents overwriting recent changes (after save) with old tenantData
      const storePageComponents = editorStore.pageComponentsByPage[slug];

      if (storePageComponents && storePageComponents.length > 0) {
        // Store already has data - use it instead of tenantData to avoid overwriting recent changes
        console.log("🔄 Using store data (has recent changes):", {
          slug,
          componentCount: storePageComponents.length,
        });
        setPageComponents(storePageComponents);
        setInitialized(true);
        return; // Skip loading from tenantData
      }

      // Load data into editorStore (only if store doesn't have data for this page)
      editorStore.loadFromDatabase(tenantData);

      // Re-check store after loadFromDatabase (in case it was updated)
      const storePageComponentsAfterLoad = editorStore.pageComponentsByPage[slug];
      
      // ⭐ STATIC PAGES: Load with priority from tenantData.StaticPages
      if (pageIsStatic) {
        console.log("🔍 Processing static page:", {
          slug,
          hasTenantData: !!tenantData,
          initialized,
        });
        
        // ⭐ PRIORITY 1: Check tenantData.StaticPages[slug] first (from getTenant)
        const staticPageFromTenant = tenantData?.StaticPages?.[slug];
        
        // Handle different formats: [slug, components] or { slug, components }
        let tenantComponents: any[] = [];
        
        if (staticPageFromTenant) {
          // Format 1: Array format [slug, components]
          if (Array.isArray(staticPageFromTenant) && staticPageFromTenant.length === 2) {
            tenantComponents = Array.isArray(staticPageFromTenant[1]) ? staticPageFromTenant[1] : [];
          }
          // Format 2: Object format { slug, components }
          else if (typeof staticPageFromTenant === "object" && !Array.isArray(staticPageFromTenant)) {
            tenantComponents = Array.isArray(staticPageFromTenant.components) 
              ? staticPageFromTenant.components 
              : [];
          }
        }
        
        const hasStaticPageInTenant = tenantComponents.length > 0;

        if (hasStaticPageInTenant) {
          console.log("✅ Loading static page from tenantData.StaticPages:", {
            slug,
            componentCount: tenantComponents.length,
            format: Array.isArray(staticPageFromTenant) ? "array" : "object",
          });
          
          // Convert static page components to the format expected by setPageComponents
          const staticComponents = tenantComponents.map((comp: any) => ({
            id: comp.id || getDefaultComponentForStaticPage(slug)?.id || `${slug}1`,
            type: comp.type || getDefaultComponentForStaticPage(slug)?.type || slug,
            name: comp.name || getDefaultComponentForStaticPage(slug)?.name || slug,
            componentName: comp.componentName || getDefaultComponentForStaticPage(slug)?.componentName || `${slug}1`,
            data: comp.data || getDefaultComponentForStaticPage(slug)?.data || {},
            position: comp.position || 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
            forceUpdate: comp.forceUpdate || 0,
          }));
          
          console.log("✅ Loading static page components from tenantData.StaticPages:", {
            componentCount: staticComponents.length,
            components: staticComponents.map((c: any) => c.componentName),
            firstComponent: staticComponents[0],
          });
          
          setPageComponents(staticComponents);
          setInitialized(true);
          return; // Skip further loading logic
        }
        
        // ⭐ PRIORITY 2: Check editorStore.staticPagesData[slug] (after loadFromDatabase)
        let staticPageData = editorStore.getStaticPageData(slug);
        let staticPageComponents = staticPageData?.components || [];
        
        console.log("🔍 Static page data check from editorStore:", {
          hasStaticPageData: !!staticPageData,
          componentCount: staticPageComponents.length,
        });
        
        // ⭐ PRIORITY 3: If no components, add default component
        if (staticPageComponents.length === 0) {
          const defaultComponent = getDefaultComponentForStaticPage(slug);
          
          if (defaultComponent) {
            console.log("⚠️ No components found, adding default component:", {
              slug,
              defaultComponent: defaultComponent.componentName,
            });
            
            // Add to staticPagesData
            editorStore.setStaticPageData(slug, {
              slug,
              components: [defaultComponent],
            });
            
            // Re-read staticPageData after adding
            staticPageData = editorStore.getStaticPageData(slug);
            staticPageComponents = staticPageData?.components || [];
            
            console.log("✅ Added default component to static page:", {
              slug,
              componentCount: staticPageComponents.length,
              componentName: defaultComponent.componentName,
            });
          } else {
            console.warn("⚠️ No default component found for static page:", slug);
          }
        }
        
        // Load components from staticPagesData
        if (staticPageComponents.length > 0) {
          // Convert static page components to the format expected by setPageComponents
          const defaultComponent = getDefaultComponentForStaticPage(slug);
          const staticComponents = staticPageComponents.map((comp: any) => ({
            id: comp.id || defaultComponent?.id || `${slug}1`,
            type: comp.type || defaultComponent?.type || slug,
            name: comp.name || defaultComponent?.name || slug,
            componentName: comp.componentName || defaultComponent?.componentName || `${slug}1`,
            data: comp.data || defaultComponent?.data || {},
            position: comp.position || 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          }));
          
          console.log("✅ Loading static page components from editorStore.staticPagesData:", {
            componentCount: staticComponents.length,
            components: staticComponents.map((c: any) => c.componentName),
            firstComponent: staticComponents[0],
          });
          
          setPageComponents(staticComponents);
          setInitialized(true);
          return; // Skip regular page loading logic
        } else {
          console.error("❌ No components to load for static page:", slug);
        }
      }
      
      if (hasRecentThemeChange && storePageComponentsAfterLoad !== undefined) {
        // Theme was recently changed - use store data (new theme) instead of tenantData (old theme)
        console.log("🔄 Theme recently changed - using store data instead of tenantData:", {
          slug,
          storeComponentCount: storePageComponentsAfterLoad.length,
          tenantDataComponentCount: tenantData?.componentSettings?.[slug] 
            ? Object.keys(tenantData.componentSettings[slug]).length 
            : 0,
        });
        setPageComponents(storePageComponentsAfterLoad || []);
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
        if (storePageComponentsAfterLoad !== undefined) {
          console.log("🔄 No tenantData for page, using store data:", {
            slug,
            componentCount: storePageComponentsAfterLoad.length,
          });
          setPageComponents(storePageComponentsAfterLoad || []);
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

    // ⭐ NEW: For static pages, always check staticPagesData first
    const editorStore = useEditorStore.getState();
    const pageIsStatic = isStaticPage(slug, tenantData, editorStore);
    
    if (pageIsStatic) {
      const staticPageData = editorStore.getStaticPageData(slug);
      const staticPageComponents = staticPageData?.components || [];
      
      if (staticPageComponents.length > 0) {
        const defaultComponent = getDefaultComponentForStaticPage(slug);
        const staticComponents = staticPageComponents.map((comp: any) => ({
          id: comp.id || defaultComponent?.id || `${slug}1`,
          type: comp.type || defaultComponent?.type || slug,
          name: comp.name || defaultComponent?.name || slug,
          componentName: comp.componentName || defaultComponent?.componentName || `${slug}1`,
          data: comp.data || defaultComponent?.data || {},
          position: comp.position || 0,
          layout: comp.layout || { row: 0, col: 0, span: 2 },
        }));
        
        const staticSignature = createSignature(staticComponents);
        
        // Only update if we haven't synced this exact state (avoid infinite loop)
        if (lastSyncedRef.current !== staticSignature) {
          console.log("[LiveEditorEffects] Syncing static page from staticPagesData:", {
            slug,
            componentCount: staticComponents.length,
            staticSignature: staticSignature.substring(0, 50),
          });
          setPageComponents(staticComponents);
          lastSyncedRef.current = staticSignature;
          return; // Skip normal sync logic for static pages
        } else {
          // Already synced, skip to avoid infinite loop
          return;
        }
      }
    }

    // ⭐ CRITICAL: Force sync if themeChangeTimestamp changed (after theme restore)
    // This ensures immediate update after clearAllStates() and restore
    // We need to check the store directly to get the latest data, not rely on subscription
    if (themeChangeTimestamp > 0) {
      // Get fresh data from store (bypass subscription timing issues)
      const store = useEditorStore.getState();
      const freshStorePageComponents = store.pageComponentsByPage[slug];
      
      // ⭐ NEW: For static pages, check staticPagesData first
      const pageIsStatic = isStaticPage(slug, tenantData, store);
      
      if (pageIsStatic && !freshStorePageComponents) {
        const staticPageData = store.getStaticPageData(slug);
        const staticPageComponents = staticPageData?.components || [];
        
        if (staticPageComponents.length > 0) {
          const defaultComponent = getDefaultComponentForStaticPage(slug);
          const staticComponents = staticPageComponents.map((comp: any) => ({
            id: comp.id || defaultComponent?.id || `${slug}1`,
            type: comp.type || defaultComponent?.type || slug,
            name: comp.name || defaultComponent?.name || slug,
            componentName: comp.componentName || defaultComponent?.componentName || `${slug}1`,
            data: comp.data || defaultComponent?.data || {},
            position: comp.position || 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          }));
          
          const staticSignature = createSignature(staticComponents);
          console.log("[LiveEditorEffects] Force sync static page after theme change:", {
            slug,
            componentCount: staticComponents.length,
          });
          setPageComponents(staticComponents);
          lastSyncedRef.current = staticSignature;
          return;
        }
      }
      
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
        // BUT: Skip for static pages if they have components in staticPagesData
        const pageIsStatic = isStaticPage(slug, tenantData, store);
        
        if (pageIsStatic) {
          const staticPageData = store.getStaticPageData(slug);
          if (staticPageData?.components?.length > 0) {
            // Don't clear, static page has components
            return;
          }
        }
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
      // ⭐ NEW: For static pages, check staticPagesData before clearing
      const editorStore = useEditorStore.getState();
      const pageIsStatic = isStaticPage(slug, tenantData, editorStore);
      
      if (pageIsStatic) {
        const staticPageData = editorStore.getStaticPageData(slug);
        const staticPageComponents = staticPageData?.components || [];
        
        if (staticPageComponents.length > 0) {
          // Convert static page components to the format expected by setPageComponents
          const defaultComponent = getDefaultComponentForStaticPage(slug);
          const staticComponents = staticPageComponents.map((comp: any) => ({
            id: comp.id || defaultComponent?.id || `${slug}1`,
            type: comp.type || defaultComponent?.type || slug,
            name: comp.name || defaultComponent?.name || slug,
            componentName: comp.componentName || defaultComponent?.componentName || `${slug}1`,
            data: comp.data || defaultComponent?.data || {},
            position: comp.position || 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          }));
          
          const staticSignature = createSignature(staticComponents);
          if (lastSyncedRef.current !== staticSignature) {
            console.log("[LiveEditorEffects] Syncing static page components from staticPagesData:", {
              slug,
              componentCount: staticComponents.length,
            });
            setPageComponents(staticComponents);
            lastSyncedRef.current = staticSignature;
            return;
          }
        }
      }
      
      // ⭐ NEW: If storePageComponents is undefined but we have pageComponents, clear them
      // This handles the case where clearAllStates() was called but pageComponents wasn't updated
      // BUT: Skip this for static pages if they have components in staticPagesData
      if (pageComponents.length > 0) {
        console.log("[LiveEditorEffects] Clearing pageComponents (store is undefined):", slug);
        setPageComponents([]);
        lastSyncedRef.current = "empty";
      }
    }
  }, [initialized, slug, storePageComponents, setPageComponents, currentTheme, themeChangeTimestamp]);

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

  // ⭐ Sync pageComponents with staticPagesData when componentName changes
  // This ensures pageComponents is updated when componentName is changed in ComponentEditor
  // Use Zustand subscription to listen to staticPagesData changes
  useEffect(() => {
    const editorStore = useEditorStore.getState();
    const staticPageData = editorStore.getStaticPageData(slug);
    const isStaticPage = !!staticPageData;

    if (!isStaticPage || !staticPageData) return;

    // Subscribe to staticPagesData changes
    const unsubscribe = useEditorStore.subscribe(
      (state) => state.staticPagesData?.[slug],
      (staticPageData) => {
        if (!staticPageData) return;

        // Use functional update to access latest pageComponents (avoids stale closure)
        setPageComponents((currentPageComponents) => {
          // Check if staticPagesData has different componentName than pageComponents
          const needsUpdate = staticPageData.components.some((storeComp: any) => {
            const localComp = currentPageComponents.find((lc: any) => lc.id === storeComp.id);
            return localComp && localComp.componentName !== storeComp.componentName;
          });

          if (needsUpdate) {
            // Update pageComponents to match staticPagesData (especially componentName and id)
            return currentPageComponents.map((localComp: any) => {
              const storeComp = staticPageData.components.find(
                (sc: any) => sc.id === localComp.id || sc.componentName === localComp.componentName
              );
              if (storeComp && (storeComp.componentName !== localComp.componentName || storeComp.id !== localComp.id)) {
                // Use componentName and id from staticPagesData (more up-to-date)
                // For static pages, id should match componentName
                return {
                  ...localComp,
                  id: storeComp.id, // ✅ Sync id (should match componentName for static pages)
                  componentName: storeComp.componentName,
                  forceUpdate: storeComp.forceUpdate || localComp.forceUpdate || 0, // ✅ Sync forceUpdate
                };
              }
              return localComp;
            });
          }
          return currentPageComponents;
        });
      }
    );

    return unsubscribe;
  }, [slug, setPageComponents]); // ✅ Removed pageComponents from dependencies to avoid stale closure

  // Setup Save Function Effect
  useEffect(() => {
    const saveFn = () => {
      const store = useEditorStore.getState();
      // Get fresh staticPagesData from store (has latest componentName updates)
      const staticPageData = store.getStaticPageData(slug);
      const isStaticPage = !!staticPageData;

      if (isStaticPage && staticPageData) {
        // STATIC PAGE - Use staticPagesData from store (which has latest componentName updates)
        // The staticPagesData is already updated when componentName changes in ComponentEditor
        // We need to merge pageComponents (local changes) with staticPagesData (latest componentName)
        // ✅ Get fresh staticPagesData to ensure we have the latest componentName
        const currentStaticPageData = store.getStaticPageData(slug);
        if (currentStaticPageData) {
          // Merge: use componentName and id from staticPagesData (up-to-date), but keep other data from pageComponents
          const mergedComponents = pageComponents.map((localComp: any) => {
            // Find matching component in staticPagesData to get latest componentName and id
            // First try to find by id, then by componentName (in case id changed)
            let storeComp = currentStaticPageData.components.find(
              (sc: any) => sc.id === localComp.id
            );
            // If not found by id, try to find by componentName (for cases where id was updated)
            if (!storeComp) {
              storeComp = currentStaticPageData.components.find(
                (sc: any) => sc.componentName === localComp.componentName
              );
            }
            // ✅ Use componentName and id from staticPagesData (more up-to-date than pageComponents)
            // For static pages, id should match componentName
            return {
              ...localComp,
              id: storeComp?.id || localComp.id, // ✅ Sync id (should match componentName for static pages)
              componentName: storeComp?.componentName || localComp.componentName,
              forceUpdate: (localComp.forceUpdate || 0) + 1, // Ensure forceUpdate is incremented
            };
          });
          
          // ✅ Update staticPagesData with merged components (includes latest componentName)
          store.setStaticPageData(slug, {
            ...currentStaticPageData,
            components: mergedComponents,
            // API endpoints remain unchanged (IMMUTABLE)
          });
        }
      } else {
        // REGULAR PAGE - Update pageComponentsByPage
        store.forceUpdatePageComponents(slug, pageComponents);
      }
    };

    // Set the save function in the store
    useEditorStore.getState().setOpenSaveDialog(saveFn);

    // Cleanup: reset to empty function when component unmounts or slug changes
    return () => {
      useEditorStore.getState().setOpenSaveDialog(() => {});
    };
  }, [slug, pageComponents]);
}

