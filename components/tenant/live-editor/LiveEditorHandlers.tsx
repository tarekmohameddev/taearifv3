"use client";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { ComponentData } from "@/lib-liveeditor/types";
import {
  getDefaultThemeForType,
  applyAutoExpandLogic,
} from "@/services-liveeditor/live-editor";
import { createDefaultData } from "./EditorSidebar/utils";
import { logComponentAdd, logComponentChange, logUserAction } from "@/lib-liveeditor/debugLogger";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// دالة بسيطة لإضافة رقم 1 لكل مكون
const getComponentNameWithOne = (componentType: string): string => {
  return `${componentType}1`;
};

// ============================================================================
// معالجات الأحداث للـ LiveEditor
// ============================================================================

export function useLiveEditorHandlers(state: any) {
  const {
    setSidebarView,
    setSelectedComponentId,
    setSidebarOpen,
    setComponentToDelete,
    setDeleteDialogOpen,
    setDeletePageDialogOpen,
    setDeletePageConfirmation,
    setPageComponents,
    slug,
    tenantId,
  } = state;

  const router = useRouter();

  // Sidebar Handlers
  const openMainSidebar = () => {
    setSidebarView("main");
    setSelectedComponentId(null);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Component Edit Handlers
  const handleEditClick = (componentId: string) => {
    setSelectedComponentId(componentId);
    setSidebarView("edit-component");
    setSidebarOpen(true);
  };

  // Component Delete Handlers
  const handleDeleteClick = (componentId: string) => {
    setComponentToDelete(componentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (state.componentToDelete) {
      setPageComponents((currentComponents: any[]) => {
        // حذف المكون وتطبيق منطق التوسع التلقائي
        const filteredComponents = currentComponents.filter(
          (c) => c.id !== state.componentToDelete,
        );
        return applyAutoExpandLogic(filteredComponents);
      });
    }
    setDeleteDialogOpen(false);
    setComponentToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setComponentToDelete(null);
  };

  // Page Delete Handlers
  const handleDeletePage = () => {
    setDeletePageDialogOpen(true);
  };

  const confirmDeletePage = () => {
    if (
      state.deletePageConfirmation === "I am sure I want to delete this page"
    ) {
      // Remove page from editorStore
      const store = useEditorStore.getState();
      store.deletePage(slug);

      // Remove page from tenantStore componentSettings
      const { tenantData } = useTenantStore.getState();
      if (tenantData?.componentSettings) {
        const updatedComponentSettings = { ...tenantData.componentSettings };
        delete updatedComponentSettings[slug];

        useTenantStore.setState({
          tenantData: {
            ...tenantData,
            componentSettings: updatedComponentSettings,
          },
        });
      }

      // Clear page components
      setPageComponents([]);

      // Close dialog and reset confirmation
      setDeletePageDialogOpen(false);
      setDeletePageConfirmation("");

      // Navigate to homepage in live editor
      router.push(`/live-editor/homepage`);
    }
  };

  const cancelDeletePage = () => {
    setDeletePageDialogOpen(false);
    setDeletePageConfirmation("");
  };

  // Component Update Handlers
  const handleComponentUpdate = (id: string, newData: ComponentData) => {
    
    // Handle global components - save them separately, not in pageComponentsByPage
    if (id === "global-header" || id === "global-footer") {
      
      // Get current store state
      const store = useEditorStore.getState();
      
      console.log("🔍 [LiveEditorHandlers] Saving global component separately:", {
        id,
        newData,
        globalHeaderData: store.globalHeaderData,
        globalFooterData: store.globalFooterData
      });
      
      // Global components are already saved in their respective stores (globalHeaderData, globalFooterData)
      // No need to save them to pageComponentsByPage
      // They will be sent to API separately via save-changes endpoint
      
      return; // Don't proceed with regular component update
    }
    
    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => (c.id === id ? { ...c, data: newData } : c)),
    );
  };

  const handleComponentThemeChange = (id: string, newTheme: string) => {
    // Log user action
    logUserAction('CHANGE_COMPONENT_THEME', id, newTheme, {
      id,
      newTheme,
      reason: 'User changed component theme'
    });
    
    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => {
        if (c.id === id) {
          const oldTheme = c.componentName;
          
          // Log component change
          logComponentChange(id, oldTheme, newTheme, {
            oldComponent: c,
            newTheme,
            reason: 'Component theme changed'
          });
          
          // Get new default data for the new theme
          const newDefaultData = createDefaultData(c.type, newTheme);
          
          // Defer store update to avoid render cycle issues
          setTimeout(() => {
            const store = useEditorStore.getState();
            const currentPage = store.currentPage;
            
            // Update pageComponentsByPage in the store with new data
            const updatedPageComponents = store.pageComponentsByPage[currentPage] || [];
            const updatedStoreComponents = updatedPageComponents.map((comp: any) => {
              if (comp.id === id) {
                return { 
                  ...comp, 
                  componentName: newTheme,
                  data: newDefaultData
                };
              }
              return comp;
            });
            
            // Update the store
            store.forceUpdatePageComponents(currentPage, updatedStoreComponents);
            
            // Also update the component data in the store
            store.setComponentData(c.type, id, newDefaultData);
          }, 0);
          
          return { 
            ...c, 
            componentName: newTheme,
            data: newDefaultData
          };
        }
        return c;
      }),
    );
  };

  const handleComponentReset = (id: string) => {
    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => {
        if (c.id === id) {
          // Get default data for this component type and current theme
          const defaultData = createDefaultData(c.type, c.componentName);
          
          // Also reset data in the editor store using component.id as unique identifier
          const store = useEditorStore.getState();
          store.setComponentData(c.type, id, defaultData);
          
          // Defer store update to avoid render cycle issues
          setTimeout(() => {
            const currentPage = store.currentPage;
            
            // Update pageComponentsByPage in the store
            const updatedPageComponents = store.pageComponentsByPage[currentPage] || [];
            const updatedStoreComponents = updatedPageComponents.map((comp: any) => {
              if (comp.id === id) {
                return {
                  ...comp,
                  data: defaultData,
                  componentName: c.componentName, // Keep current theme
                };
              }
              return comp;
            });
            
            // Update the store
            store.forceUpdatePageComponents(currentPage, updatedStoreComponents);
          }, 0);
          
          return {
            ...c,
            data: defaultData,
            // Keep current theme, just reset data
            componentName: c.componentName,
          };
        }
        return c;
      }),
    );
  };

  // Page Theme Change Handler
  const handlePageThemeChange = (
    themeId: string,
    components: Record<string, string>,
  ) => {
    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => {
        const newTheme = components[c.type];
        if (newTheme) {
          // Get new default data for the new theme
          const newDefaultData = createDefaultData(c.type, newTheme);
          
          // Defer store update to avoid render cycle issues
          setTimeout(() => {
            const store = useEditorStore.getState();
            const currentPage = store.currentPage;
            
            // Update pageComponentsByPage in the store with new data
            const updatedPageComponents = store.pageComponentsByPage[currentPage] || [];
            const updatedStoreComponents = updatedPageComponents.map((comp: any) => {
              if (comp.id === c.id) {
                return { 
                  ...comp, 
                  componentName: newTheme,
                  data: newDefaultData
                };
              }
              return comp;
            });
            
            // Update the store
            store.forceUpdatePageComponents(currentPage, updatedStoreComponents);
            
            // Also update the component data in the store
            store.setComponentData(c.type, c.id, newDefaultData);
          }, 0);
          
          return { 
            ...c, 
            componentName: newTheme,
            data: newDefaultData
          };
        }
        return c;
      }),
    );
  };

  // Add Section Handler
  const handleAddSection = (type: string) => {
    // إضافة رقم 1 لكل مكون
    const componentName = getComponentNameWithOne(type);
    const componentId = uuidv4();
    
    
    // Log user action
    logUserAction('ADD_COMPONENT', componentId, componentName, {
      type,
      componentName,
      componentId,
      reason: 'User clicked add component'
    });
    
    const defaultData = createDefaultData(type, componentName);
    
    const newSection = {
      id: componentId,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      componentName,
      data: defaultData,
      layout: {
        row: state.pageComponents.length,
        col: 0,
        span: 2,
      },
    };
    
    // Log component addition
    logComponentAdd(componentId, componentName, type, {
      newSection,
      defaultData,
      currentComponents: state.pageComponents,
      reason: 'Component added to page'
    });
    
    setPageComponents((current: any[]) => [...current, newSection]);
    
    // Defer store update to avoid render cycle issues
    setTimeout(() => {
      const store = useEditorStore.getState();
      const currentPage = store.currentPage;
      const updatedPageComponents = [...(store.pageComponentsByPage[currentPage] || []), newSection];
      store.forceUpdatePageComponents(currentPage, updatedPageComponents);
    }, 0);
    
    setSidebarView("main");
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: any) => {
    state.setActiveId(event.active.id);
  };

  const handleDragEndLocal = (event: any) => {
    const {
      handleDragEnd,
      manageDragState,
    } = require("@/services-liveeditor/live-editor");
    
    // Create a custom setPageComponents that also updates the store
    const setPageComponentsWithStore = (updater: (components: any[]) => any[]) => {
      setPageComponents((currentComponents: any[]) => {
        const newComponents = updater(currentComponents);
        
        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(currentPage, newComponents);
        }, 0);
        
        return newComponents;
      });
    };
    
    handleDragEnd(
      event,
      state.pageComponents,
      state.dropIndicator,
      setPageComponentsWithStore,
    );
    manageDragState.end(state.setActiveId, state.setDropIndicator);
  };

  return {
    // Sidebar
    openMainSidebar,
    closeSidebar,

    // Component
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleComponentUpdate,
    handleComponentThemeChange,
    handleComponentReset,

    // Page
    handleDeletePage,
    confirmDeletePage,
    cancelDeletePage,
    handlePageThemeChange,

    // Add Section
    handleAddSection,

    // Drag and Drop
    handleDragStart,
    handleDragEndLocal,
  };
}
