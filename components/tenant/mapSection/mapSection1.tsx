"use client";

import { useEffect, useState } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultMapSectionData } from "@/context-liveeditor/editorStoreFunctions/mapSectionFunctions";

interface MapSectionProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const MapSection1: React.FC<MapSectionProps> = ({
  useStore = true,
  variant = "mapSection1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "mapSection1";
  const uniqueId = id || variantId;
  
  // Add state to force re-renders when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this mapSection variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const mapSectionStates = useEditorStore((s) => s.mapSectionStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultMapSectionData(),
        ...props,
      };
      ensureComponentVariant("mapSection", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Add effect to listen for store updates
  useEffect(() => {
    if (props.useStore) {
      // Force re-render when store data changes
      const unsubscribe = useEditorStore.subscribe((state) => {
        const newMapSectionStates = state.mapSectionStates;
        console.log('🔄 MapSection Store subscription triggered:', {
          uniqueId,
          newMapSectionStates,
          hasData: !!newMapSectionStates[uniqueId],
          allKeys: Object.keys(newMapSectionStates)
        });
        if (newMapSectionStates[uniqueId]) {
          console.log('🔄 MapSection Store subscription triggered for:', uniqueId, newMapSectionStates[uniqueId]);
          // Force re-render by updating state
          setForceUpdate(prev => prev + 1);
        }
      });
      
      return unsubscribe;
    }
  }, [props.useStore, uniqueId]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("mapSection", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? mapSectionStates[uniqueId] || {}
    : {};

  // Debug: Log when data changes
  useEffect(() => {
    if (props.useStore) {
      console.log('🔄 MapSection Data Updated:', {
        uniqueId,
        storeData,
        currentStoreData,
        forceUpdate,
        mapSectionStates,
        allMapSectionStates: Object.keys(mapSectionStates),
        getComponentDataResult: getComponentData("mapSection", uniqueId)
      });
    }
  }, [storeData, currentStoreData, forceUpdate, props.useStore, uniqueId, mapSectionStates, getComponentData]);

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }

    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by type and componentName
          if (
            (component as any).type === "mapSection" &&
            (component as any).componentName === variantId
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Check if we have any data from API/stores first
  const hasApiData = tenantComponentData && Object.keys(tenantComponentData).length > 0;
  const hasStoreData = (storeData && Object.keys(storeData).length > 0) || (currentStoreData && Object.keys(currentStoreData).length > 0);
  const hasPropsData = props.map || props.content;

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultMapSectionData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    map: {
      ...defaultData.map,
      ...(props.map || {}),
      ...(tenantComponentData?.map || {}),
      ...(storeData?.map || {}),
      ...(currentStoreData?.map || {}),
    },
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData?.content || {}),
      ...(storeData?.content || {}),
      ...(currentStoreData?.content || {}),
    },
    markers: {
      ...defaultData.markers,
      ...(props.markers || {}),
      ...(tenantComponentData?.markers || {}),
      ...(storeData?.markers || {}),
      ...(currentStoreData?.markers || {}),
    },
  };

  // Debug: Log the final merged data
  console.log('🔍 MapSection Final Merge:', {
    uniqueId,
    currentStoreData,
    storeData,
    mergedData,
    mapEnabled: mergedData.map?.enabled,
    contentEnabled: mergedData.content?.enabled,
    mapSectionStatesKeys: Object.keys(mapSectionStates),
    getComponentDataResult: getComponentData("mapSection", uniqueId)
  });

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Use merged data with proper fallbacks
  const title = mergedData.content?.title || defaultData.content.title;
  const subtitle = mergedData.content?.subtitle || defaultData.content.subtitle;
  const description = mergedData.content?.description || defaultData.content.description;
  const mapSrc = mergedData.map?.embedUrl || defaultData.map.embedUrl;
  const mapHeight = mergedData.height?.desktop || defaultData.height.desktop;

  return (
    <section className="container mx-auto px-4 py-8">
      {mergedData.content?.enabled && (
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: mergedData.content?.font?.title?.family || defaultData.content.font.title.family,
              fontSize: mergedData.content?.font?.title?.size || defaultData.content.font.title.size,
              fontWeight: mergedData.content?.font?.title?.weight || defaultData.content.font.title.weight,
              color: mergedData.content?.font?.title?.color || defaultData.content.font.title.color,
              lineHeight: mergedData.content?.font?.title?.lineHeight || defaultData.content.font.title.lineHeight,
            }}
          >
            {title}
          </h2>
          {description && (
            <p 
              className="text-base text-gray-500"
              style={{
                fontFamily: mergedData.content?.font?.description?.family || defaultData.content.font.description.family,
                fontSize: mergedData.content?.font?.description?.size || defaultData.content.font.description.size,
                fontWeight: mergedData.content?.font?.description?.weight || defaultData.content.font.description.weight,
                color: mergedData.content?.font?.description?.color || defaultData.content.font.description.color,
                lineHeight: mergedData.content?.font?.description?.lineHeight || defaultData.content.font.description.lineHeight,
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}
      
      {mergedData.map?.enabled && (
        <div className="w-full max-w-[1600px] mx-auto">
          <iframe
            src={mapSrc}
            width="100%"
            height={mapHeight}
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}
    </section>
  );
};

export default MapSection1;
