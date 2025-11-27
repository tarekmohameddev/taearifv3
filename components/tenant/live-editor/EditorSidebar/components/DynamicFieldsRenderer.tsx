"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { FieldDefinition } from "@/componentsStructure/types";
import { DynamicFieldsRendererProps } from "../types";
import { normalizePath } from "../utils";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import {
  ColorFieldRenderer,
  ImageFieldRenderer,
  BooleanFieldRenderer,
  NumberFieldRenderer,
} from "./FieldRenderers";
import {
  ArrayFieldRenderer,
  ObjectFieldRenderer,
  BackgroundFieldRenderer,
  SimpleBackgroundFieldRenderer,
} from "./FieldRenderers/index";
import { TranslationFields } from "../TranslationFields";
import { logChange } from "@/lib-liveeditor/debugLogger";
import * as LucideIcons from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

export function DynamicFieldsRenderer({
  fields,
  componentType,
  variantId,
  onUpdateByPath,
  currentData,
}: DynamicFieldsRendererProps) {
  const t = useEditorT();
  const {
    tempData,
    updateByPath,
    componentGetters,
    ensureComponentVariant,
    getComponentData,
    setComponentData,
    updateComponentByPath,
    globalHeaderData,
    globalFooterData,
    updateGlobalHeaderByPath,
    updateGlobalFooterByPath,
    updateGlobalComponentByPath,
    globalComponentsData,
  } = useEditorStore();
  const { tenantData } = useTenantStore();

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

  const getValueByPath = useCallback(
    (path: string) => {
      // Validate path
      if (!path || typeof path !== "string") {
        console.warn("⚠️ [DynamicFieldsRenderer] Invalid path provided:", path);
        return undefined;
      }

      const segments = normalizePath(path).split(".").filter(Boolean);
      if (segments.length === 0) {
        console.warn("⚠️ [DynamicFieldsRenderer] Empty path segments:", path);
        return undefined;
      }

      // Use currentData first, then fall back to other sources
      let cursor: any = {};

      // Use currentData if provided (unified system)
      if (currentData && Object.keys(currentData).length > 0) {
        cursor = currentData;
      } else if (variantId === "global-header") {
        // Use globalComponentsData for global header
        cursor = globalComponentsData?.header || tempData || {};

        // Validate global component data structure
        if (cursor && typeof cursor === "object") {
          const requiredFields = ["visible", "menu", "logo", "colors"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required header fields:",
              missingFields,
            );
          }
        }
      } else if (variantId === "global-footer") {
        // Use globalComponentsData for global footer
        cursor = globalComponentsData?.footer || tempData || {};

        // Validate global component data structure
        if (cursor && typeof cursor === "object") {
          const requiredFields = ["visible", "content", "styling"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required footer fields:",
              missingFields,
            );
          }
        }
      } else if (
        variantId === "global-header" ||
        variantId === "global-footer"
      ) {
        // For global components, always use tempData for editing (not global data)
        cursor = tempData || {};

        // Validate global component data structure
        if (
          variantId === "global-header" &&
          cursor &&
          typeof cursor === "object"
        ) {
          const requiredFields = ["visible", "menu", "logo", "colors"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required header fields:",
              missingFields,
            );
          }
        } else if (
          variantId === "global-footer" &&
          cursor &&
          typeof cursor === "object"
        ) {
          const requiredFields = ["visible", "content", "styling"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required footer fields:",
              missingFields,
            );
          }
        }
      } else if (componentType && variantId && COMPONENTS[componentType]) {
        // For regular components, prioritize tempData for live editing
        const componentData = getComponentData(componentType, variantId);

        // Always use tempData if it has data (for live editing)
        if (tempData && Object.keys(tempData).length > 0) {
          cursor = tempData;
        }
        // If tempData is empty but currentData is provided, use currentData (initial load)
        else if (currentData && Object.keys(currentData).length > 0) {
          cursor = currentData;
        }
        // Fall back to componentData from store
        else if (componentData && Object.keys(componentData).length > 0) {
          cursor = componentData;
        } else {
          cursor = {};
        }
      } else {
        // Fall back to tempData
        cursor = tempData || {};
      }

      // Special handling for halfTextHalfImage3 imagePosition
      if (path === "content.imagePosition" && cursor && cursor.imagePosition) {
        return cursor.imagePosition;
      }

      // Special handling for halfTextHalfImage3 layout.direction
      if (
        path === "layout.direction" &&
        cursor &&
        cursor.layout &&
        cursor.layout.direction
      ) {
        return cursor.layout.direction;
      }

      for (const seg of segments) {
        if (cursor == null) return undefined;
        cursor = cursor[seg as any];
      }

      return cursor;
    },
    [
      currentData,
      tempData,
      componentType,
      variantId,
      getComponentData,
      globalHeaderData,
      globalFooterData,
      globalComponentsData,
    ],
  );

  const updateValue = useCallback(
    (path: string, value: any) => {
      // Special handling for halfTextHalfImage3 imagePosition
      if (
        path === "content.imagePosition" &&
        componentType === "halfTextHalfImage"
      ) {
        // Update both content.imagePosition and top-level imagePosition for consistency
        if (onUpdateByPath) {
          onUpdateByPath("content.imagePosition", value);
          onUpdateByPath("imagePosition", value);
        } else if (componentType && variantId) {
          updateComponentByPath(
            componentType,
            variantId,
            "content.imagePosition",
            value,
          );
          updateComponentByPath(
            componentType,
            variantId,
            "imagePosition",
            value,
          );
        }
        return;
      }

      // Special handling for halfTextHalfImage3 layout.direction
      if (
        path === "layout.direction" &&
        componentType === "halfTextHalfImage"
      ) {
        // Update layout.direction
        if (onUpdateByPath) {
          onUpdateByPath("layout.direction", value);
        } else if (componentType && variantId) {
          updateComponentByPath(
            componentType,
            variantId,
            "layout.direction",
            value,
          );
        }
        return;
      }

      if (onUpdateByPath) {
        // For regular components, prioritize tempData updates for immediate UI feedback
        if (
          componentType &&
          variantId &&
          variantId !== "global-header" &&
          variantId !== "global-footer"
        ) {
          // Use updateByPath to update tempData for immediate UI feedback
          updateByPath(path, value);
        } else {
          // Use the unified update function for global components
          onUpdateByPath(path, value);
        }
      } else {
        // Check if this is a global component
        if (variantId === "global-header") {
          // Use tempData for global header components
          updateByPath(path, value);
        } else if (variantId === "global-footer") {
          // Use tempData for global footer components
          updateByPath(path, value);
        } else if (componentType && variantId) {
          // For regular components, always use tempData for live editing
          // This ensures that changes are immediately visible in the UI
          updateByPath(path, value);
        } else {
          updateByPath(path, value);
        }
      }
    },
    [
      onUpdateByPath,
      updateByPath,
      updateComponentByPath,
      updateGlobalHeaderByPath,
      updateGlobalFooterByPath,
      componentType,
      variantId,
      globalHeaderData,
      globalFooterData,
      updateGlobalComponentByPath,
    ],
  );

  const hasFrom = fields.some((f) => f.key === "colors.from");
  const hasTo = fields.some((f) => f.key === "colors.to");
  const hasGradientPair = hasFrom && hasTo;
  const backgroundMode: string =
    (getValueByPath("settings.backgroundMode") as any) ||
    (hasGradientPair ? "gradient" : "solid");

  // Create icon cache using useMemo for better performance
  const iconCache = useMemo(() => {
    const cache = new Map<string, React.ComponentType<any> | null>();
    
    // Pre-populate cache with common icons
    const commonLucideIcons = ['UserCircle', 'Building2', 'GraduationCap', 'TrendingUp', 'Briefcase', 'Settings', 'Home', 'MapPin', 'Phone', 'Mail'];
    commonLucideIcons.forEach(iconName => {
      const icon = (LucideIcons as any)[iconName];
      if (icon) cache.set(`lucide:${iconName}`, icon);
    });
    
    return cache;
  }, []);

  // Helper function to get icon component dynamically with caching
  const getIconComponent = useCallback((iconName: string, iconLibrary?: string) => {
    if (!iconName) return null;
    
    const cacheKey = `${iconLibrary || "lucide"}:${iconName}`;
    
    // Check cache first
    if (iconCache.has(cacheKey)) {
      return iconCache.get(cacheKey) || null;
    }
    
    try {
      let icon: React.ComponentType<any> | null = null;
      
      if (iconLibrary === "lucide" || !iconLibrary) {
        // Try lucide-react icons
        icon = (LucideIcons as any)[iconName] || null;
        if (icon) {
          iconCache.set(cacheKey, icon);
          return icon;
        }
      }
      
      if (iconLibrary === "react-icons") {
        // Try react-icons Font Awesome first (most common)
        if (iconName.startsWith('Fa')) {
          icon = (ReactIconsFa as any)[iconName] || null;
          if (icon) {
            iconCache.set(cacheKey, icon);
            return icon;
          }
        }
        
        // Try react-icons Material Design
        if (iconName.startsWith('Md')) {
          icon = (ReactIconsMd as any)[iconName] || null;
          if (icon) {
            iconCache.set(cacheKey, icon);
            return icon;
          }
        }
        
        // Try all react-icons if prefix doesn't match
        icon = (ReactIconsFa as any)[iconName] || (ReactIconsMd as any)[iconName] || null;
        if (icon) {
          iconCache.set(cacheKey, icon);
          return icon;
        }
      }
      
      // Fallback: try lucide-react if no library specified
      if (!icon) {
        icon = (LucideIcons as any)[iconName] || null;
        if (icon) {
          iconCache.set(cacheKey, icon);
          return icon;
        }
      }
      
      // Cache null result to avoid repeated lookups
      iconCache.set(cacheKey, null);
      return null;
    } catch (error) {
      iconCache.set(cacheKey, null);
      return null;
    }
  }, [iconCache]);
  
  // Memoize React Icon check function
  const isReactIcon = useCallback((iconName: string): boolean => {
    return iconName.startsWith('Fa') || 
           iconName.startsWith('Md') || 
           iconName.startsWith('Io') ||
           iconName.startsWith('Bi') ||
           iconName.startsWith('Bs') ||
           iconName.startsWith('Hi') ||
           iconName.startsWith('Ai') ||
           iconName.startsWith('Ti') ||
           iconName.startsWith('Gi') ||
           iconName.startsWith('Si') ||
           iconName.startsWith('Ri') ||
           iconName.startsWith('Tb') ||
           iconName.startsWith('Vsc') ||
           iconName.startsWith('Wi') ||
           iconName.startsWith('Di') ||
           iconName.startsWith('Im');
  }, []);

  const renderField = (def: FieldDefinition, basePath?: string) => {
    if (!def) {
      return null;
    }

    // إصلاح مشكلة تكرار المفاتيح في المسار
    let path: string;
    if (basePath) {
      // إذا كان basePath ينتهي بـ def.key، لا تضيفه مرة أخرى
      if (basePath.endsWith(`.${def.key}`) || basePath === def.key) {
        path = basePath;
      } else {
        path = `${basePath}.${def.key}`;
      }
    } else {
      path = def.key;
    }

    const normalizedPath = normalizePath(path);
    let value = getValueByPath(normalizedPath);
    
    // Ensure value is a string for color fields (not an object)
    if (def.type === "color") {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // If value is an object, it might contain useDefaultColor and globalColorType
        // Extract the actual color string value
        value = value.value || value.color || "";
      } else if (typeof value !== "string") {
        // If value is not a string, convert it to string or use empty string
        value = value ? String(value) : "";
      }
    }

    // دعم الـ conditional rendering
    if (def.condition) {
      const conditionFieldValue = getValueByPath(def.condition.field);
      if (conditionFieldValue !== def.condition.value) {
        return null; // لا تعرض الحقل إذا لم تتحقق الشروط
      }
    }

    switch (def.type) {
      case "array": {
        return (
          <ArrayFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={Array.isArray(value) ? value : []}
            updateValue={updateValue}
            getValueByPath={getValueByPath}
            renderField={renderField}
          />
        );
      }
      case "text":
      case "image":
        if (def.type === "image")
          return (
            <ImageFieldRenderer
              label={def.label}
              path={normalizedPath}
              value={value || ""}
              updateValue={updateValue}
            />
          );
        return (
          <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <label className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-700">
                  {def.label}
                </span>
                {def.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {def.description}
                  </p>
                )}
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                value={value || ""}
                onChange={(e) => updateValue(normalizedPath, e.target.value)}
                placeholder={def.placeholder || t("editor_sidebar.enter_text")}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 ${
                  value && value.length > 0
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200"
                }`}
              />
              {value && value.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            {def.min && value && value.length < def.min && (
              <p className="text-xs text-red-500 mt-2">
                Minimum {def.min} characters required ({value?.length || 0}/
                {def.min})
              </p>
            )}
            {def.max && value && value.length > def.max && (
              <p className="text-xs text-red-500 mt-2">
                Maximum {def.max} characters allowed ({value?.length || 0}/
                {def.max})
              </p>
            )}
            {def.max && value && value.length <= def.max && (
              <p className="text-xs text-slate-500 mt-2">
                {value?.length || 0}/{def.max} characters
              </p>
            )}
          </div>
        );
      case "textarea":
        return (
          <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <label className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-700">
                  {def.label}
                </span>
                {def.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {def.description}
                  </p>
                )}
              </div>
            </label>
            <div className="relative">
              <textarea
                value={value || ""}
                onChange={(e) => updateValue(normalizedPath, e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-700 resize-none ${
                  value && value.length > 0
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200"
                }`}
                rows={4}
                placeholder={
                  def.placeholder || t("editor_sidebar.enter_your_text")
                }
              />
              {value && value.length > 0 && (
                <div className="absolute right-3 top-3">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            {def.min && value && value.length < def.min && (
              <p className="text-xs text-red-500 mt-2">
                Minimum {def.min} characters required ({value?.length || 0}/
                {def.min})
              </p>
            )}
            {def.max && value && value.length > def.max && (
              <p className="text-xs text-red-500 mt-2">
                Maximum {def.max} characters allowed ({value?.length || 0}/
                {def.max})
              </p>
            )}
            {def.max && value && value.length <= def.max && (
              <p className="text-xs text-slate-500 mt-2">
                {value?.length || 0}/{def.max} characters
              </p>
            )}
          </div>
        );
      case "number":
        return (
          <NumberFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={value ?? 0}
            updateValue={updateValue}
          />
        );
      case "boolean":
        return (
          <BooleanFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={!!value}
            updateValue={updateValue}
          />
        );
      case "color": {
        // Only show useDefaultColor toggle if the field definition explicitly has useDefaultColor property
        // This prevents showing toggle for nested color fields that don't have useDefaultColor in their definition
        const hasUseDefaultColorInDef = def.useDefaultColor !== undefined;
        
        // Get useDefaultColor and globalColorType from field definition or data
        const useDefaultColorPath = `${normalizedPath}.useDefaultColor`;
        const globalColorTypePath = `${normalizedPath}.globalColorType`;
        
        // Get the current value from tempData or data, prioritizing tempData
        const currentUseDefaultColor = getValueByPath(useDefaultColorPath);
        const useDefaultColorValue = hasUseDefaultColorInDef
          ? (currentUseDefaultColor !== undefined ? currentUseDefaultColor : (def.useDefaultColor ?? true))
          : false;
        const globalColorTypeValue = getValueByPath(globalColorTypePath) ?? def.globalColorType ?? "primary";
        
        // Get branding colors from WebsiteLayout
        const primaryColor = tenantData?.WebsiteLayout?.branding?.colors?.primary || "#059669";
        const secondaryColor = tenantData?.WebsiteLayout?.branding?.colors?.secondary || "#059669";
        const accentColor = tenantData?.WebsiteLayout?.branding?.colors?.accent || "#059669";
        
        const getBrandingColor = (type: "primary" | "secondary" | "accent") => {
          switch (type) {
            case "primary": return primaryColor;
            case "secondary": return secondaryColor;
            case "accent": return accentColor;
            default: return primaryColor;
          }
        };

        // If useDefaultColor is not in the field definition, just show ColorFieldRenderer (no toggle)
        if (!hasUseDefaultColorInDef) {
          return (
            <ColorFieldRenderer
              label={def.label}
              path={normalizedPath}
              value={value || ""}
              updateValue={updateValue}
            />
          );
        }

        return (
          <div className="space-y-4 " >
            {/* Use Default Color Toggle */}
            <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                
                <label className="flex items-center space-x-3" >
                  <span className="text-sm font-semibold text-slate-700">
                  {def.label} -  {t("editor_sidebar.use_default_color") || "Use Default Color"}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => updateValue(useDefaultColorPath, !useDefaultColorValue)}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 transform hover:scale-105 ${
                    useDefaultColorValue
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-pressed={useDefaultColorValue}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      useDefaultColorValue ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {useDefaultColorValue
                  ? t("editor_sidebar.using_branding_color") || "Using branding color from general settings"
                  : t("editor_sidebar.using_custom_color") || "Using custom color"}
              </p>
            </div>

            {/* Global Color Type Dropdown (only shown when useDefaultColor = true) */}
            {useDefaultColorValue && (
              <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <label className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {t("editor_sidebar.branding_color_type") || "Branding Color Type"}
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={globalColorTypeValue}
                    onChange={(e) => updateValue(globalColorTypePath, e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium appearance-none cursor-pointer pr-10 ${
                      globalColorTypeValue && globalColorTypeValue.length > 0
                        ? "border-green-300 bg-green-50"
                        : "border-slate-200"
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="primary">
                      {t("editor_sidebar.primary_color") || "Primary Color"}
                    </option>
                    <option value="secondary">
                      {t("editor_sidebar.secondary_color") || "Secondary Color"}
                    </option>
                    <option value="accent">
                      {t("editor_sidebar.accent_color") || "Accent Color"}
                    </option>
                  </select>
                  {/* Color preview */}
                  <div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: getBrandingColor(globalColorTypeValue) }}
                  />
                </div>
              </div>
            )}

            {/* Custom Color Field (only shown when useDefaultColor = false) */}
            {!useDefaultColorValue && (
              <ColorFieldRenderer
                label={def.label}
                path={normalizedPath}
                value={typeof value === "string" ? value : ""}
                updateValue={(colorPath, colorValue) => {
                  // When updating custom color, ensure useDefaultColor remains false
                  // Update both the color value and useDefaultColor in a single operation
                  updateValue(colorPath, colorValue);
                  // Explicitly set useDefaultColor to false to prevent it from reverting to true
                  const currentUseDefaultColor = getValueByPath(useDefaultColorPath);
                  if (currentUseDefaultColor !== false) {
                    updateValue(useDefaultColorPath, false);
                  }
                }}
              />
            )}

            {/* Preview when using default color */}
            {/* {useDefaultColorValue && (
              <div className="group p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {t("editor_sidebar.current_color") || "Current Color"}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: getBrandingColor(globalColorTypeValue) }}
                    />
                    <span className="text-xs font-mono text-slate-600">
                      {getBrandingColor(globalColorTypeValue)}
                    </span>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        );
      }
      case "select": {
        // Pre-compute options with icons for better performance (only when showIcons is true)
        const optionsWithIcons = def.showIcons && def.options
          ? (def.options || []).map((opt) => {
              const IconComponent = opt.iconLibrary
                ? getIconComponent(opt.value, opt.iconLibrary)
                : null;
              
              const isReactIconValue = IconComponent ? isReactIcon(opt.value) : false;
              
              return {
                ...opt,
                IconComponent,
                isReactIconValue,
              };
            })
          : null;
        
        // Pre-compute selected option and icon
        const selectedOption = def.options?.find(opt => opt.value === value);
        const selectedIcon = selectedOption?.iconLibrary
          ? getIconComponent(selectedOption.value, selectedOption.iconLibrary)
          : null;
        
        return (
          <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <label className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-700">
                  {def.label}
                </span>
                {def.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {def.description}
                  </p>
                )}
              </div>
            </label>
            <div className="relative">
              {def.showIcons && optionsWithIcons ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium flex items-center justify-between ${
                      value && value.length > 0
                        ? "border-green-300 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {selectedOption ? (
                        <>
                          {selectedIcon && (
                            isReactIcon(selectedOption.value) ? (
                              React.createElement(selectedIcon, { className: "w-5 h-5", style: { fontSize: "20px", width: "20px", height: "20px", color: "currentColor" } })
                            ) : (
                              React.createElement(selectedIcon, { size: 20, className: "w-5 h-5", style: { color: "currentColor" } })
                            )
                          )}
                          <span>{selectedOption.label}</span>
                        </>
                      ) : (
                        <span className="text-slate-500">{def.placeholder || t("editor_sidebar.select_option")}</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[var(--radix-dropdown-menu-trigger-width)]">
                    {optionsWithIcons.map((opt) => {
                      const IconComponent = opt.IconComponent;
                      const isReactIconValue = opt.isReactIconValue;
                      const isSelected = opt.value === value;
                      
                      return (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => updateValue(normalizedPath, opt.value)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 w-full">
                            {IconComponent && (
                              isReactIconValue ? (
                                React.createElement(IconComponent, { className: "w-5 h-5", style: { fontSize: "20px", width: "20px", height: "20px" } })
                              ) : (
                                React.createElement(IconComponent, { size: 20, className: "w-5 h-5" })
                              )
                            )}
                            <span className="flex-1">{opt.label}</span>
                            {isSelected && <Check className="h-4 w-4 text-green-500" />}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium flex items-center justify-between ${
                      value && value.length > 0
                        ? "border-green-300 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <span className={value ? "" : "text-slate-500"}>
                      {def.options?.find(opt => opt.value === value)?.label || def.placeholder || t("editor_sidebar.select_option")}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[var(--radix-dropdown-menu-trigger-width)]">
                    {(def.options || []).map((opt) => {
                      const isSelected = opt.value === value;
                      return (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => updateValue(normalizedPath, opt.value)}
                          className="cursor-pointer"
                        >
                          <span className="flex-1">{opt.label}</span>
                          {isSelected && <Check className="h-4 w-4 text-green-500" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {def.options && def.options.length === 0 && (
              <p className="text-xs text-amber-500 mt-2">
                {t("editor_sidebar.no_options_available")}
              </p>
            )}
            {/* Debug info for select fields */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-2 text-xs text-gray-500">
                <div>
                  {t("editor_sidebar.current_value_debug", {
                    value: value || "undefined",
                  })}
                </div>
                <div>
                  {t("editor_sidebar.options_debug", {
                    options: JSON.stringify(def.options || []),
                  })}
                </div>
                <div>
                  {t("editor_sidebar.path_debug", { path: normalizedPath })}
                </div>
              </div>
            )}
          </div>
        );
      }
      case "object": {
        return (
          <ObjectFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={value}
            updateValue={updateValue}
            getValueByPath={getValueByPath}
            renderField={renderField}
          />
        );
      }
    }
    return null;
  };

  const backgroundField = fields.find((f) => f.key === "background") as any;

  return (
    <div className="space-y-4">
      {backgroundField && (
        <BackgroundFieldRenderer
          backgroundField={backgroundField}
          getValueByPath={getValueByPath}
          updateValue={updateValue}
          renderField={renderField}
        />
      )}

      {/* Simple mode support: when background fields are flattened (background.type, background.colors.from/to) */}
      {!backgroundField && (
        <SimpleBackgroundFieldRenderer
          fields={fields}
          getValueByPath={getValueByPath}
          updateValue={updateValue}
          renderField={renderField}
        />
      )}

      {fields
        .filter(
          (f) =>
            f.key !== "background" &&
            f.key !== "background.type" &&
            f.key !== "background.colors.from" &&
            f.key !== "background.colors.to",
        )
        .map((f, i) => (
          <div key={i}>{renderField(f)}</div>
        ))}
    </div>
  );
}
