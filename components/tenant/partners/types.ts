export interface Client {
  name: string;
  logo: string;
  logoDark?: string;
  logoLight?: string;
  link?: string;
}

export interface ClientsSectionData {
  texts: {
    title: string;
    subtitle: string;
    badge: string;
  };
  settings: {
    showBadge: boolean;
    animation: boolean;
    autoplay: boolean;
    intervalMs: number;
  };
  layout: {
    cardsPerSlide: number;
    columns: number;
    rows: number;
    gap: string;
  };
  colors: {
    titleColor: string;
    subtitleColor: string;
    badgeColor: string;
    paginationActive: string;
    paginationInactive: string;
  };
  clients: Client[];
}

export interface ClientsSliderProps {
  variant?: string;
  texts?: {
    title?: string;
    subtitle?: string;
    badge?: string;
  };
  settings?: {
    showBadge?: boolean;
    animation?: boolean;
    autoplay?: boolean;
    intervalMs?: number;
  };
  layout?: {
    cardsPerSlide?: number;
    columns?: number;
    rows?: number;
    gap?: string;
  };
  colors?: {
    titleColor?: string;
    subtitleColor?: string;
    badgeColor?: string;
    paginationActive?: string;
    paginationInactive?: string;
  };
  clients?: Client[];
  [key: string]: any; // Allow additional props
}

// Default data structure for fallback
export const defaultClientsSectionData: ClientsSectionData = {
  texts: {
    title: "Our Clients",
    subtitle:
      "We proudly serve organizations that rely on us for high-quality, reliable printing solutions",
    badge: "— Our Clients —",
  },
  settings: {
    showBadge: true,
    animation: false,
    autoplay: true,
    intervalMs: 5000,
  },
  layout: {
    cardsPerSlide: 16,
    columns: 4,
    rows: 4,
    gap: "2",
  },
  colors: {
    titleColor: "#2F2E0C",
    subtitleColor: "#2F2E0C",
    badgeColor: "#004B4B",
    paginationActive: "#00D1D1",
    paginationInactive: "#6B7280",
  },
  clients: Array.from({ length: 32 }, (_, i) => ({
    name: `Client ${i + 1}`,
    logo: "/images/placeholder.svg",
    logoDark: "/images/placeholder.svg",
    logoLight: "/images/placeholder.svg",
  })),
};
