"use client";
import React, {
  Suspense,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { createDefaultData } from "./EditorSidebar/utils";
import {
  logComponentAdd,
  logComponentChange,
  logUserAction,
} from "@/lib-liveeditor/debugLogger";
import { DebugControls } from "@/components/tenant/live-editor/debug/DebugControls";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";

import {
  LiveEditorDragDropContext,
  LiveEditorDropZone,
  DraggableDrawerItem,
} from "@/services-liveeditor/live-editor/dragDrop";
import { EnhancedLiveEditorDragDropContext } from "@/services-liveeditor/live-editor/dragDrop/EnhancedLiveEditorDragDropContext";
import { LiveEditorDraggableComponent } from "@/services-liveeditor/live-editor/dragDrop/DraggableComponent";
import {
  positionTracker,
  PositionDebugInfo,
  validateComponentPositions,
  generatePositionReport,
  PositionValidation,
} from "@/services-liveeditor/live-editor/dragDrop/enhanced-position-tracker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditorSidebar } from "@/components/tenant/live-editor/EditorSidebar";
import { CachedComponent, EmptyPage } from "@/services-liveeditor/live-editor";

import {
  AVAILABLE_SECTIONS,
  getAvailableSectionsTranslated,
  getSectionIcon,
  getSectionIconTranslated,
} from "@/components/tenant/live-editor/EditorSidebar/constants";

// Import static components
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";

// ============================================================================
// واجهة المستخدم الرئيسية للـ LiveEditor
// ============================================================================

interface LiveEditorUIProps {
  state: any;
  computed: any;
  handlers: any;
}

// تعريف أنواع الأجهزة
type DeviceType = "phone" | "tablet" | "laptop";

// تعريف أبعاد الأجهزة
const getDeviceDimensions = (t: any) => ({
  phone: { width: 375, height: 667, name: t("live_editor.responsive.mobile") },
  tablet: {
    width: 768,
    height: 1024,
    name: t("live_editor.responsive.tablet"),
  },
  laptop: {
    width: "100%",
    height: "100%",
    name: t("live_editor.responsive.desktop"),
  },
});

// AutoFrame Component - مستوحى من Puck مع نسخ الـ styles
const AutoFrame = ({
  children,
  className,
  style,
  frameRef,
  onReady,
  onNotReady,
}: {
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  frameRef: React.RefObject<HTMLIFrameElement | null>;
  onReady?: () => void;
  onNotReady?: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const stylesInitializedRef = useRef(false);

  // دالة نسخ الـ styles من الـ parent window إلى الـ iframe
  const copyStylesToIframe = useCallback((iframeDoc: Document) => {
    // تجنب إعادة نسخ الـ styles إذا تم نسخها مسبقاً
    if (stylesInitializedRef.current) {
      return;
    }

    const styleElements = document.querySelectorAll(
      'style, link[rel="stylesheet"]',
    );
    const iframeHead = iframeDoc.head;

    // مسح الـ head أولاً
    iframeHead.innerHTML = "";

    // نسخ جميع الـ styles
    styleElements.forEach((styleEl) => {
      if (styleEl.tagName === "STYLE") {
        const clonedStyle = styleEl.cloneNode(true) as HTMLStyleElement;
        iframeHead.appendChild(clonedStyle);
      } else if (styleEl.tagName === "LINK") {
        const linkEl = styleEl as HTMLLinkElement;
        const clonedLink = linkEl.cloneNode(true) as HTMLLinkElement;
        iframeHead.appendChild(clonedLink);
      }
    });

    // نسخ CSS variables من الـ parent
    const parentComputedStyle = getComputedStyle(document.documentElement);

    // نسخ جميع CSS custom properties
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }

    // إضافة CSS إضافي للـ iframe
    const additionalStyles = document.createElement("style");
    additionalStyles.textContent = `
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
      }
      * {
        box-sizing: border-box;
      }
      #frame-root {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
      }
      html {
        overflow-x: hidden;
        overflow-y: auto;
      }
      /* ضمان عمل الـ scroll في الـ iframe */
      iframe {
        overflow: auto !important;
      }
      /* إزالة أي قيود على الـ scroll */
      .overflow-hidden {
        overflow: auto !important;
      }
    `;
    iframeHead.appendChild(additionalStyles);

    // نسخ الـ meta tags المهمة
    const metaTags = document.querySelectorAll(
      'meta[name="viewport"], meta[charset]',
    );
    metaTags.forEach((metaTag) => {
      const clonedMeta = metaTag.cloneNode(true) as HTMLMetaElement;
      iframeHead.appendChild(clonedMeta);
    });

    // تعيين علامة أن الـ styles تم نسخها
    stylesInitializedRef.current = true;
  }, []);

  // دالة مراقبة التغييرات في الـ styles
  const observeStyleChanges = useCallback((iframeDoc: Document) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.matches('style, link[rel="stylesheet"]')) {
                // نسخ الـ style الجديد إلى الـ iframe
                const clonedElement = element.cloneNode(true) as HTMLElement;
                iframeDoc.head.appendChild(clonedElement);
              }
            }
          });
        }
      });
    });

    observer.observe(document.head, { childList: true, subtree: true });
    return observer;
  }, []);

  // دالة تحديث CSS variables
  const updateCSSVariables = useCallback((iframeDoc: Document) => {
    const parentComputedStyle = getComputedStyle(document.documentElement);

    // نسخ جميع CSS custom properties
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }
  }, []);

  useEffect(() => {
    if (frameRef.current && loaded) {
      const doc = frameRef.current.contentDocument;
      const win = frameRef.current.contentWindow;

      if (doc && win) {
        // نسخ الـ styles أولاً
        copyStylesToIframe(doc);

        // تعيين mount target
        setMountTarget(doc.getElementById("frame-root"));

        // مراقبة التغييرات في الـ styles
        const styleObserver = observeStyleChanges(doc);

        // تحديث CSS variables بشكل دوري
        const cssVariablesInterval = setInterval(() => {
          updateCSSVariables(doc);
        }, 1000);

        // انتظار تحميل الـ styles ثم إعلام أن الـ iframe جاهز
        const checkStylesLoaded = () => {
          const iframeStyles = doc.querySelectorAll(
            'style, link[rel="stylesheet"]',
          );
          const parentStyles = document.querySelectorAll(
            'style, link[rel="stylesheet"]',
          );

          if (iframeStyles.length >= parentStyles.length) {
            setStylesLoaded(true);
            if (onReady) onReady();
          } else {
            setTimeout(checkStylesLoaded, 50);
          }
        };

        setTimeout(checkStylesLoaded, 100);

        // تنظيف المراقب عند إلغاء المكون
        return () => {
          styleObserver.disconnect();
          clearInterval(cssVariablesInterval);
        };
      } else {
        if (onNotReady) onNotReady();
      }
    }
  }, [
    frameRef,
    loaded,
    copyStylesToIframe,
    observeStyleChanges,
    onReady,
    onNotReady,
  ]);

  // إعادة تعيين علامة الـ styles عند إلغاء المكون
  useEffect(() => {
    return () => {
      stylesInitializedRef.current = false;
    };
  }, []);

  return (
    <iframe
      className={className}
      style={{ ...style, overflow: "auto" }}
      srcDoc='<!DOCTYPE html><html><head></head><body><div id="frame-root" data-live-editor-entry></div></body></html>'
      ref={frameRef}
      onLoad={() => setLoaded(true)}
    >
      {loaded &&
        mountTarget &&
        stylesLoaded &&
        createPortal(children, mountTarget)}
    </iframe>
  );
};

export function LiveEditorUI({ state, computed, handlers }: LiveEditorUIProps) {
  const t = useEditorT();
  const deviceDimensions = getDeviceDimensions(t);
  const {
    user,
    pageComponents,
    activeId,
    sidebarOpen,
    sidebarView,
    selectedComponentId,
    deleteDialogOpen,
    componentToDelete,
    deletePageDialogOpen,
    deletePageConfirmation,
    dropIndicator,
    setDeletePageConfirmation,
    setDeleteDialogOpen,
    setDeletePageDialogOpen,
  } = state;

  // Get global components data from parent store
  const globalHeaderData = useEditorStore((s) => s.globalHeaderData);
  const globalFooterData = useEditorStore((s) => s.globalFooterData);
  const setGlobalHeaderData = useEditorStore((s) => s.setGlobalHeaderData);
  const setGlobalFooterData = useEditorStore((s) => s.setGlobalFooterData);
  const hasChangesMade = useEditorStore((s) => s.hasChangesMade);
  const [showChangesDialog, setShowChangesDialog] = useState(false);
  const [previousHasChangesMade, setPreviousHasChangesMade] = useState(false);

  // Initialize data immediately if not exists
  if (!globalHeaderData || Object.keys(globalHeaderData).length === 0) {
    const {
      getDefaultHeaderData,
    } = require("@/context-liveeditor/editorStoreFunctions/headerFunctions");
    const defaultHeaderData = getDefaultHeaderData();
    setGlobalHeaderData(defaultHeaderData);
  }

  // Detect when hasChangesMade changes from false to true
  useEffect(() => {
    if (hasChangesMade && !previousHasChangesMade) {
      setShowChangesDialog(true);
    }
    setPreviousHasChangesMade(hasChangesMade);
  }, [hasChangesMade, previousHasChangesMade]);

  if (!globalFooterData || Object.keys(globalFooterData).length === 0) {
    const {
      getDefaultFooterData,
    } = require("@/context-liveeditor/editorStoreFunctions/footerFunctions");
    const defaultFooterData = getDefaultFooterData();
    setGlobalFooterData(defaultFooterData);
  }

  const [sidebarWidth, setSidebarWidth] = useState(state.sidebarWidth);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("laptop");
  const [iframeReady, setIframeReady] = useState(false);
  const [isComponentsSidebarOpen, setIsComponentsSidebarOpen] = useState(false);
  const [
    wasComponentsSidebarManuallyClosed,
    setWasComponentsSidebarManuallyClosed,
  ] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Enhanced debugging state
  const [debugInfo, setDebugInfo] = useState<PositionDebugInfo | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [positionValidation, setPositionValidation] = useState<ReturnType<
    typeof validateComponentPositions
  > | null>(null);
  const [showDebugControls, setShowDebugControls] = useState(false);

  // Debug panels are now independent - no auto-opening

  // تتبع عرض الشاشة
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // تعيين العرض الأولي
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // التحكم في فتح الـ sidebar بناءً على عرض الشاشة
  useEffect(() => {
    if (screenWidth >= 1300 && !wasComponentsSidebarManuallyClosed) {
      setIsComponentsSidebarOpen(true);
    } else if (screenWidth < 1300) {
      setIsComponentsSidebarOpen(false);
    }
  }, [screenWidth, wasComponentsSidebarManuallyClosed]);

  // إغلاق Components Sidebar عند فتح Editor Sidebar
  useEffect(() => {
    if (sidebarOpen) {
      setIsComponentsSidebarOpen(false);
    }
  }, [sidebarOpen]);

  // إغلاق Components Sidebar عند تغيير view إلى edit-component
  useEffect(() => {
    if (sidebarView === "edit-component") {
      setIsComponentsSidebarOpen(false);
    }
  }, [sidebarView]);

  // إعادة فتح Components Sidebar عند إغلاق Editor Sidebar
  useEffect(() => {
    if (!sidebarOpen && !wasComponentsSidebarManuallyClosed) {
      setIsComponentsSidebarOpen(true);
    }
  }, [sidebarOpen, wasComponentsSidebarManuallyClosed]);

  useEffect(() => {
    setSidebarWidth(state.sidebarWidth);
  }, [state.sidebarWidth]);

  const { selectedComponent, pageTitle, isPredefinedPage } = computed;

  const {
    openMainSidebar,
    closeSidebar,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleDeletePage,
    confirmDeletePage,
    cancelDeletePage,
    handleComponentUpdate,
    handleComponentThemeChange,
    handleComponentReset,
    handleAddSection,
  } = handlers;

  // معرفات المكونات بترتيب العرض
  const componentOrderIds = useMemo(() => {
    return pageComponents.map((component: any) => component.id);
  }, [pageComponents]);

  // دالة تغيير الجهاز مع إعادة تصيير المكونات المحددة
  const handleDeviceChange = (device: DeviceType) => {
    setSelectedDevice(device);

    // إعادة تصيير المكونات المحددة عند تغيير الجهاز
    setTimeout(() => {
      const {
        componentsToRefresh,
      } = require("@/lib-liveeditor/refreshComponents.js");

      // إعادة تصيير المكونات المحددة
      componentsToRefresh.forEach((componentName: string) => {
        // البحث عن المكونات في pageComponents وإعادة تصييرها
        const componentsToUpdate = pageComponents.filter(
          (comp: any) => comp.componentName === componentName,
        );

        if (componentsToUpdate.length > 0) {
          // إضافة forceUpdate للمكونات المحددة
          const updatedComponents = pageComponents.map((comp: any) => {
            if (componentsToRefresh.includes(comp.componentName)) {
              return {
                ...comp,
                forceUpdate: Date.now(), // إضافة timestamp لإجبار إعادة التصيير
                deviceType: device, // تحديث نوع الجهاز
              };
            }
            return comp;
          });

          // تحديث الحالة
          state.setPageComponents(updatedComponents);

          // تحديث pageComponentsByPage في الـ store
          setTimeout(() => {
            const store = useEditorStore.getState();
            const currentPage = store.currentPage;
            store.forceUpdatePageComponents(currentPage, updatedComponents);
          }, 0);
        }
      });
    }, 100); // تأخير قصير لضمان تحديث الحالة
  };

  // دالة بسيطة لإضافة رقم 1 لكل مكون
  const getComponentNameWithOne = useCallback(
    (componentType: string): string => {
      // إذا كان المكون يحتوي بالفعل على رقم، لا نضيف رقم آخر
      if (componentType.match(/\d+$/)) {
        return componentType;
      }
      return `${componentType}1`;
    },
    [],
  );

  // دالة إضافة مكون جديد - محسنة لتعمل مع النظام الجديد
  const handleAddComponent = useCallback(
    (componentData: {
      type: string;
      zone: string;
      index: number;
      data?: any;
    }) => {
      // تحويل componentType إلى camelCase
      const normalizedComponentType = componentData.type
        .replace(/\s+/g, "")
        .replace(/^\w/, (c) => c.toLowerCase());

      // إضافة رقم 1 لكل مكون
      const componentName = getComponentNameWithOne(normalizedComponentType);

      const newComponent = {
        id: uuidv4(),
        type: normalizedComponentType,
        name:
          componentData.type.charAt(0).toUpperCase() +
          componentData.type.slice(1),
        componentName,
        data: createDefaultData(normalizedComponentType),
        layout: {
          row: pageComponents.length,
          col: 0,
          span: 2,
        },
      };

      // إضافة المكون في الموضع المحدد مع تحديث محسن
      const updatedComponents = [...pageComponents];
      const targetIndex = Math.min(
        componentData.index,
        updatedComponents.length,
      );
      updatedComponents.splice(targetIndex, 0, newComponent);

      // تحديث الحالة مع تنشيط الحدث
      state.setPageComponents(updatedComponents);

      // تحديد المكون الجديد تلقائياً
      setTimeout(() => {
        state.setSelectedComponentId?.(newComponent.id);
      }, 100);

      // إعادة تعيين علامة الإغلاق اليدوي عند إضافة مكون جديد
      setWasComponentsSidebarManuallyClosed(false);
    },
    [pageComponents, state, getComponentNameWithOne],
  );

  // دالة نقل مكون محسنة - تستقبل النتيجة المعالجة مسبقاً
  const handleMoveComponent = useCallback(
    (
      sourceIndex: number,
      sourceZone: string,
      finalIndex: number,
      destinationZone: string,
      updatedComponents?: any[],
      debugInfo?: PositionDebugInfo,
    ) => {
      // إذا كانت البيانات المحدثة متوفرة، استخدمها مباشرة
      if (updatedComponents && debugInfo) {
        // تحديث الحالة بالمكونات المحدثة
        state.setPageComponents(updatedComponents);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(currentPage, updatedComponents);
        }, 0);

        // حفظ معلومات التصحيح
        setDebugInfo(debugInfo);

        // إبقاء المكون محدداً بعد النقل
        const movedComponent = updatedComponents[finalIndex];
        if (selectedComponentId === movedComponent?.id) {
          setTimeout(() => {
            state.setSelectedComponentId?.(movedComponent.id);
          }, 100);
        }

        // التحقق من صحة الحالة بعد النقل
        const validation = validateComponentPositions(updatedComponents);
        setPositionValidation(validation);

        if (!validation.isValid) {
          console.warn(
            "⚠️ Position validation failed after move:",
            validation.issues,
          );
        }

        // تحديث position tracker
        positionTracker.recordState(updatedComponents, "enhanced-move");

        return;
      }

      // Fallback: المعالجة التقليدية إذا لم تكن البيانات متوفرة

      // تحديث position properties لجميع المكونات قبل النقل
      const componentsWithPositions = pageComponents.map(
        (comp: any, index: number) => ({
          ...comp,
          position: index,
          layout: {
            ...comp.layout,
            row: index,
          },
        }),
      );

      // استخدام position tracker المحسن
      const result = positionTracker.trackComponentMove(
        componentsWithPositions,
        sourceIndex,
        sourceZone,
        finalIndex,
        destinationZone,
      );

      if (result.success) {
        state.setPageComponents(result.updatedComponents);
        setDebugInfo(result.debugInfo);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(
            currentPage,
            result.updatedComponents,
          );
        }, 0);

        const validation = validateComponentPositions(result.updatedComponents);
        setPositionValidation(validation);

        if (!validation.isValid) {
          console.warn(
            "⚠️ Position validation failed after move:",
            validation.issues,
          );
        }

        // تحديث position tracker
        positionTracker.recordState(result.updatedComponents, "fallback-move");
      } else {
        console.error("❌ Enhanced move failed");
        setDebugInfo(result.debugInfo);
      }
    },
    [pageComponents, state, selectedComponentId],
  );

  // دالة معالجة معلومات التصحيح
  const handlePositionDebug = useCallback((debugInfo: PositionDebugInfo) => {
    setDebugInfo(debugInfo);
  }, []);

  // دالة تنظيف وإعادة تعيين المواضع
  const handleResetPositions = useCallback(() => {
    const resetComponents = pageComponents.map((comp: any, index: number) => ({
      ...comp,
      position: index,
      layout: {
        ...comp.layout,
        row: index,
      },
    }));

    state.setPageComponents(resetComponents);
    positionTracker.recordState(resetComponents, "manual-reset");

    // Update pageComponentsByPage in the store
    setTimeout(() => {
      const store = useEditorStore.getState();
      const currentPage = store.currentPage;
      store.forceUpdatePageComponents(currentPage, resetComponents);
    }, 0);

    const validation = validateComponentPositions(resetComponents);
    setPositionValidation(validation);
  }, [pageComponents, state]);

  // تحديث التحقق من صحة المواضع عند تغيير المكونات
  useEffect(() => {
    if (pageComponents.length > 0) {
      // تأكد من أن جميع المكونات لها position صحيح
      const componentsWithCorrectPositions = pageComponents.map(
        (comp: any, index: number) => {
          if (comp.position === undefined || comp.position !== index) {
            return {
              ...comp,
              position: index,
              layout: {
                ...comp.layout,
                row: index,
              },
            };
          }
          return comp;
        },
      );

      // تحديث الحالة إذا كانت هناك تغييرات في المواضع
      const hasPositionChanges = componentsWithCorrectPositions.some(
        (comp: any, index: number) => pageComponents[index].position !== index,
      );

      if (hasPositionChanges) {
        state.setPageComponents(componentsWithCorrectPositions);
        // تحديث pageComponentsByPage في الـ store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(
            currentPage,
            componentsWithCorrectPositions,
          );
        }, 0);
        return; // العودة مبكراً لتجنب التحقق المزدوج
      }

      const validation = validateComponentPositions(pageComponents);
      setPositionValidation(validation);

      if (!validation.isValid && showDebugPanel) {
        console.warn(
          "⚠️ Position validation issues detected:",
          validation.issues,
        );
      }
    }
  }, [pageComponents, showDebugPanel, state]);

  // محتوى الـ iframe
  const iframeContent = useMemo(
    () => (
      <div
        className={`w-full h-full overflow-auto ${
          selectedDevice === "phone"
            ? "max-w-[375px] mx-auto"
            : selectedDevice === "tablet"
              ? "max-w-[768px] mx-auto"
              : "w-full"
        }`}
        style={
          {
            "--device-type": selectedDevice,
            "--device-width":
              typeof deviceDimensions[selectedDevice].width === "number"
                ? `${deviceDimensions[selectedDevice].width}px`
                : deviceDimensions[selectedDevice].width,
            "--device-height":
              typeof deviceDimensions[selectedDevice].height === "number"
                ? `${deviceDimensions[selectedDevice].height}px`
                : deviceDimensions[selectedDevice].height,
          } as React.CSSProperties
        }
        data-live-editor-entry
      >
        {/* Static Header - Clickable for editing */}
        <div
          onClick={(e) => {
            // منع جميع الأحداث داخل الـ Header
            e.preventDefault();
            e.stopPropagation();
            handleEditClick("global-header");
          }}
          className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 transition-all duration-200"
          style={{
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          <div style={{ pointerEvents: "none" }}>
            <StaticHeader1 overrideData={globalHeaderData} />
          </div>
          {/* Overlay indicator */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "2px dashed rgba(59, 130, 246, 0.5)",
            }}
          />
        </div>

        {/* منطقة إفلات رئيسية - محسنة للنظام الجديد */}
        <LiveEditorDropZone
          zone="root"
          minEmptyHeight={pageComponents.length === 0 ? 200 : 50}
          className={`min-h-[50px] transition-all duration-200 ${
            selectedDevice === "phone"
              ? `space-y-2 ${pageComponents.length === 0 ? "pb-[320px]" : "pb-10"} `
              : selectedDevice === "tablet"
                ? `space-y-4 ${pageComponents.length === 0 ? "pb-[800px]" : "pb-10"} `
                : `space-y-4 ${pageComponents.length === 0 ? "pb-[1300px]" : "pb-[200px]"} `
          }`}
          style={{
            background:
              pageComponents.length === 0
                ? "linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%)"
                : "transparent",
          }}
        >
          {/* عرض المكونات - محسن بانيميشن وتفاعلات */}
          {pageComponents
            .filter(
              (component: any) =>
                !component.componentName?.startsWith("header") &&
                !component.componentName?.startsWith("footer"),
            )
            .map((component: any, index: number) => {
              // قراءة البيانات من editorStore باستخدام component.id
              const storeData = useEditorStore
                .getState()
                .getComponentData(component.type, component.id);

              // دمج البيانات: أولوية للبيانات من editorStore
              const mergedData =
                storeData && Object.keys(storeData).length > 0
                  ? storeData
                  : component.data;

              // Debug log للتحقق من تدفق البيانات
              console.log("🔍 Component data in LiveEditorUI:", {
                componentId: component.id,
                componentType: component.type,
                componentName: component.componentName,
                storeData: storeData ? Object.keys(storeData) : "none",
                componentData: component.data
                  ? Object.keys(component.data)
                  : "none",
                mergedDataKeys: mergedData ? Object.keys(mergedData) : "none",
              });

              return (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                  className={`relative ${
                    component.layout?.span === 2
                      ? selectedDevice === "phone"
                        ? "w-full"
                        : "w-full"
                      : "w-full"
                  }`}
                >
                  <LiveEditorDraggableComponent
                    id={component.id}
                    componentType={component.componentName}
                    depth={1}
                    index={index}
                    zoneCompound="root"
                    isLoading={false}
                    isSelected={selectedComponentId === component.id}
                    label={component.componentName}
                    onEditClick={() => handleEditClick(component.id)}
                    onDeleteClick={() => handleDeleteClick(component.id)}
                    inDroppableZone={true}
                    autoDragAxis="both"
                  >
                    {(ref: any) => (
                      <div
                        ref={ref}
                        className={`relative ${
                          selectedDevice === "phone"
                            ? "text-sm"
                            : selectedDevice === "tablet"
                              ? "text-base"
                              : "text-base"
                        }`}
                      >
                        <CachedComponent
                          key={`${component.id}-${component.forceUpdate || 0}-${selectedDevice}`}
                          componentName={component.componentName}
                          section={state.slug}
                          data={
                            {
                              ...mergedData, // ✅ استخدام البيانات المدمجة من editorStore
                              useStore: true,
                              variant: component.id,
                              deviceType: selectedDevice,
                              forceUpdate: component.forceUpdate,
                            } as any
                          }
                        />
                      </div>
                    )}
                  </LiveEditorDraggableComponent>
                </motion.div>
              );
            })}
        </LiveEditorDropZone>

        {/* Static Footer - Clickable for editing */}
        <div
          onClick={(e) => {
            // منع جميع الأحداث داخل الـ Footer
            e.preventDefault();
            e.stopPropagation();
            handleEditClick("global-footer");
          }}
          className="cursor-pointer hover:ring-2 hover:ring-green-500 hover:ring-opacity-50 transition-all duration-200"
          style={{
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          <div style={{ pointerEvents: "none" }}>
            <StaticFooter1 overrideData={globalFooterData} />
          </div>
          {/* Overlay indicator */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "2px dashed rgba(34, 197, 94, 0.5)",
            }}
          />
        </div>
      </div>
    ),
    [
      pageComponents,
      selectedDevice,
      state,
      handleAddComponent,
      handleMoveComponent,
      selectedComponentId,
      handleEditClick,
      handleDeleteClick,
    ],
  );

  if (!user) {
    return null;
  }
  const collapseVariants = {
    hidden: { height: 0, opacity: 0 },
    show: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  };

  const slideInFromLeft = {
    hidden: { x: "-100%", opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const listContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04,
        when: "beforeChildren",
      },
    },
  };

  const listItem = {
    hidden: { y: 6, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.18 } },
  };
  // مكون sidebar المكونات على اليسار
  const ComponentsSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const t = useEditorT();

    // الحصول على الأقسام المترجمة
    const availableSections = useMemo(() => {
      return getAvailableSectionsTranslated(t);
    }, [t]);

    const filteredSections = useMemo(
      () =>
        availableSections.filter(
          (section) =>
            section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            section.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        ),
      [availableSections, searchTerm],
    );

    return (
      <motion.div
        key="components-sidebar"
        variants={slideInFromLeft}
        initial="hidden"
        animate="show"
        exit="exit"
        className="fixed left-0 top-15 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("live_editor.components")}
            </h2>
            <motion.button
              onClick={() => setIsExpanded((v) => !v)}
              className="p-1 rounded-md hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
              aria-expanded={isExpanded}
              aria-label="Toggle sidebar"
            >
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>
          </div>

          {/* Search */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="search"
                variants={collapseVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative"
                layout
              >
                <input
                  type="text"
                  placeholder={t("live_editor.search_components")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Components List - Coming Soon Overlay */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="list"
              variants={collapseVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex-1 overflow-y-auto p-4 relative"
              layout
            >
              <div className="relative">
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {filteredSections.length > 0 ? (
                    filteredSections.map((section) => (
                      <motion.div
                        key={section.type}
                        variants={listItem}
                        className="group relative"
                      >
                        <DraggableDrawerItem
                          componentType={section.component}
                          section={section.section}
                          data={{
                            label: section.name,
                            description: section.description,
                            icon: section.type,
                          }}
                        >
                          <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">
                                {getSectionIconTranslated(section.type, t)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">
                                  {section.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {section.description}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8h16M4 16h16"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </DraggableDrawerItem>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={listItem}
                      className="text-center py-8 text-gray-500"
                    >
                      <svg
                        className="w-12 h-12 mx-auto mb-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p>{t("live_editor.no_components_found")}</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Coming Soon Overlay - Disabled all components - Only show in production */}
                {process.env.NODE_ENV !== "development" && (
                  <div
                    className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center pointer-events-auto"
                    style={{ paddingTop: "250px" }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚧</div>
                      <h2 className="text-2xl font-bold text-red-600 mb-2">
                        {t("live_editor.coming_soon")}
                      </h2>
                      <p className="text-red-500 font-medium">
                        {t("live_editor.components_disabled")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <EnhancedLiveEditorDragDropContext
      onComponentAdd={handleAddComponent}
      onComponentMove={handleMoveComponent}
      components={pageComponents}
      onPositionDebug={handlePositionDebug}
      disableAutoScroll={false}
      iframeRef={iframeRef}
    >
      <div className="flex min-h-screen bg-gray-50">
        {/* Components Sidebar */}
        <AnimatePresence>
          {isComponentsSidebarOpen && <ComponentsSidebar />}
        </AnimatePresence>

        {/* Main Content Area */}
        <motion.div
          className="flex-1 flex flex-col"
          animate={{
            marginRight: sidebarOpen ? sidebarWidth : 0,
            marginLeft: isComponentsSidebarOpen ? 256 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            {/* Desktop Layout - Single Row */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Components Sidebar Toggle - Only show on screens < 1300px */}
                {/* {screenWidth < 1300 && ( */}
                <button
                  onClick={() => {
                    const newState = !isComponentsSidebarOpen;
                    setIsComponentsSidebarOpen(newState);
                    // إذا تم إغلاق Components Sidebar يدوياً، ضع علامة على ذلك
                    if (!newState) {
                      setWasComponentsSidebarManuallyClosed(true);
                    } else {
                      setWasComponentsSidebarManuallyClosed(false);
                    }
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title={
                    isComponentsSidebarOpen
                      ? t("live_editor.hide_components")
                      : t("live_editor.show_components")
                  }
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isComponentsSidebarOpen
                          ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                          : "M13 5l7 7-7 7M5 5l7 7-7 7"
                      }
                    />
                  </svg>
                </button>
                {/* )} */}
                <h1 className="text-2xl font-bold text-gray-900">
                  {pageTitle} {t("live_editor.editor")}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                {/* Device Preview Controls */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleDeviceChange("phone")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedDevice === "phone"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                    title={t("live_editor.mobile_view")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 20H7V4H17V20Z" />
                      <path d="M12 18C12.83 18 13.5 17.33 13.5 16.5C13.5 15.67 12.83 15 12 15C11.17 15 10.5 15.67 10.5 16.5C10.5 17.33 11.17 18 12 18Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeviceChange("tablet")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedDevice === "tablet"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                    title={t("live_editor.tablet_view")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0H5C3.9 0 3 0.9 3 2V22C3 23.1 3.9 24 5 24H19C20.1 24 21 23.1 21 22V2C21 0.9 20.1 0 19 0ZM19 22H5V2H19V22Z" />
                      <path d="M12 20C12.83 20 13.5 19.33 13.5 18.5C13.5 17.67 12.83 17 12 17C11.17 17 10.5 17.67 10.5 18.5C10.5 19.33 11.17 20 12 20Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeviceChange("laptop")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedDevice === "laptop"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                    title={t("live_editor.desktop_view")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 2H3C1.9 2 1 2.9 1 4V16C1 17.1 1.9 18 3 18H10V20H8V22H16V20H14V18H21C22.1 18 23 17.1 23 16V4C23 2.9 22.1 2 21 2ZM21 16H3V4H21V16Z" />
                    </svg>
                  </button>
                </div>

                <div className="text-sm text-gray-500 font-medium">
                  {deviceDimensions[selectedDevice].name}
                </div>

                <button
                  onClick={() => {
                    state.setSidebarView("add-section");
                    state.setSidebarOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  {t("live_editor.add_new_section")}
                </button>

                <button
                  onClick={handleDeletePage}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  {t("live_editor.delete_page")}
                </button>
                {/* Debug Toggle Button - Development Only */}
                {process.env.NODE_ENV === "development" && (
                  <button
                    onClick={() => setShowDebugPanel(!showDebugPanel)}
                    className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                      showDebugPanel
                        ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                    title="Toggle Debug Panel"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    {t("live_editor.debug")}
                  </button>
                )}

                {/* هذا الزر مخفي فقط , ممكن استخدامه في المستقبل */}
                {/* <button
                  onClick={openMainSidebar}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t("live_editor.open_editor")}
                </button> */}
              </div>
            </div>

            {/* Mobile Layout - Two Rows for screens < 960px */}
            <div className="lg:hidden">
              {/* First Row - Title and Device Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  {/* Components Sidebar Toggle */}
                  <button
                    onClick={() => {
                      const newState = !isComponentsSidebarOpen;
                      setIsComponentsSidebarOpen(newState);
                      // إذا تم إغلاق Components Sidebar يدوياً، ضع علامة على ذلك
                      if (!newState) {
                        setWasComponentsSidebarManuallyClosed(true);
                      } else {
                        setWasComponentsSidebarManuallyClosed(false);
                      }
                    }}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title={
                      isComponentsSidebarOpen
                        ? t("live_editor.hide_components")
                        : t("live_editor.show_components")
                    }
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          isComponentsSidebarOpen
                            ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            : "M13 5l7 7-7 7M5 5l7 7-7 7"
                        }
                      />
                    </svg>
                  </button>
                  <h1 className="text-xl font-bold text-gray-900">
                    {pageTitle} {t("live_editor.editor")}
                  </h1>
                </div>

                {/* Device Preview Controls */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleDeviceChange("phone")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedDevice === "phone"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                    title={t("live_editor.mobile_view")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 20H7V4H17V20Z" />
                      <path d="M12 18C12.83 18 13.5 17.33 13.5 16.5C13.5 15.67 12.83 15 12 15C11.17 15 10.5 15.67 10.5 16.5C10.5 17.33 11.17 18 12 18Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeviceChange("tablet")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedDevice === "tablet"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                    title={t("live_editor.tablet_view")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0H5C3.9 0 3 0.9 3 2V22C3 23.1 3.9 24 5 24H19C20.1 24 21 23.1 21 22V2C21 0.9 20.1 0 19 0ZM19 22H5V2H19V22Z" />
                      <path d="M12 20C12.83 20 13.5 19.33 13.5 18.5C13.5 17.67 12.83 17 12 17C11.17 17 10.5 17.67 10.5 18.5C10.5 19.33 11.17 20 12 20Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeviceChange("laptop")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedDevice === "laptop"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                    title={t("live_editor.desktop_view")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 2H3C1.9 2 1 2.9 1 4V16C1 17.1 1.9 18 3 18H10V20H8V22H16V20H14V18H21C22.1 18 23 17.1 23 16V4C23 2.9 22.1 2 21 2ZM21 16H3V4H21V16Z" />
                    </svg>
                  </button>
                  <div className="text-sm text-gray-500 font-medium pr-2">
                    {deviceDimensions[selectedDevice].name}
                  </div>
                </div>
              </div>

              {/* Second Row - Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      state.setSidebarView("add-section");
                      state.setSidebarOpen(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    {t("live_editor.add_new_section")}
                  </button>

                  <button
                    onClick={handleDeletePage}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {t("live_editor.delete_page")}
                  </button>

                  {/* Debug Toggle Button - Development Only */}
                  {process.env.NODE_ENV === "development" && (
                    <button
                      onClick={() => setShowDebugPanel(!showDebugPanel)}
                      className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                        showDebugPanel
                          ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                      title="Toggle Debug Panel"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      {t("live_editor.debug")}
                    </button>
                  )}

                  {/* هذا الزر مخفي فقط , ممكن استخدامه في المستقبل */}
                  {/* <button
                    onClick={openMainSidebar}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t("live_editor.open_editor")}
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div
            className={`flex-1 p-6 ${selectedDevice === "laptop" ? "" : "flex justify-center"}`}
          >
            <div
              className={`transition-all duration-300 ${
                selectedDevice === "laptop" ? "w-full h-full" : "rounded-lg"
              }`}
              style={{
                width:
                  typeof deviceDimensions[selectedDevice].width === "number"
                    ? `${deviceDimensions[selectedDevice].width}px`
                    : deviceDimensions[selectedDevice].width,
                height:
                  typeof deviceDimensions[selectedDevice].height === "number"
                    ? `${deviceDimensions[selectedDevice].height}px`
                    : deviceDimensions[selectedDevice].height,
                maxWidth: selectedDevice === "laptop" ? "100%" : "100%",
                maxHeight:
                  selectedDevice === "laptop" ? "100%" : "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <AutoFrame
                className="w-full h-full border border-gray-200 rounded-lg"
                style={{ overflow: "auto" }}
                frameRef={iframeRef}
                onReady={() => setIframeReady(true)}
                onNotReady={() => setIframeReady(false)}
              >
                {iframeContent}
              </AutoFrame>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.3,
              }}
              className="fixed right-0 top-0 h-full z-50"
              style={{ width: `${sidebarWidth}px` }}
            >
              <EditorSidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                view={sidebarView}
                setView={state.setSidebarView}
                selectedComponent={selectedComponent}
                onComponentUpdate={handleComponentUpdate}
                onComponentThemeChange={handleComponentThemeChange}
                onComponentReset={handleComponentReset}
                onSectionAdd={handleAddSection}
                onPageThemeChange={handlers.handlePageThemeChange}
                width={sidebarWidth}
                setWidth={state.setSidebarWidth}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Component Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("editor.delete_component")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("live_editor.delete_component_description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Page Dialog */}
        <AlertDialog
          open={deletePageDialogOpen}
          onOpenChange={setDeletePageDialogOpen}
        >
          <AlertDialogContent
            className="max-w-lg"
            onClick={() => setDeletePageDialogOpen(false)}
          >
            <AlertDialogHeader>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                    {t("live_editor.delete_page_permanently")}
                  </AlertDialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("live_editor.delete_page_description")}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">
                      ⚠️ {t("live_editor.critical_warning")}
                    </h4>
                    <ul className="text-red-700 space-y-1 text-sm">
                      <li>• {t("live_editor.page_will_be_deleted")}</li>
                      <li>• {t("live_editor.all_components_lost")}</li>
                      <li>• {t("live_editor.affect_live_website")}</li>
                      <li>• {t("live_editor.no_backup")}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 font-medium">
                  {t("live_editor.confirm_deletion")}
                </p>
                <div className="bg-gray-100 p-3 rounded-lg border">
                  <p className="text-sm font-mono text-gray-800">
                    "{t("live_editor.confirmation_text")}"
                  </p>
                </div>
                <input
                  type="text"
                  value={deletePageConfirmation}
                  onChange={(e) => setDeletePageConfirmation(e.target.value)}
                  placeholder={t("live_editor.type_confirmation")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 pt-4">
              <AlertDialogCancel
                onClick={cancelDeletePage}
                className="flex-1 sm:flex-none bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-6 py-3"
              >
                {t("theme_selector.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeletePage}
                disabled={
                  deletePageConfirmation !==
                  "I am sure I want to delete this page"
                }
                className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 border-0 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {t("live_editor.yes_im_sure")}
              </AlertDialogAction>
            </AlertDialogFooter>
            {/* Coming Soon Overlay - Disabled add page functionality - Only show in production */}
            {process.env.NODE_ENV !== "development" && (
              <div
                className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center pointer-events-auto"
                style={{ paddingTop: "200px" }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">
                    {t("live_editor.coming_soon")}
                  </h2>
                  <p className="text-red-500 font-medium">
                    {t("live_editor.components_disabled")}
                  </p>
                </div>
              </div>
            )}
          </AlertDialogContent>
        </AlertDialog>

        {/* Changes Made Dialog - Modern Popup */}
        <AlertDialog
          open={showChangesDialog}
          onOpenChange={setShowChangesDialog}
        >
          <AlertDialogContent className="max-w-md border-0 shadow-2xl bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="sr-only">
                {t("live_editor.changes_not_saved_title")}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center text-center p-6">
              {/* Modern Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("live_editor.changes_not_saved_title")}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("live_editor.changes_not_saved_description")}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setShowChangesDialog(false)}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {t("live_editor.understood")}
              </button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Debug Panel - Development Only */}
        {showDebugPanel && process.env.NODE_ENV === "development" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  🔍 {t("live_editor.position_debug_panel")}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetPositions}
                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    title="Reset all positions"
                  >
                    {t("live_editor.reset")}
                  </button>
                  <button
                    onClick={() => setShowDebugPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-80">
              {/* Position Validation */}
              {positionValidation && (
                <div className="mb-4">
                  <div
                    className={`text-xs font-medium mb-2 ${positionValidation.isValid ? "text-green-600" : "text-red-600"}`}
                  >
                    {t("live_editor.position_validation")}:{" "}
                    {positionValidation.isValid
                      ? `✅ ${t("live_editor.valid")}`
                      : `❌ ${t("live_editor.invalid")}`}
                  </div>
                  {!positionValidation.isValid && (
                    <div className="space-y-1">
                      {positionValidation.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="text-xs text-red-600 bg-red-50 p-2 rounded"
                        >
                          {issue}
                        </div>
                      ))}
                      {positionValidation.suggestions.map(
                        (suggestion, index) => (
                          <div
                            key={index}
                            className="text-xs text-blue-600 bg-blue-50 p-2 rounded"
                          >
                            💡 {suggestion}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Changes Made Status */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  {t("live_editor.changes_status")}
                </div>
                <div
                  className={`text-xs p-2 rounded border ${
                    hasChangesMade
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{hasChangesMade ? "✅" : "⭕"}</span>
                    <span className="font-mono">
                      {hasChangesMade
                        ? t("live_editor.changes_detected")
                        : t("live_editor.no_changes")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Components */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  {t("live_editor.current_components")} ({pageComponents.length}
                  )
                </div>
                <div className="space-y-1">
                  {pageComponents.map((comp: any, index: number) => (
                    <div
                      key={comp.id}
                      className={`text-xs p-2 rounded border ${
                        selectedComponentId === comp.id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="font-mono">
                        {index}: {comp.componentName || comp.name || "Unknown"}
                      </div>
                      <div className="text-gray-500">
                        ID: {comp.id.slice(0, 8)}... | Position:{" "}
                        {comp.position ?? "undefined"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Debug Info */}
              {debugInfo && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    {t("live_editor.last_move_operation")}
                  </div>
                  <div className="text-xs bg-gray-50 p-2 rounded border">
                    <div>
                      <strong>{t("live_editor.component")}:</strong>{" "}
                      {debugInfo.operation.componentName}
                    </div>
                    <div>
                      <strong>{t("live_editor.from")}:</strong>{" "}
                      {debugInfo.operation.sourceIndex} →{" "}
                      <strong>{t("live_editor.to")}:</strong>{" "}
                      {debugInfo.calculatedIndex}
                    </div>
                    <div>
                      <strong>{t("live_editor.final")}:</strong>{" "}
                      {debugInfo.finalIndex}
                    </div>
                    {debugInfo.adjustmentReason && (
                      <div>
                        <strong>{t("live_editor.reason")}:</strong>{" "}
                        {debugInfo.adjustmentReason}
                      </div>
                    )}
                    <div>
                      <strong>{t("live_editor.timestamp")}:</strong>{" "}
                      {new Date(
                        debugInfo.operation.timestamp,
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const report = generatePositionReport();
                  }}
                  className="w-full text-xs px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {t("live_editor.generate_full_report")}
                </button>
                <button
                  onClick={() => {
                    positionTracker.setDebugMode(!positionTracker["debugMode"]);
                  }}
                  className="w-full text-xs px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  {t("live_editor.toggle_verbose_logging")}
                </button>
                <button
                  onClick={() => {
                    setShowDebugControls(true);
                  }}
                  className="w-full text-xs px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {t("live_editor.debug_changes")}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Debug Controls - Development Only */}
        {showDebugControls && process.env.NODE_ENV === "development" && (
          <DebugControls onClose={() => setShowDebugControls(false)} />
        )}
      </div>
    </EnhancedLiveEditorDragDropContext>
  );
}
