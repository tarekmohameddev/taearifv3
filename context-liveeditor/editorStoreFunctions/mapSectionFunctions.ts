import { ComponentData } from "@/lib/types";
import { createDefaultData } from "./types";

// Default data for map section
export const getDefaultMapSectionData = (): ComponentData => ({
  visible: true,
  height: {
    desktop: "500px",
    tablet: "400px",
    mobile: "300px",
  },
  map: {
    enabled: true,
    apiKey: "",
    center: {
      lat: 26.331491700000003,
      lng: 43.91428236250001,
    },
    zoom: 13,
    mapType: "roadmap",
    style: "default",
    gestureHandling: "auto",
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118991.6033066348!2d43.91428236250001!3d26.331491700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e97523f269a8385%3A0xc66519139265f49e!2sAl%20Qassim%20Province%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1709605799797!5m2!1sen!2sus",
  },
  markers: {
    enabled: true,
    list: [
      {
        id: "marker-1",
        title: "المكتب الرئيسي",
        description: "موقع مكتبنا الرئيسي في القصيم",
        position: {
          lat: 26.331491700000003,
          lng: 43.91428236250001,
        },
        icon: "",
        iconSize: "32x32",
        animation: "bounce",
        clickable: true,
        draggable: false,
        visible: true,
      },
    ],
  },
  infoWindow: {
    enabled: true,
    maxWidth: "300px",
    pixelOffset: "0,0",
    disableAutoPan: false,
    zIndex: 1000,
    style: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
  },
  overlay: {
    enabled: false,
    opacity: "0.3",
    color: "#000000",
    zIndex: 1,
  },
  content: {
    enabled: true,
    title: "تواصل معنا",
    subtitle:
      "نرحب بجميع استفساراتكم واستعدادنا لتقديم المساعدة على مدار الساعة. إذا كان لديكم أي أسئلة حول خدماتنا أو ترغبون في حجز موعد، لا تترددوا في الاتصال بنا.",
    description:
      "نحن متواجدون في قلب المدينة، يمكن الوصول إلينا بسهولة عبر وسائل النقل العام مع توفر مواقف سيارات واسعة.",
    position: "top-left",
    style: {
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      maxWidth: "300px",
    },
    font: {
      title: {
        family: "Inter",
        size: "24px",
        weight: "600",
        color: "#1f2937",
        lineHeight: "1.2",
      },
      subtitle: {
        family: "Inter",
        size: "18px",
        weight: "400",
        color: "#6b7280",
        lineHeight: "1.5",
      },
      description: {
        family: "Inter",
        size: "16px",
        weight: "400",
        color: "#6b7280",
        lineHeight: "1.5",
      },
    },
  },
  responsive: {
    breakpoints: {
      mobile: "768px",
      tablet: "1024px",
      desktop: "1280px",
    },
    height: {
      mobile: "300px",
      tablet: "400px",
      desktop: "500px",
    },
    zoom: {
      mobile: 13,
      tablet: 14,
      desktop: 15,
    },
  },
  animations: {
    mapLoad: {
      enabled: true,
      type: "fadeIn",
      duration: 500,
      delay: 0,
    },
    markers: {
      enabled: true,
      type: "bounce",
      duration: 300,
      delay: 100,
      stagger: 50,
    },
    content: {
      enabled: true,
      type: "fadeIn",
      duration: 400,
      delay: 200,
    },
  },
  events: {
    onMapClick: true,
    onMarkerClick: true,
    onMapLoad: true,
    onZoomChange: false,
    onCenterChange: false,
  },
});

// Map section functions
export const mapSectionFunctions = {
  // Get default data
  getDefaultData: getDefaultMapSectionData,

  // Create new map section data
  createNew: (): ComponentData => getDefaultMapSectionData(),

  // Ensure variant exists in store
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (!state.mapSectionStates) {
      state.mapSectionStates = {};
    }

    if (!state.mapSectionStates[variantId]) {
      const defaultData = getDefaultMapSectionData();
      const data: ComponentData = initial || defaultData;
      state.mapSectionStates[variantId] = data;
    }

    return {
      mapSectionStates: {
        ...state.mapSectionStates,
        [variantId]: state.mapSectionStates[variantId],
      },
    };
  },

  // Get data for variant
  getData: (state: any, variantId: string): ComponentData => {
    const data = state.mapSectionStates?.[variantId];
    if (!data || Object.keys(data).length === 0) {
      return getDefaultMapSectionData();
    }
    return data;
  },

  // Set data for variant
  setData: (state: any, variantId: string, data: ComponentData) => {
    return {
      mapSectionStates: {
        ...state.mapSectionStates,
        [variantId]: data,
      },
    };
  },

  // Update data by path
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const currentData =
      state.mapSectionStates?.[variantId] || getDefaultMapSectionData();

    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    const newData: any = { ...currentData };
    let cursor: any = newData;

    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i]!;
      const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
      const existing = cursor[key];

      if (
        existing == null ||
        typeof existing === "string" ||
        typeof existing === "number" ||
        typeof existing === "boolean"
      ) {
        cursor[key] = nextIsIndex ? [] : {};
      } else if (Array.isArray(existing) && !nextIsIndex) {
        cursor[key] = {};
      } else if (
        typeof existing === "object" &&
        !Array.isArray(existing) &&
        nextIsIndex
      ) {
        cursor[key] = [];
      }
      cursor = cursor[key];
    }

    const lastKey = segments[segments.length - 1]!;
    cursor[lastKey] = value;

    return {
      mapSectionStates: {
        ...state.mapSectionStates,
        [variantId]: newData,
      },
    };
  },

  // Update map section data
  update: (
    currentData: ComponentData,
    updates: Partial<ComponentData>,
  ): ComponentData => ({
    ...currentData,
    ...updates,
  }),

  // Add new marker
  addMarker: (currentData: ComponentData, marker: any): ComponentData => ({
    ...currentData,
    markers: {
      ...currentData.markers,
      list: [...(currentData.markers?.list || []), marker],
    },
  }),

  // Remove marker
  removeMarker: (
    currentData: ComponentData,
    markerId: string,
  ): ComponentData => ({
    ...currentData,
    markers: {
      ...currentData.markers,
      list: (currentData.markers?.list || []).filter(
        (marker: any) => marker.id !== markerId,
      ),
    },
  }),

  // Update marker
  updateMarker: (
    currentData: ComponentData,
    markerId: string,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    markers: {
      ...currentData.markers,
      list: (currentData.markers?.list || []).map((marker: any) =>
        marker.id === markerId ? { ...marker, ...updates } : marker,
      ),
    },
  }),

  // Update map center
  updateMapCenter: (
    currentData: ComponentData,
    lat: number,
    lng: number,
  ): ComponentData => ({
    ...currentData,
    map: {
      ...currentData.map,
      center: { lat, lng },
    },
  }),

  // Update map zoom
  updateMapZoom: (currentData: ComponentData, zoom: number): ComponentData => ({
    ...currentData,
    map: {
      ...currentData.map,
      zoom,
    },
  }),

  // Toggle map controls
  toggleMapControl: (
    currentData: ComponentData,
    control: string,
    enabled: boolean,
  ): ComponentData => ({
    ...currentData,
    map: {
      ...currentData.map,
      [control]: enabled,
    },
  }),

  // Update content overlay
  updateContentOverlay: (
    currentData: ComponentData,
    content: any,
  ): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      ...content,
    },
  }),

  // Update animations
  updateAnimations: (
    currentData: ComponentData,
    animations: any,
  ): ComponentData => ({
    ...currentData,
    animations: {
      ...currentData.animations,
      ...animations,
    },
  }),

  // Update responsive settings
  updateResponsive: (
    currentData: ComponentData,
    responsive: any,
  ): ComponentData => ({
    ...currentData,
    responsive: {
      ...currentData.responsive,
      ...responsive,
    },
  }),

  // Validate map data
  validate: (data: ComponentData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.map?.apiKey) {
      errors.push("Google Maps API Key is required");
    }

    if (!data.map?.center?.lat || !data.map?.center?.lng) {
      errors.push("Map center coordinates are required");
    }

    if (data.map?.zoom && (data.map.zoom < 1 || data.map.zoom > 20)) {
      errors.push("Map zoom level must be between 1 and 20");
    }

    if (data.markers?.enabled && data.markers.list) {
      data.markers.list.forEach((marker: any, index: number) => {
        if (!marker.position?.lat || !marker.position?.lng) {
          errors.push(`Marker ${index + 1} is missing position coordinates`);
        }
        if (!marker.id) {
          errors.push(`Marker ${index + 1} is missing ID`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get map bounds from markers
  getMapBounds: (
    data: ComponentData,
  ): { north: number; south: number; east: number; west: number } | null => {
    if (!data.markers?.list || data.markers.list.length === 0) {
      return null;
    }

    const lats = data.markers.list
      .map((marker: any) => marker.position?.lat)
      .filter(Boolean);
    const lngs = data.markers.list
      .map((marker: any) => marker.position?.lng)
      .filter(Boolean);

    if (lats.length === 0 || lngs.length === 0) {
      return null;
    }

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };
  },

  // Generate map embed URL
  generateEmbedUrl: (data: ComponentData): string => {
    if (!data.map?.center?.lat || !data.map?.center?.lng) {
      return "";
    }

    const { lat, lng } = data.map.center;
    const zoom = data.map.zoom || 15;
    const mapType = data.map.mapType || "roadmap";

    return `https://www.google.com/maps/embed/v1/view?key=${data.map.apiKey}&center=${lat},${lng}&zoom=${zoom}&maptype=${mapType}`;
  },
};
