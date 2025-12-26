import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";

interface UseVariantInitializationProps {
  variantId: string | null;
  componentType: string | null;
  tempData: any;
}

export const useVariantInitialization = ({
  variantId,
  componentType,
  tempData,
}: UseVariantInitializationProps) => {
  const {
    ensureComponentVariant,
    getComponentData,
    setComponentData,
  } = useEditorStore();

  // Initialize variant data if needed
  useEffect(() => {
    if (variantId && componentType && COMPONENTS[componentType]) {
      ensureComponentVariant(componentType, variantId);

      // For non-global components, ensure tempData is initialized with current component data
      if (variantId !== "global-header" && variantId !== "global-footer") {
        const componentData = getComponentData(componentType, variantId);

        if (
          componentData &&
          (!tempData || Object.keys(tempData).length === 0)
        ) {
          // Initialize tempData with current component data for live editing
          setComponentData(componentType, variantId, componentData);
        }
      }
    }
  }, [
    componentType,
    variantId,
    ensureComponentVariant,
    getComponentData,
    setComponentData,
    tempData,
  ]);
};

