"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ComponentData, ComponentInstance } from "@/lib-liveeditor/types";
import { ThemeSelector } from "../ThemeSelector";
import { PageThemeSelector } from "../PageThemeSelector";
import { ResetConfirmDialog } from "../ResetConfirmDialog";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { EditorSidebarProps } from "./types";
import { AVAILABLE_SECTIONS, getSectionIcon } from "./constants";
import { createDefaultData } from "./utils";
import { AdvancedSimpleSwitcher } from "./components/AdvancedSimpleSwitcher";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";
import { logSidebar, logUserAction } from "@/lib-liveeditor/debugLogger";
import { getDefaultHeaderData } from "@/context-liveeditor/editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "@/context-liveeditor/editorStoreFunctions/footerFunctions";
import { logChange } from "@/lib-liveeditor/debugLogger";
import { TranslationTestComponent } from "./TranslationTestComponent";

// Deep merge function to properly merge nested objects
const deepMerge = (target: any, source: any): any => {
  if (!source || typeof source !== "object") return target || source;
  if (!target || typeof target !== "object") return source;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};

export function EditorSidebar({
  isOpen,
  onClose,
  view,
  setView,
  selectedComponent,
  onComponentUpdate,
  onComponentThemeChange,
  onPageThemeChange,
  onSectionAdd,
  onComponentReset,
  width,
  setWidth,
}: EditorSidebarProps) {
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const t = useEditorT();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing.current && sidebarRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 400 && newWidth < 1000) {
          setWidth(newWidth);
        }
      }
    },
    [setWidth],
  );

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const {
    tempData,
    setTempData,
    updateTempField,
    updateByPath,
    updateComponentByPath,
    globalHeaderData,
    globalFooterData,
    setGlobalHeaderData,
    setGlobalFooterData,
    updateGlobalHeaderByPath,
    updateGlobalFooterByPath,
    globalComponentsData,
    setGlobalComponentsData,
    updateGlobalComponentByPath,
    setCurrentPage,
  } = useEditorStore();

  // Helpers to update array fields (slides, gallery) and top-level fields when needed
  const updateSlides = (newSlides: any[]) => {
    setTempData({ ...tempData, slides: newSlides });
  };

  const updateSlideField = (index: number, key: string, value: any) => {
    const cloned = [...(tempData.slides || [])];
    const current = { ...(cloned[index] || {}) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (current as any)[key] = value;
    cloned[index] = current;
    updateSlides(cloned);
  };

  const removeSlide = (index: number) => {
    const cloned = [...(tempData.slides || [])];
    cloned.splice(index, 1);
    updateSlides(cloned);
  };

  const updateGallery = (newGallery: string[]) => {
    setTempData({ ...tempData, gallery: newGallery });
  };

  const updateGalleryField = (index: number, value: string) => {
    const cloned = [...(tempData.gallery || [])];
    cloned[index] = value;
    updateGallery(cloned);
  };

  const removeGallery = (index: number) => {
    const cloned = [...(tempData.gallery || [])];
    cloned.splice(index, 1);
    updateGallery(cloned);
  };

  useEffect(() => {
    if (view === "edit-component" && selectedComponent) {
      // Check if this is a global component
      if (selectedComponent.id === "global-header") {
        const defaultData = getDefaultHeaderData();
        const dataToUse =
          globalComponentsData?.header &&
          Object.keys(globalComponentsData.header).length > 0
            ? globalComponentsData.header
            : globalHeaderData && Object.keys(globalHeaderData).length > 0
              ? globalHeaderData
              : defaultData;

        // Set current page to indicate we're editing global header
        setCurrentPage("global-header");
        setTempData(dataToUse);
        return;
      }

      if (selectedComponent.id === "global-footer") {
        const defaultData = getDefaultFooterData();
        const dataToUse =
          globalComponentsData?.footer &&
          Object.keys(globalComponentsData.footer).length > 0
            ? globalComponentsData.footer
            : globalFooterData && Object.keys(globalFooterData).length > 0
              ? globalFooterData
              : defaultData;

        // Set current page to indicate we're editing global footer
        setCurrentPage("global-footer");
        setTempData(dataToUse);
        return;
      }

      // Initialize store data for component types that use stores
      const store = useEditorStore.getState();
      const defaultData = createDefaultData(
        selectedComponent.type,
        selectedComponent.componentName,
      );

      // Use component.id as unique identifier, but also pass componentName for default data selection
      const uniqueVariantId = selectedComponent.id;
      const componentName = selectedComponent.componentName;

      // Log sidebar initialization
      logSidebar("INITIALIZE_COMPONENT", uniqueVariantId, componentName, {
        type: selectedComponent.type,
        uniqueVariantId,
        componentName,
        hasSelectedData: !!(
          selectedComponent.data &&
          Object.keys(selectedComponent.data).length > 0
        ),
        selectedDataKeys: selectedComponent.data
          ? Object.keys(selectedComponent.data)
          : [],
        defaultDataKeys: defaultData ? Object.keys(defaultData) : [],
        selectedData: selectedComponent.data,
        defaultData: defaultData,
        storeState: {
          allVariants: Object.keys(store.halfTextHalfImageStates || {}),
          currentVariantData: store.halfTextHalfImageStates?.[uniqueVariantId],
        },
      });

      // Use dynamic component initialization for all components
      // Use existing component data if available, otherwise use default data
      const dataToUse =
        selectedComponent.data && Object.keys(selectedComponent.data).length > 0
          ? selectedComponent.data
          : defaultData;

      // Log data selection
      logSidebar("DATA_SELECTION", uniqueVariantId, componentName, {
        componentName,
        dataToUseKeys: dataToUse ? Object.keys(dataToUse) : [],
        dataToUse: dataToUse,
        selectedDataKeys: selectedComponent.data
          ? Object.keys(selectedComponent.data)
          : [],
        reason:
          selectedComponent.data &&
          Object.keys(selectedComponent.data).length > 0
            ? "Using existing component data"
            : "Using default data for new component",
      });

      // Log before calling ensureComponentVariant
      logSidebar("CALLING_ENSURE_VARIANT", uniqueVariantId, componentName, {
        type: selectedComponent.type,
        uniqueVariantId,
        dataToUse: dataToUse,
      });

      store.ensureComponentVariant(
        selectedComponent.type,
        uniqueVariantId,
        dataToUse,
      );

      // Initialize tempData with current component data from store (not selectedComponent.data)
      const currentComponentData = store.getComponentData(
        selectedComponent.type,
        uniqueVariantId,
      );

      setTempData(currentComponentData || {});
    } else if (selectedComponent) {
      const store = useEditorStore.getState();
      const defaultData = createDefaultData(
        selectedComponent.type,
        selectedComponent.componentName,
      );

      // Use component.id as unique identifier instead of componentName
      const uniqueVariantId = selectedComponent.id;

      // Use existing component data if available, otherwise use default data
      const dataToUse =
        selectedComponent.data && Object.keys(selectedComponent.data).length > 0
          ? selectedComponent.data
          : defaultData;

      // Use dynamic component initialization for all components
      store.ensureComponentVariant(
        selectedComponent.type,
        uniqueVariantId,
        dataToUse,
      );

      // Initialize tempData with current component data from store
      const currentComponentData = store.getComponentData(
        selectedComponent.type,
        uniqueVariantId,
      );
      setTempData(currentComponentData || {});
    }
  }, [selectedComponent, view]);

  // Update tempData when selectedComponent changes or when component data changes
  useEffect(() => {
    if (selectedComponent) {
      // Use component.id as unique identifier instead of componentName
      const store = useEditorStore.getState();
      const uniqueVariantId = selectedComponent.id;

      // Handle global components
      if (selectedComponent.id === "global-header") {
        const defaultData = getDefaultHeaderData();
        const dataToUse =
          store.globalHeaderData &&
          Object.keys(store.globalHeaderData).length > 0
            ? store.globalHeaderData
            : defaultData;

        setTempData(dataToUse);
      } else if (selectedComponent.id === "global-footer") {
        const defaultData = getDefaultFooterData();
        const dataToUse =
          store.globalFooterData &&
          Object.keys(store.globalFooterData).length > 0
            ? store.globalFooterData
            : defaultData;

        setTempData(dataToUse);
      } else {
        // Use existing component data if available, otherwise get from store
        const existingData =
          selectedComponent.data &&
          Object.keys(selectedComponent.data).length > 0
            ? selectedComponent.data
            : store.getComponentData(selectedComponent.type, uniqueVariantId);

        setTempData(existingData || {});
      }
    } else {
      setTempData({});
    }
  }, [selectedComponent, globalHeaderData, globalFooterData]);

  // Clear tempData when view changes
  useEffect(() => {
    if (view !== "edit-component") {
      setTempData({});
    }
  }, [view]);

  const handleInputChange = (
    field: "texts" | "colors" | "settings",
    key: string,
    value: string | boolean | number,
  ) => {
    updateTempField(field, key, value);
  };

  const handleSave = () => {
    if (selectedComponent) {
      // Get store state before saving
      const store = useEditorStore.getState();
      const currentPage = store.currentPage || "homepage";
      const pageComponentsBefore =
        store.pageComponentsByPage[currentPage] || [];

      // Get the latest tempData from store for global components
      const latestTempData =
        selectedComponent.id === "global-header" ||
        selectedComponent.id === "global-footer"
          ? store.tempData && Object.keys(store.tempData).length > 0
            ? store.tempData
            : tempData
          : tempData;

      // Handle global components
      if (selectedComponent.id === "global-header") {
        // Use latestTempData (which contains the edited data) instead of tempData
        logChange(
          selectedComponent.id,
          "header1",
          "header",
          latestTempData,
          "GLOBAL_HEADER",
        );

        // Update both individual and unified global components data
        setGlobalHeaderData(latestTempData);
        setGlobalComponentsData({
          ...globalComponentsData,
          header: latestTempData,
        });
        onComponentUpdate(selectedComponent.id, latestTempData);

        // Log after save for global header
        const storeAfter = useEditorStore.getState();
        const pageComponentsAfter =
          storeAfter.pageComponentsByPage[currentPage] || [];

        onClose();
        return;
      }

      if (selectedComponent.id === "global-footer") {
        // Use latestTempData (which contains the edited data) instead of tempData
        logChange(
          selectedComponent.id,
          "footer1",
          "footer",
          latestTempData,
          "GLOBAL_FOOTER",
        );

        // Update both individual and unified global components data
        setGlobalFooterData(latestTempData);
        setGlobalComponentsData({
          ...globalComponentsData,
          footer: latestTempData,
        });
        onComponentUpdate(selectedComponent.id, latestTempData);

        // Log after save for global footer
        const storeAfter = useEditorStore.getState();
        const pageComponentsAfter =
          storeAfter.pageComponentsByPage[currentPage] || [];

        onClose();
        return;
      }

      // Use component.id as unique identifier instead of componentName
      const uniqueVariantId = selectedComponent.id;

      // Get the latest data from the store (which includes all changes made via updateComponentByPath)
      const storeData = store.getComponentData(
        selectedComponent.type,
        uniqueVariantId,
      );
      const currentPageComponents = pageComponentsBefore;
      const existingComponent = currentPageComponents.find(
        (comp: any) => comp.id === selectedComponent.id,
      );

      // Merge store data with existing component data to preserve all changes
      // Priority: storeData (latest changes) > existingComponent.data (previous changes)
      const mergedData = existingComponent?.data
        ? deepMerge(existingComponent.data, storeData)
        : storeData;

      // Update the component data in the store using the merged data
      store.setComponentData(
        selectedComponent.type,
        uniqueVariantId,
        mergedData,
      );

      // Update pageComponentsByPage with the merged data
      const updatedPageComponents = currentPageComponents.map((comp: any) => {
        if (comp.id === selectedComponent.id) {
          return {
            ...comp,
            data: mergedData,
          };
        }
        return comp;
      });

      // Update pageComponentsByPage
      store.forceUpdatePageComponents(currentPage, updatedPageComponents);

      onComponentUpdate(selectedComponent.id, mergedData);

      // Update tempData with the merged data to keep sidebar in sync
      setTempData(mergedData);

      // Log after save for regular components
      const storeAfter = useEditorStore.getState();
      const pageComponentsAfter =
        storeAfter.pageComponentsByPage[currentPage] || [];

      onClose();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="h-full flex bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-2xl border-l border-slate-200/60"
      style={{ width: `${width}px` }}
    >
      <div
        className="w-3 h-full cursor-col-resize flex items-center justify-center bg-gradient-to-b from-slate-100 via-blue-50 to-slate-100 hover:from-blue-100 hover:via-blue-100 hover:to-blue-100 transition-all duration-200 group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-12 bg-gradient-to-b from-slate-300 via-blue-400 to-slate-300 rounded-full group-hover:from-blue-400 group-hover:via-blue-500 group-hover:to-blue-400 transition-all duration-200"></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-gradient-to-b from-slate-50/50 to-white mt-[5rem]">
          {view === "main" && (
            <>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm">🎨</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {t("editor_sidebar.theme_settings")}
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Page Theme Selector */}
                  <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">
                            {t("editor_sidebar.page_theme")}
                          </h4>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full shadow-sm">
                          {t("editor_sidebar.global")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {t("editor_sidebar.transform_all_components")}
                      </p>
                      <PageThemeSelector
                        onThemeChange={(themeId, components) => {
                          if (onPageThemeChange) {
                            onPageThemeChange(themeId, components);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                      <label className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {t("editor_sidebar.primary_color")}
                        </span>
                      </label>
                      <input
                        type="color"
                        className="w-full h-12 rounded-xl border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 cursor-pointer"
                      />
                    </div>

                    <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                      <label className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            Aa
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {t("editor_sidebar.default_font")}
                        </span>
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 font-medium">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Cairo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <button
                  onClick={() => setView("add-section")}
                  className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>{t("editor_sidebar.add_new_section")}</span>
                  </div>
                </button>
              </div>
            </>
          )}

          {view === "add-section" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm">🏗️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {t("editor_sidebar.add_section")}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t("editor_sidebar.choose_section")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {AVAILABLE_SECTIONS.map((section) => (
                  <button
                    key={section.type}
                    onClick={() => onSectionAdd(section.type)}
                    className="group relative overflow-hidden p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">
                          {getSectionIcon(section.type)}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                          {section.name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {section.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "edit-component" && selectedComponent && (
            <div className="space-y-8">
              {/* Theme Selector */}
              <div className="group relative p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">
                        {t("editor_sidebar.component_theme")}
                      </h4>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full shadow-sm">
                      {selectedComponent.componentName}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {t("editor_sidebar.switch_visual_styles")}
                  </p>
                  <div className="space-y-4">
                    <ThemeSelector
                      componentType={selectedComponent.type}
                      currentTheme={selectedComponent.componentName}
                      onThemeChange={(newTheme) => {
                        if (onComponentThemeChange && selectedComponent) {
                          onComponentThemeChange(
                            selectedComponent.id,
                            newTheme,
                          );
                        }
                      }}
                      className="w-full"
                    />

                    {/* Reset Button */}
                    <div className="pt-2 border-t border-purple-200/50">
                      <ResetConfirmDialog
                        componentType={selectedComponent.type}
                        componentName={selectedComponent.componentName}
                        onConfirmReset={() => {
                          if (onComponentReset && selectedComponent) {
                            onComponentReset(selectedComponent.id);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm">✏️</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {t("editor_sidebar.content_settings")}
                  </h4>
                </div>

                {/* تخصيص حسب نوع المكون: استخدام AdvancedSimpleSwitcher لجميع المكونات المدعومة */}
                {COMPONENTS[selectedComponent.type] ? (
                  <AdvancedSimpleSwitcher
                    type={selectedComponent.type}
                    componentName={(() => {
                      // Handle global components
                      if (selectedComponent.id === "global-header") {
                        return "header1";
                      }
                      if (selectedComponent.id === "global-footer") {
                        return "footer1";
                      }

                      // أولاً: تحقق من componentName مباشرة
                      if (
                        selectedComponent.componentName &&
                        selectedComponent.componentName !== "undefined" &&
                        selectedComponent.componentName !== "null"
                      ) {
                        return selectedComponent.componentName;
                      }

                      // ثانياً: إذا كان componentName غير صحيح، استخدم fallback بناءً على نوع المكون
                      if (selectedComponent.type === "halfTextHalfImage") {
                        // استخدام الـ id إذا كان يحتوي على رقم المكون
                        if (
                          selectedComponent.id &&
                          selectedComponent.id.includes("halfTextHalfImage3")
                        ) {
                          return "halfTextHalfImage3";
                        } else if (
                          selectedComponent.id &&
                          selectedComponent.id.includes("halfTextHalfImage2")
                        ) {
                          return "halfTextHalfImage2";
                        } else if (
                          selectedComponent.id &&
                          selectedComponent.id.includes("halfTextHalfImage1")
                        ) {
                          return "halfTextHalfImage1";
                        }
                        return "halfTextHalfImage1"; // افتراضي لـ halfTextHalfImage1
                      }

                      // ثالثاً: fallback عام
                      return (
                        selectedComponent.id || selectedComponent.componentName
                      );
                    })()}
                    componentId={selectedComponent.id}
                    onUpdateByPath={(path, value) => {
                      // Validate input
                      if (!path || path.trim() === "") {
                        console.error(
                          "❌ [EditorSidebar] Invalid path provided:",
                          path,
                        );
                        return;
                      }

                      // Handle global components with enhanced validation
                      if (selectedComponent.id === "global-header") {
                        // Validate header-specific paths
                        const validHeaderPaths = [
                          "visible",
                          "position",
                          "height",
                          "background",
                          "colors",
                          "logo",
                          "menu",
                          "actions",
                          "responsive",
                          "animations",
                        ];

                        const pathRoot = path.split(".")[0];
                        if (!validHeaderPaths.includes(pathRoot)) {
                          console.warn(
                            "⚠️ [EditorSidebar] Potentially invalid header path:",
                            path,
                          );
                        }

                        // Update tempData with validation
                        updateByPath(path, value);
                      } else if (selectedComponent.id === "global-footer") {
                        // Validate footer-specific paths
                        const validFooterPaths = [
                          "visible",
                          "background",
                          "layout",
                          "content",
                          "footerBottom",
                          "styling",
                        ];

                        const pathRoot = path.split(".")[0];
                        if (!validFooterPaths.includes(pathRoot)) {
                          console.warn(
                            "⚠️ [EditorSidebar] Potentially invalid footer path:",
                            path,
                          );
                        }

                        updateByPath(path, value);
                      } else {
                        // Handle regular components with enhanced logic
                        if (
                          path === "content.imagePosition" &&
                          selectedComponent.type === "halfTextHalfImage"
                        ) {
                          // Update both content.imagePosition and top-level imagePosition for consistency
                          updateComponentByPath(
                            selectedComponent.type,
                            selectedComponent.id,
                            "content.imagePosition",
                            value,
                          );
                          updateComponentByPath(
                            selectedComponent.type,
                            selectedComponent.id,
                            "imagePosition",
                            value,
                          );
                        } else if (
                          path === "layout.direction" &&
                          selectedComponent.type === "halfTextHalfImage"
                        ) {
                          // Update layout.direction
                          updateComponentByPath(
                            selectedComponent.type,
                            selectedComponent.id,
                            "layout.direction",
                            value,
                          );
                        } else {
                          updateComponentByPath(
                            selectedComponent.type,
                            selectedComponent.id,
                            path,
                            value,
                          );
                        }
                      }
                    }}
                    currentData={tempData}
                  />
                ) : (
                  // المكوّنات الأخرى تستخدم البنية العامة الحالية
                  <div className="space-y-6">
                    {tempData.texts &&
                      Object.keys(tempData.texts).map((key) => (
                        <div
                          key={key}
                          className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                          <label className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                T
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </label>
                          {key.toLowerCase().includes("subtitle") ||
                          key.toLowerCase().includes("description") ? (
                            <textarea
                              value={tempData.texts?.[key] || ""}
                              onChange={(e) =>
                                handleInputChange("texts", key, e.target.value)
                              }
                              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 resize-none"
                              rows={3}
                              placeholder={t("editor_sidebar.enter_your_text")}
                            />
                          ) : (
                            <input
                              type="text"
                              value={tempData.texts?.[key] || ""}
                              onChange={(e) =>
                                handleInputChange("texts", key, e.target.value)
                              }
                              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700"
                              placeholder={t("editor_sidebar.enter_your_text")}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
          {view === "edit-component" && (
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{t("editor.save_changes")}</span>
                </div>
              </button>
              <button
                onClick={() => {
                  // Handle global components cancel - restore original data
                  if (selectedComponent?.id === "global-header") {
                    const store = useEditorStore.getState();
                    const defaultData = getDefaultHeaderData();
                    const originalData =
                      store.globalHeaderData &&
                      Object.keys(store.globalHeaderData).length > 0
                        ? store.globalHeaderData
                        : defaultData;
                    setTempData(originalData);
                  } else if (selectedComponent?.id === "global-footer") {
                    const store = useEditorStore.getState();
                    const defaultData = getDefaultFooterData();
                    const originalData =
                      store.globalFooterData &&
                      Object.keys(store.globalFooterData).length > 0
                        ? store.globalFooterData
                        : defaultData;
                    setTempData(originalData);
                  } else {
                    // Clear tempData when canceling regular components
                    setTempData({});
                  }
                  onClose();
                }}
                className="w-full px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
              >
                {t("common.cancel")}
              </button>
            </div>
          )}
          {view === "add-section" && (
            <button
              onClick={() => setView("main")}
              className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>{t("editor_sidebar.back_to_settings")}</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Export the main component as default
export default EditorSidebar;
