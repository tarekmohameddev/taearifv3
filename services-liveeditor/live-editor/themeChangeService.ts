import { useEditorStore } from "@/context-liveeditor/editorStore";
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

  // Backup all pages from pageComponentsByPage
  Object.entries(store.pageComponentsByPage).forEach(([page, components]) => {
    if (components && components.length > 0) {
      const pageSettings: Record<string, any> = {};
      components.forEach((comp) => {
        if (comp.id) {
          pageSettings[comp.id] = {
            type: comp.type,
            name: comp.name,
            componentName: comp.componentName,
            data: comp.data,
            position: comp.position,
            layout: comp.layout,
          };
        }
      });
      if (Object.keys(pageSettings).length > 0) {
        backup[page] = pageSettings;
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

  // 2. Load theme data
  const themeData = loadThemeData(themeNumber);

  // 3. Apply componentSettings or pages to pageComponentsByPage
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

  // 4. Apply globalComponentsData
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

  // 5. Update currentTheme
  store.setCurrentTheme(themeNumber);
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

  // Restore pages from backup
  Object.entries(backup).forEach(([page, pageSettings]) => {
    // Skip globalComponentsData backup - handle it separately
    if (page === "_globalComponentsData") {
      return;
    }

    if (pageSettings && typeof pageSettings === "object" && !Array.isArray(pageSettings)) {
      const components = Object.entries(pageSettings).map(([id, comp]: [string, any]) => ({
        id,
        type: comp.type,
        name: comp.name,
        componentName: comp.componentName,
        data: comp.data || {},
        position: comp.position ?? 0,
        layout: comp.layout || { row: 0, col: 0, span: 2 },
      }));

      store.setPageComponentsForPage(page, components);

      // Update component type states
      components.forEach((comp) => {
        if (comp.id && comp.type) {
          store.ensureComponentVariant(comp.type, comp.id, comp.data);
          store.setComponentData(comp.type, comp.id, comp.data);
        }
      });
    }
  });

  // Restore globalComponentsData if it exists in backup
  if (backup._globalComponentsData) {
    const globalData = backup._globalComponentsData;
    
    // Determine header variant (from globalHeaderVariant or header.variant)
    const headerVariant = globalData.globalHeaderVariant || globalData.header?.variant || "StaticHeader1";
    
    if (globalData.header) {
      // Ensure variant is inside header data
      const headerDataWithVariant = {
        ...globalData.header,
        variant: headerVariant,
      };
      store.setGlobalHeaderData(headerDataWithVariant);
      store.setGlobalHeaderVariant(headerVariant);
      store.setGlobalComponentsData({
        ...store.globalComponentsData,
        header: headerDataWithVariant,
        globalHeaderVariant: headerVariant,
      } as any);
    }
    
    // Determine footer variant (from globalFooterVariant or footer.variant)
    const footerVariant = globalData.globalFooterVariant || globalData.footer?.variant || "StaticFooter1";
    
    if (globalData.footer) {
      // Ensure variant is inside footer data
      const footerDataWithVariant = {
        ...globalData.footer,
        variant: footerVariant,
      };
      store.setGlobalFooterData(footerDataWithVariant);
      store.setGlobalFooterVariant(footerVariant);
      store.setGlobalComponentsData({
        ...store.globalComponentsData,
        footer: footerDataWithVariant,
        globalFooterVariant: footerVariant,
      } as any);
    }
  }

  // Force update current page components to trigger re-render
  const currentPage = store.currentPage;
  if (currentPage && backup[currentPage]) {
    const pageSettings = backup[currentPage];
    if (pageSettings && typeof pageSettings === "object" && !Array.isArray(pageSettings)) {
      const components = Object.entries(pageSettings).map(([id, comp]: [string, any]) => ({
        id,
        type: comp.type,
        name: comp.name,
        componentName: comp.componentName,
        data: comp.data || {},
        position: comp.position ?? 0,
        layout: comp.layout || { row: 0, col: 0, span: 2 },
      }));
      store.forceUpdatePageComponents(currentPage, components);
    }
  }

  // Restore currentTheme if we extracted it from backup key
  if (restoredThemeNumber) {
    store.setCurrentTheme(restoredThemeNumber);
  }

  // Clear themeBackup after restoring
  store.setThemeBackup(null, null);
}

