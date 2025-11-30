"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultLogosTickerData } from "@/context-liveeditor/editorStoreFunctions/logosTickerFunctions";
import {
  TrustedBrandsScroller,
  TrustedBrandsScrollerReverse,
} from "@/components/tenant/logosTicker/components/trusted-brands-scroller";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface LogosTickerProps {
  // Component-specific props
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
  };
  content?: {
    title?: string;
    subtitle?: string;
  };
  logos?: Array<{
    id?: string;
    src: string;
    alt?: string;
  }>;
  displayMode?: "both" | "forward" | "reverse";
  animation?: {
    speed?: number;
    pauseOnHover?: boolean;
  };
  styling?: {
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    logoOpacity?: number;
    logoHoverOpacity?: number;
  };
  typography?: any;
  
  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function LogosTicker1(props: LogosTickerProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "logosTicker1";
  const uniqueId = props.id || variantId;
  
  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const logosTickerStates = useEditorStore(s => s.logosTickerStates);
  
  const tenantData = useTenantStore(s => s.tenantData);
  
  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.useStore) {
      // Prepare initial data from props
      const initialData = {
        ...getDefaultLogosTickerData(),
        ...props
      };
      
      // Initialize in store
      ensureComponentVariant("logosTicker", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore]);
  
  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = logosTickerStates[uniqueId];
  const currentStoreData = getComponentData("logosTicker", uniqueId);
  
  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultLogosTickerData(),    // 1. Defaults (lowest priority)
    ...storeData,                       // 2. Store state
    ...currentStoreData,                // 3. Current store data
    ...props                            // 4. Props (highest priority)
  };
  
  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }
  
  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  // Get display mode (default to "both")
  const displayMode = mergedData.displayMode || "both";
  
  // Prepare logos array
  const logos = mergedData.logos || [];
  
  // Animation settings
  const animationSpeed = mergedData.animation?.speed || 40;
  const pauseOnHover = mergedData.animation?.pauseOnHover !== false;
  const logoOpacity = mergedData.styling?.logoOpacity || 0.6;
  const logoHoverOpacity = mergedData.styling?.logoHoverOpacity || 1.0;

  return (
    <section 
      className="py-16 md:py-20"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "transparent",
        paddingTop: mergedData.layout?.padding?.top || "4rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "4rem"
      }}
    >
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1600px"
        }}
      >
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="section-title font-bold mb-6"
            style={{ 
              color: mergedData.styling?.titleColor || "#0D2EA1",
              fontSize: mergedData.typography?.title?.fontSize?.desktop || "3xl",
              fontWeight: mergedData.typography?.title?.fontWeight || "bold",
              fontFamily: mergedData.typography?.title?.fontFamily || "Tajawal"
            }}
          >
            {mergedData.content?.title || (isRTL
              ? "موثوق بنا من قبل الفرق الطموحة التي تبني المستقبل"
              : "Trusted by ambitious teams building the future")}
          </h2>
          <p 
            className="section-subtitle text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{
              color: mergedData.styling?.subtitleColor || "#6b7280",
              fontSize: mergedData.typography?.subtitle?.fontSize?.desktop || "lg",
              fontWeight: mergedData.typography?.subtitle?.fontWeight || "normal",
              fontFamily: mergedData.typography?.subtitle?.fontFamily || "Tajawal"
            }}
          >
            {mergedData.content?.subtitle || (isRTL
              ? "من الشركات الناشئة إلى الشركات الكبرى يعتمد عملائنا على رواد لتبسيط العمليات وتعزيز الرؤية وتسريع النمو."
              : "From startups to established enterprises, our clients rely on Rouad to streamline operations, boost visibility, and accelerate growth.")}
          </p>
        </div>

        {/* Scrolling Logos */}
        <div className="space-y-8" dir="ltr">
          {/* Show forward scroller if displayMode is "both" or "forward" */}
          {(displayMode === "both" || displayMode === "forward") && (
            <TrustedBrandsScroller
              logos={logos}
              speed={animationSpeed}
              pauseOnHover={pauseOnHover}
              opacity={logoOpacity}
              hoverOpacity={logoHoverOpacity}
            />
          )}
          
          {/* Show reverse scroller if displayMode is "both" or "reverse" */}
          {(displayMode === "both" || displayMode === "reverse") && (
            <TrustedBrandsScrollerReverse
              logos={logos}
              speed={animationSpeed}
              pauseOnHover={pauseOnHover}
              opacity={logoOpacity}
              hoverOpacity={logoHoverOpacity}
            />
          )}
        </div>
      </div>
    </section>
  );
}
