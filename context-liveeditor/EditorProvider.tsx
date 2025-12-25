// context/EditorProvider.tsx
"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorStore } from "./editorStore";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import useTenantStore from "./tenantStore";

export function EditorProvider({ children }: { children: ReactNode }) {
  const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
  const { userData } = useAuthStore();
  // tenantId يمكن أن يكون subdomain (tenant1) أو custom domain (hey.com)
  const tenantId = userData?.username;

  const confirmSave = async () => {
    // Execute any page-provided save logic first (if set)
    openSaveDialogFn();

    // Collect all component states from the editor store
    const state = useEditorStore.getState();

    // Get tenantData for username and websiteName
    const currentTenantData = useTenantStore.getState().tenantData;
    const username = currentTenantData?.username || tenantId || "";
    const websiteName = currentTenantData?.websiteName || tenantId || "";

    // Log detailed component info for each page
    Object.entries(state.pageComponentsByPage).forEach(([page, components]) => {
      // Log detailed data for each component
      components.forEach((component) => {});
    });

    // Ensure header and footer contain variant inside their data
    const headerData = state.globalComponentsData?.header || {};
    const footerData = state.globalComponentsData?.footer || {};
    const headerVariant = state.globalHeaderVariant || "StaticHeader1";
    const footerVariant = state.globalFooterVariant || "StaticFooter1";

    // Convert pageComponentsByPage (array format) to componentSettings (object format)
    const componentSettings: Record<string, any> = {};
    Object.entries(state.pageComponentsByPage).forEach(
      ([pageSlug, components]) => {
        componentSettings[pageSlug] = {};
        components.forEach((comp: any) => {
          componentSettings[pageSlug][comp.id] = {
            type: comp.type,
            name: comp.name,
            componentName: comp.componentName,
            data: comp.data || {},
            position: comp.position || 0,
            layout: (comp as any).layout || { row: 0, col: 0, span: 2 },
          };
        });
      },
    );

    const payload: any = {
      username: username,
      websiteName: websiteName,
      componentSettings: componentSettings,
      globalComponentsData: {
        ...state.globalComponentsData,
        header: {
          ...headerData,
          variant: headerVariant, // Ensure variant is inside header data
        },
        footer: {
          ...footerData,
          variant: footerVariant, // Ensure variant is inside footer data
        },
        globalHeaderVariant: headerVariant,
        globalFooterVariant: footerVariant,
      },
      WebsiteLayout: state.WebsiteLayout || {
        metaTags: {
          pages: [],
        },
      },
    };

    // Collect all theme backups from WebsiteLayout into ThemesBackup object
    // Exclude the current theme (it's already in pages and globalComponentsData)
    const themesBackup: Record<string, any> = {};
    const currentTheme = state.WebsiteLayout?.currentTheme;
    
    // Iterate through WebsiteLayout keys to find Theme*Backup keys
    // Regex pattern /^Theme\d+Backup$/ supports any number (1, 2, 10, 11, 100, etc.)
    if (state.WebsiteLayout) {
      Object.keys(state.WebsiteLayout).forEach((key) => {
        if (key.match(/^Theme\d+Backup$/)) {
          // Extract theme number from backup key (Theme1Backup -> 1, Theme10Backup -> 10, etc.)
          const themeMatch = key.match(/^Theme(\d+)Backup$/);
          const backupThemeNumber = themeMatch ? parseInt(themeMatch[1], 10) : null;
          
          // Only include backups that are NOT the current theme
          if (backupThemeNumber !== null && backupThemeNumber !== currentTheme) {
            themesBackup[key] = (state.WebsiteLayout as any)[key];
          }
        }
      });
    }
    
    // Add ThemesBackup to payload if it has any backups
    if (Object.keys(themesBackup).length > 0) {
      payload.ThemesBackup = themesBackup;
    }

    // ⭐ Add StaticPages to payload if it has any data
    const hasStaticPagesData =
      state.staticPagesData &&
      typeof state.staticPagesData === "object" &&
      Object.keys(state.staticPagesData).length > 0;

    if (hasStaticPagesData) {
      payload.StaticPages = state.staticPagesData;
    }

    // Send to backend to persist
    await axiosInstance
      .post("/v1/tenant-website/save-pages", payload)
      .then(() => {
        closeDialog();
        toast.success("Changes saved successfully!");

        // ⭐ NEW: Update tenantStore.tenantData with saved data
        // This prevents loading old data when navigating back to a page
        const currentTenantData = useTenantStore.getState().tenantData;

        if (currentTenantData) {
          // Convert pageComponentsByPage to componentSettings format
          const updatedComponentSettings: Record<string, any> = {};
          Object.entries(state.pageComponentsByPage).forEach(
            ([pageSlug, components]) => {
              updatedComponentSettings[pageSlug] = {};
              components.forEach((comp: any) => {
                updatedComponentSettings[pageSlug][comp.id] = {
                  type: comp.type,
                  name: comp.name,
                  componentName: comp.componentName,
                  data: comp.data || {},
                  position: comp.position || 0,
                  layout: (comp as any).layout || { row: 0, col: 0, span: 2 },
                };
              });
            },
          );

          // Update tenantStore with new data
          useTenantStore.setState({
            tenantData: {
              ...currentTenantData,
              componentSettings: updatedComponentSettings,
              globalComponentsData: state.globalComponentsData,
              WebsiteLayout: state.WebsiteLayout,
            },
          });

          console.log("✅ tenantStore.tenantData updated after save");
        }
      })
      .catch((e) => {
        console.error("[Save All] Error saving pages:", e);
        closeDialog();
        toast.error(
          e.response?.data?.message || e.message || "Failed to save changes",
        );
      });
  };

  return (
    <>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        isThemeConfirmation={false}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </>
  );
}
