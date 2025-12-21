// context/EditorProvider.tsx
"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorStore } from "./editorStore";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

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

    const payload: any = {
      tenantId: tenantId || "",
      pages: state.pageComponentsByPage,
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
            themesBackup[key] = state.WebsiteLayout[key];
          }
        }
      });
    }
    
    // Add ThemesBackup to payload if it has any backups
    if (Object.keys(themesBackup).length > 0) {
      payload.ThemesBackup = themesBackup;
    }


    // Send to backend to persist
    await axiosInstance
      .post("/v1/tenant-website/save-pages", payload)
      .then(() => {
        closeDialog();
        toast.success("Changes saved successfully!");
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
