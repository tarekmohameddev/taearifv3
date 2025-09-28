"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SaveConfirmationDialog({
  open,
  onClose,
  onConfirm,
  isThemeConfirmation = false,
}: {
  open: boolean;
  isThemeConfirmation: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  // Reset loading state when dialog closes
  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  // Reset loading state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await Promise.resolve(onConfirm());
      
      // Add a timeout as fallback in case dialog doesn't close
      setTimeout(() => {
        setLoading(false);
      }, 5000); // 5 seconds timeout
      
    } catch (error) {
      console.error('Save operation failed:', error);
      // Reset loading state on error
      setLoading(false);
    }
    // Note: We don't reset loading here because the dialog should close on success
    // If the dialog doesn't close, the parent component should handle the loading state
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isThemeConfirmation
              ? "Apply Theme and Discard Custom Edits?"
              : "Confirm Save"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isThemeConfirmation ? (
              <>
                This action will{" "}
                <strong className="text-red-600">
                  permanently remove all your custom edits
                </strong>{" "}
                and replace them with the selected theme defaults.
                <br />
                This cannot be undone.
              </>
            ) : (
              "All your changes will be saved and applied immediately."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            aria-busy={loading}
            className={isThemeConfirmation ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {loading
              ? "Loading..."
              : isThemeConfirmation
                ? "Apply Theme"
                : "Confirm Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
