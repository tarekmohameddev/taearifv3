import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import theme1Data from "@/lib/themes/theme1Data.json";
import theme2Data from "@/lib/themes/theme2Data.json";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";

export type ThemeNumber = 1 | 2;

interface ThemeData {
  componentSettings?: Record<string, any[]>;
  pages?: Record<string, any[]>;
  globalComponentsData?: {
    header?: any;
    footer?: any;
  };
}

/**
 * Load theme data from JSON file
 */
export function loadThemeData(themeNumber: ThemeNumber): ThemeData {
  switch (themeNumber) {
    case 1:
      return theme1Data as ThemeData;
    case 2:
      return theme2Data as ThemeData;
    default:
      throw new Error(`Invalid theme number: ${themeNumber}`);
  }
}

/**
 * Create backup key based on current theme
 */
export function createBackupKey(currentTheme: number | null | undefined): string | null {
  if (!currentTheme) return null;
  return `Theme${currentTheme}Backup`;
}

/**
 * Backup current component settings
 */
export function backupCurrentComponentSettings(): {
  backup: Record<string, any>;
  backupKey: string | null;
} {
  const store = useEditorStore.getState();
  const currentTheme = store.WebsiteLayout?.currentTheme;

  if (!currentTheme) {
    return { backup: {}, backupKey: null };
  }

  const backupKey = createBackupKey(currentTheme);
  if (!backupKey) {
    return { backup: {}, backupKey: null };
  }

  // Create backup object with componentSettings structure
  const backup: Record<string, any> = {};

  // Get original format from tenantData to preserve Array/Object format
  const tenantStore = useTenantStore.getState();
  const originalComponentSettings = tenantStore.tenantData?.componentSettings || {};

  // Backup all pages from pageComponentsByPage
  Object.entries(store.pageComponentsByPage).forEach(([page, components]) => {
    if (components && components.length > 0) {
      // Check if original format was Array or Object
      const originalFormat = originalComponentSettings[page];
      const isOriginalArray = Array.isArray(originalFormat);

      if (isOriginalArray) {
        // Preserve Array format
        backup[page] = components.map((comp) => ({
          id: comp.id,
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position ?? 0,
          layout: comp.layout || { row: 0, col: 0, span: 2 },
        }));
      } else {
        // Use Object format (key-value pairs)
        const pageSettings: Record<string, any> = {};
        components.forEach((comp) => {
          if (comp.id) {
            pageSettings[comp.id] = {
              type: comp.type,
              name: comp.name,
              componentName: comp.componentName,
              data: comp.data || {},
              position: comp.position ?? 0,
              layout: comp.layout || { row: 0, col: 0, span: 2 },
            };
          }
        });
        if (Object.keys(pageSettings).length > 0) {
          backup[page] = pageSettings;
        }
      }
    }
  });

  // Backup globalComponentsData
  // Ensure variant is inside header and footer data
  const headerVariant = store.globalHeaderVariant || "StaticHeader1";
  const footerVariant = store.globalFooterVariant || "StaticFooter1";
  
  if (store.globalComponentsData || store.globalHeaderData || store.globalFooterData) {
    backup._globalComponentsData = {
      header: {
        ...(store.globalHeaderData || {}),
        variant: headerVariant, // Ensure variant is inside header data
      },
      footer: {
        ...(store.globalFooterData || {}),
        variant: footerVariant, // Ensure variant is inside footer data
      },
      globalHeaderVariant: headerVariant,
      globalFooterVariant: footerVariant,
    };
  }

  return { backup, backupKey };
}

/**
 * Apply theme to all pages and global components
 */
export async function applyThemeToAllPages(themeNumber: ThemeNumber): Promise<void> {
  const store = useEditorStore.getState();

  // 1. Get current theme and create backup if exists
  const currentTheme = store.WebsiteLayout?.currentTheme;
  if (currentTheme) {
    const { backup, backupKey } = backupCurrentComponentSettings();
    if (backupKey && Object.keys(backup).length > 0) {
      store.setThemeBackup(backupKey, backup);
      // Also save backup in WebsiteLayout for persistence
      store.setWebsiteLayout({
        ...store.WebsiteLayout,
        [backupKey]: backup,
      });
    }
  }

  // 2. Clear ALL states before applying new theme
  // This ensures complete removal of all components and data from iframe
  store.clearAllStates();

  // 3. Check if backup exists for the target theme
  // If backup exists, restore from backup instead of applying default theme
  const targetBackupKey = `Theme${themeNumber}Backup`;
  const targetBackup = store.WebsiteLayout?.[targetBackupKey];

  // If backup exists and is not empty, restore from backup instead of applying default theme
  if (targetBackup && typeof targetBackup === 'object' && Object.keys(targetBackup).length > 0) {
    // Restore theme from backup
    await restoreThemeFromBackup(targetBackupKey);
    // restoreThemeFromBackup already updates currentTheme, so we're done
    return;
  }

  // 4. If no backup exists, continue with default theme application from lib folder
  // Load theme data from lib/themes/theme{themeNumber}Data.json
  const themeData = loadThemeData(themeNumber);

  // 5. Apply componentSettings or pages to pageComponentsByPage
  const newPageComponentsByPage: Record<string, any[]> = {};
  
  // Handle theme1 format (componentSettings) or theme2 format (pages)
  const pagesData = themeData.componentSettings || themeData.pages;
  
  if (pagesData) {
    Object.entries(pagesData).forEach(([page, pageComponents]) => {
      if (Array.isArray(pageComponents)) {
        // Convert array format to component instances
        const components = pageComponents.map((comp, index) => ({
          id: comp.id || `comp-${index}`,
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position ?? index,
          layout: comp.layout || { row: index, col: 0, span: 2 },
        }));

        newPageComponentsByPage[page] = components;

        // Also update component type states
        components.forEach((comp) => {
          if (comp.id && comp.type) {
            store.ensureComponentVariant(comp.type, comp.id, comp.data);
            store.setComponentData(comp.type, comp.id, comp.data);
          }
        });
      } else if (pageComponents && typeof pageComponents === "object") {
        // Handle object format (like componentSettings structure)
        const components = Object.entries(pageComponents).map(([id, comp]: [string, any], index) => ({
          id: id || comp.id || `comp-${index}`,
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position ?? index,
          layout: comp.layout || { row: index, col: 0, span: 2 },
        }));

        if (components.length > 0) {
          newPageComponentsByPage[page] = components;

          // Also update component type states
          components.forEach((comp) => {
            if (comp.id && comp.type) {
              store.ensureComponentVariant(comp.type, comp.id, comp.data);
              store.setComponentData(comp.type, comp.id, comp.data);
            }
          });
        }
      }
    });

    // Update pageComponentsByPage
    Object.entries(newPageComponentsByPage).forEach(([page, components]) => {
      store.setPageComponentsForPage(page, components);
    });

    // Force update current page components to trigger re-render
    const currentPage = store.currentPage;
    if (currentPage && newPageComponentsByPage[currentPage]) {
      store.forceUpdatePageComponents(currentPage, newPageComponentsByPage[currentPage]);
    }
  }

  // ⭐ CRITICAL: Add a small delay to ensure store updates are propagated
  // Then force one more update to guarantee sync (same as restoreThemeFromBackup)
  setTimeout(() => {
    const finalStore = useEditorStore.getState();
    const finalCurrentPage = finalStore.currentPage;
    if (finalCurrentPage && finalStore.pageComponentsByPage[finalCurrentPage]) {
      const finalComponents = finalStore.pageComponentsByPage[finalCurrentPage];
      console.log("[applyThemeToAllPages] Final force update for current page:", {
        page: finalCurrentPage,
        componentCount: finalComponents.length,
      });
      finalStore.forceUpdatePageComponents(finalCurrentPage, finalComponents);
    }
  }, 100);

  // 6. Apply globalComponentsData
  if (themeData.globalComponentsData) {
    const { header, footer, globalHeaderVariant, globalFooterVariant } = themeData.globalComponentsData;

    // Determine header variant
    const headerVariant = header?.variant || globalHeaderVariant || "StaticHeader1";
    
    if (headerVariant) {
      // Get default data for the new header theme (same as editor sidebar)
      const newDefaultHeaderData = createDefaultData("header", headerVariant);
      
      // Merge theme data with default data (theme data takes priority)
      // IMPORTANT: variant must be added AFTER spread to ensure it's always included
      const newHeaderDataWithVariant = {
        ...newDefaultHeaderData,
        ...header, // Override with theme-specific data
        variant: headerVariant, // Ensure variant is ALWAYS included (after spread)
      };

      // IMPORTANT: Update variant FIRST, then data (same as editor sidebar)
      store.setGlobalHeaderVariant(headerVariant);
      
      // Create new object to ensure React detects the change
      store.setGlobalHeaderData(newHeaderDataWithVariant);
      
      // Update globalComponentsData with BOTH variant and data
      // Ensure header data contains variant inside it
      store.setGlobalComponentsData({
        ...store.globalComponentsData,
        header: {
          ...newHeaderDataWithVariant,
          variant: headerVariant, // Ensure variant is in header data
        },
        globalHeaderVariant: headerVariant,
      } as any);
    }

    // Determine footer variant
    const footerVariant = footer?.variant || globalFooterVariant || "StaticFooter1";
    
    if (footerVariant) {
      // Get default data for the new footer theme (same as editor sidebar)
      const newDefaultFooterData = createDefaultData("footer", footerVariant);
      
      // Merge theme data with default data (theme data takes priority)
      // IMPORTANT: variant must be added AFTER spread to ensure it's always included
      const newFooterDataWithVariant = {
        ...newDefaultFooterData,
        ...footer, // Override with theme-specific data
        variant: footerVariant, // Ensure variant is ALWAYS included (after spread)
      };

      // IMPORTANT: Update variant FIRST, then data (same as editor sidebar)
      store.setGlobalFooterVariant(footerVariant);
      
      // Create new object to ensure React detects the change
      store.setGlobalFooterData(newFooterDataWithVariant);
      
      // Update globalComponentsData with BOTH variant and data
      // Ensure footer data contains variant inside it
      store.setGlobalComponentsData({
        ...store.globalComponentsData,
        footer: {
          ...newFooterDataWithVariant,
          variant: footerVariant, // Ensure variant is in footer data
        },
        globalFooterVariant: footerVariant,
      } as any);
    }
  }

  // 7. Update currentTheme
  store.setCurrentTheme(themeNumber);

  // 8. ⭐ CRITICAL: Update tenantStore to sync with editorStore
  // This ensures tenantData.componentSettings matches pageComponentsByPage
  // and tenantData.globalComponentsData matches globalComponentsData
  const tenantStore = useTenantStore.getState();
  const currentTenantData = tenantStore.tenantData;

  if (currentTenantData) {
    // Convert pageComponentsByPage to componentSettings format
    // Preserve original format (Array or Object) from themeData or tenantData
    const updatedComponentSettings: Record<string, any> = {};
    const originalComponentSettings = currentTenantData.componentSettings || {};
    const themePagesData = themeData.componentSettings || themeData.pages || {};
    
    Object.entries(store.pageComponentsByPage).forEach(([page, components]) => {
      if (components && components.length > 0) {
        // Check if theme format or original format was Array
        const themeFormat = themePagesData[page];
        const originalFormat = originalComponentSettings[page];
        const isArrayFormat = Array.isArray(themeFormat) || Array.isArray(originalFormat);

        if (isArrayFormat) {
          // Preserve Array format
          updatedComponentSettings[page] = components.map((comp) => ({
            id: comp.id,
            type: comp.type,
            name: comp.name,
            componentName: comp.componentName,
            data: comp.data || {},
            position: comp.position ?? 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          }));
        } else {
          // Use Object format (key-value pairs)
          const pageSettings: Record<string, any> = {};
          components.forEach((comp) => {
            if (comp.id) {
              pageSettings[comp.id] = {
                type: comp.type,
                name: comp.name,
                componentName: comp.componentName,
                data: comp.data || {},
                position: comp.position ?? 0,
                layout: comp.layout || { row: 0, col: 0, span: 2 },
              };
            }
          });
          if (Object.keys(pageSettings).length > 0) {
            updatedComponentSettings[page] = pageSettings;
          }
        }
      }
    });

    // Update globalComponentsData in tenantStore
    const updatedGlobalComponentsData = {
      ...store.globalComponentsData,
      header: {
        ...(store.globalHeaderData || {}),
        variant: store.globalHeaderVariant || "StaticHeader1",
      },
      footer: {
        ...(store.globalFooterData || {}),
        variant: store.globalFooterVariant || "StaticFooter1",
      },
      globalHeaderVariant: store.globalHeaderVariant || "StaticHeader1",
      globalFooterVariant: store.globalFooterVariant || "StaticFooter1",
    };

    // Update tenantStore with new data
    useTenantStore.setState({
      tenantData: {
        ...currentTenantData,
        componentSettings: updatedComponentSettings,
        globalComponentsData: updatedGlobalComponentsData,
        WebsiteLayout: store.WebsiteLayout,
      },
    });

    console.log("[applyThemeToAllPages] Updated tenantStore:", {
      componentSettingsPages: Object.keys(updatedComponentSettings).length,
      hasGlobalComponentsData: !!updatedGlobalComponentsData,
      currentTheme: themeNumber,
    });
  }
}

/**
 * Restore theme from backup
 */
export async function restoreThemeFromBackup(backupKey: string): Promise<void> {
  const store = useEditorStore.getState();
  // Read backup from WebsiteLayout instead of themeBackup
  const backup = store.WebsiteLayout?.[backupKey];

  if (!backup || Object.keys(backup).length === 0) {
    throw new Error("No backup found to restore");
  }

  // Extract theme number from backup key (Theme1Backup -> 1, Theme10Backup -> 10, etc.)
  // Regex pattern supports any number of digits (1, 2, 10, 11, 100, etc.)
  const themeMatch = backupKey.match(/Theme(\d+)Backup/);
  const restoredThemeNumber = themeMatch ? parseInt(themeMatch[1], 10) : null;

  // 1. Clear ALL states before restoring from backup
  // This ensures complete removal of all components and data from iframe
  store.clearAllStates();

  // 2. Restore globalComponentsData from backup (complete replacement)
  if (backup._globalComponentsData) {
    const globalData = backup._globalComponentsData;
    
    // Determine header variant
    const headerVariant = globalData.globalHeaderVariant || globalData.header?.variant || "StaticHeader1";
    
    // Replace header completely
    if (globalData.header) {
      const headerDataWithVariant = {
        ...globalData.header,
        variant: headerVariant,
      };
      store.setGlobalHeaderData(headerDataWithVariant);
      store.setGlobalHeaderVariant(headerVariant);
    }
    
    // Determine footer variant
    const footerVariant = globalData.globalFooterVariant || globalData.footer?.variant || "StaticFooter1";
    
    // Replace footer completely
    if (globalData.footer) {
      const footerDataWithVariant = {
        ...globalData.footer,
        variant: footerVariant,
      };
      store.setGlobalFooterData(footerDataWithVariant);
      store.setGlobalFooterVariant(footerVariant);
    }
    
    // Replace globalComponentsData completely (no spread with existing data)
    // This ensures complete replacement, not merge
    const restoredGlobalComponentsData: any = {
      globalHeaderVariant: headerVariant,
      globalFooterVariant: footerVariant,
    };
    
    if (globalData.header) {
      restoredGlobalComponentsData.header = {
        ...globalData.header,
        variant: headerVariant,
      };
    }
    
    if (globalData.footer) {
      restoredGlobalComponentsData.footer = {
        ...globalData.footer,
        variant: footerVariant,
      };
    }
    
    store.setGlobalComponentsData(restoredGlobalComponentsData);
  }

  // 3. Restore all pages from backup with force update
  Object.entries(backup).forEach(([page, pageSettings]) => {
    // Skip globalComponentsData backup - already handled
    if (page === "_globalComponentsData") {
      return;
    }

    let components: any[] = [];

    // Handle both Array and Object formats
    if (Array.isArray(pageSettings)) {
      // Array format: [component1, component2, ...]
      components = pageSettings.map((comp: any, index: number) => ({
        id: comp.id || `comp-${index}`,
        type: comp.type,
        name: comp.name,
        componentName: comp.componentName,
        data: comp.data || {},
        position: comp.position ?? index,
        layout: comp.layout || { row: index, col: 0, span: 2 },
      }));
    } else if (pageSettings && typeof pageSettings === "object") {
      // Object format: { id1: component1, id2: component2, ... }
      components = Object.entries(pageSettings).map(([id, comp]: [string, any], index: number) => ({
        id: id || comp.id || `comp-${index}`,
        type: comp.type,
        name: comp.name,
        componentName: comp.componentName,
        data: comp.data || {},
        position: comp.position ?? index,
        layout: comp.layout || { row: index, col: 0, span: 2 },
      }));
    }

    if (components.length > 0) {
      // Set page components
      store.setPageComponentsForPage(page, components);
      
      // Force update for this page to ensure immediate re-render
      store.forceUpdatePageComponents(page, components);

      // Update component type states for each component
      components.forEach((comp) => {
        if (comp.id && comp.type) {
          store.ensureComponentVariant(comp.type, comp.id, comp.data);
          store.setComponentData(comp.type, comp.id, comp.data);
        }
      });
    }
  });

  // 4. Force update current page components to trigger re-render
  // This ensures the current page is updated even if it was already in the backup
  const currentPage = store.currentPage;
  let currentPageComponents: any[] = [];
  
  if (currentPage && backup[currentPage]) {
    const pageSettings = backup[currentPage];
    
    // Handle both Array and Object formats
    if (Array.isArray(pageSettings)) {
      currentPageComponents = pageSettings.map((comp: any, index: number) => ({
        id: comp.id || `comp-${index}`,
        type: comp.type,
        name: comp.name,
        componentName: comp.componentName,
        data: comp.data || {},
        position: comp.position ?? index,
        layout: comp.layout || { row: index, col: 0, span: 2 },
      }));
    } else if (pageSettings && typeof pageSettings === "object") {
      currentPageComponents = Object.entries(pageSettings).map(([id, comp]: [string, any], index: number) => ({
        id: id || comp.id || `comp-${index}`,
        type: comp.type,
        name: comp.name,
        componentName: comp.componentName,
        data: comp.data || {},
        position: comp.position ?? index,
        layout: comp.layout || { row: index, col: 0, span: 2 },
      }));
    }
    
    if (currentPageComponents.length > 0) {
      // Force update current page to ensure immediate re-render in iframe
      store.forceUpdatePageComponents(currentPage, currentPageComponents);
    }
  } else if (currentPage && store.pageComponentsByPage[currentPage]) {
    // If current page exists in store but not in backup, use store data
    currentPageComponents = store.pageComponentsByPage[currentPage];
  }

  // 5. Restore currentTheme if we extracted it from backup key
  // This will also set themeChangeTimestamp to force sync
  if (restoredThemeNumber) {
    store.setCurrentTheme(restoredThemeNumber);
  }

  // 6. ⭐ CRITICAL: Add a small delay to ensure store updates are propagated
  // Then force one more update to guarantee sync
  setTimeout(() => {
    const finalStore = useEditorStore.getState();
    const finalCurrentPage = finalStore.currentPage;
    if (finalCurrentPage && finalStore.pageComponentsByPage[finalCurrentPage]) {
      const finalComponents = finalStore.pageComponentsByPage[finalCurrentPage];
      console.log("[restoreThemeFromBackup] Final force update for current page:", {
        page: finalCurrentPage,
        componentCount: finalComponents.length,
      });
      finalStore.forceUpdatePageComponents(finalCurrentPage, finalComponents);
    }
  }, 100);

  // 7. Clear themeBackup after restoring
  store.setThemeBackup(null, null);

  // 8. ⭐ CRITICAL: Update tenantStore to sync with editorStore
  // This ensures tenantData.componentSettings matches pageComponentsByPage
  // and tenantData.globalComponentsData matches globalComponentsData
  const tenantStore = useTenantStore.getState();
  const currentTenantData = tenantStore.tenantData;

  if (currentTenantData) {
    // Convert pageComponentsByPage to componentSettings format
    // Preserve original format (Array or Object) from backup
    const updatedComponentSettings: Record<string, any> = {};
    
    Object.entries(store.pageComponentsByPage).forEach(([page, components]) => {
      if (components && components.length > 0) {
        // Check if backup format was Array or Object
        const backupFormat = backup[page];
        const isBackupArray = Array.isArray(backupFormat);

        if (isBackupArray) {
          // Preserve Array format from backup
          updatedComponentSettings[page] = components.map((comp) => ({
            id: comp.id,
            type: comp.type,
            name: comp.name,
            componentName: comp.componentName,
            data: comp.data || {},
            position: comp.position ?? 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          }));
        } else {
          // Use Object format (key-value pairs)
          const pageSettings: Record<string, any> = {};
          components.forEach((comp) => {
            if (comp.id) {
              pageSettings[comp.id] = {
                type: comp.type,
                name: comp.name,
                componentName: comp.componentName,
                data: comp.data || {},
                position: comp.position ?? 0,
                layout: comp.layout || { row: 0, col: 0, span: 2 },
              };
            }
          });
          if (Object.keys(pageSettings).length > 0) {
            updatedComponentSettings[page] = pageSettings;
          }
        }
      }
    });

    // Update globalComponentsData in tenantStore from restored backup
    const updatedGlobalComponentsData = {
      ...store.globalComponentsData,
      header: {
        ...(store.globalHeaderData || {}),
        variant: store.globalHeaderVariant || "StaticHeader1",
      },
      footer: {
        ...(store.globalFooterData || {}),
        variant: store.globalFooterVariant || "StaticFooter1",
      },
      globalHeaderVariant: store.globalHeaderVariant || "StaticHeader1",
      globalFooterVariant: store.globalFooterVariant || "StaticFooter1",
    };

    // Update tenantStore with restored data
    useTenantStore.setState({
      tenantData: {
        ...currentTenantData,
        componentSettings: updatedComponentSettings,
        globalComponentsData: updatedGlobalComponentsData,
        WebsiteLayout: store.WebsiteLayout,
      },
    });

    console.log("[restoreThemeFromBackup] Updated tenantStore:", {
      componentSettingsPages: Object.keys(updatedComponentSettings).length,
      hasGlobalComponentsData: !!updatedGlobalComponentsData,
      restoredTheme: restoredThemeNumber,
    });
  }
}

