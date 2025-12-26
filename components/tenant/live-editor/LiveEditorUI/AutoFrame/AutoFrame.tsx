"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// AutoFrame Component - مستوحى من Puck مع نسخ الـ styles
interface AutoFrameProps {
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  frameRef: React.RefObject<HTMLIFrameElement | null>;
  onReady?: () => void;
  onNotReady?: () => void;
}

export default function AutoFrame({
  children,
  className,
  style,
  frameRef,
  onReady,
  onNotReady,
}: AutoFrameProps) {
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
      html {
        direction: rtl !important;
        overflow-x: hidden;
        overflow-y: auto;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        direction: rtl !important;
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
        direction: rtl !important;
      }
      /* ضمان عمل الـ scroll في الـ iframe */
      iframe {
        overflow: auto !important;
      }
      /* إزالة أي قيود على الـ scroll */
      .overflow-hidden {
        overflow: auto !important;
      }
      /* فرض RTL على جميع العناصر */
      html[dir="rtl"],
      body[dir="rtl"],
      [dir="rtl"] {
        direction: rtl !important;
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
        // فرض RTL بشكل إجباري على الـ iframe
        doc.documentElement.setAttribute("dir", "rtl");
        if (doc.body) {
          doc.body.setAttribute("dir", "rtl");
        }
        
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
    updateCSSVariables,
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
      srcDoc='<!DOCTYPE html><html dir="rtl"><head></head><body dir="rtl"><div id="frame-root" data-live-editor-entry></div></body></html>'
      ref={frameRef}
      onLoad={() => setLoaded(true)}
    >
      {loaded &&
        mountTarget &&
        stylesLoaded &&
        createPortal(children, mountTarget)}
    </iframe>
  );
}


