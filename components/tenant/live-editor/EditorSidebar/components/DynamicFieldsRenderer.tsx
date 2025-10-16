"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { FieldDefinition } from "@/componentsStructure/types";
import { DynamicFieldsRendererProps } from "../types";
import { normalizePath } from "../utils";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
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
    const value = getValueByPath(normalizedPath);

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
      case "color":
        return (
          <ColorFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={value || ""}
            updateValue={updateValue}
          />
        );
      case "select":
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
              <select
                value={value || (def.options?.[0]?.value ?? "")}
                onChange={(e) => updateValue(normalizedPath, e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium appearance-none cursor-pointer pr-10 ${
                  value && value.length > 0
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
                {(def.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow for better visibility */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {value && value.length > 0 && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
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
