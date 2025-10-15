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

    const payload = {
      tenantId: tenantId || "",
      pages: state.pageComponentsByPage,
      globalComponentsData: state.globalComponentsData,
      WebsiteLayout: state.WebsiteLayout || {
        metaTags: {
          pages: [],
        },
      },
    };

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
