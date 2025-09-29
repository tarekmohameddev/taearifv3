// context/EditorProvider.tsx
"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorStore } from "./editorStore";
import useAuthStore from "@/context/AuthContext";

export function EditorProvider({ children }: { children: ReactNode }) {
  const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
  const { userData } = useAuthStore();
  const tenantId = userData?.username;

  const confirmSave = () => {
    // Execute any page-provided save logic first (if set)
    openSaveDialogFn();

    // Collect all component states from the editor store
    const state = useEditorStore.getState();
    
    
    // Log detailed component info for each page
    Object.entries(state.pageComponentsByPage).forEach(([page, components]) => {
      
      // Log detailed data for each component
      components.forEach(component => {
      });
    });
    
    const payload = {
      tenantId: tenantId || "",
      pages: state.pageComponentsByPage,
      globalComponentsData: state.globalComponentsData,
    };


    

    // Send to backend to persist
    fetch("/api/tenant/save-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || `Failed with status ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        closeDialog();
        toast.success("Changes saved successfully!");
      })
      .catch((e) => {
        console.error("[Save All] Error saving pages:", e);
        closeDialog();
        toast.error(e.message || "Failed to save changes");
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
