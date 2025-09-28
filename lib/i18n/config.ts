export const defaultLocale = 'en' as const;
export const locales = ['en', 'ar'] as const; // English first as natural default

// Default direction for the entire project - LTR is natural and default
export const defaultDirection = 'ltr' as const;
export const isRTLSupported = true; // RTL is supported but not default

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
  en: "https://flagcdn.com/24x18/us.png",
  ar: "https://flagcdn.com/24x18/sa.png",
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr', // English uses LTR as natural default
  ar: 'rtl', // Arabic uses RTL when explicitly selected
};

export const localeFonts: Record<Locale, string> = {
  en: 'Inter, system-ui, sans-serif',
  ar: 'Cairo, Inter, system-ui, sans-serif',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (isValidLocale(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLocale;
}

export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (isValidLocale(firstSegment)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (pathname === '/') {
    return `/${locale}`;
  }
  
  return `/${locale}${pathname}`;
}

// Helper functions for direction management
export function getDefaultDirection(): 'ltr' | 'rtl' {
  return defaultDirection;
}

export function getDirectionForLocale(locale: Locale): 'ltr' | 'rtl' {
  return localeDirections[locale];
}

export function isLTRDefault(): boolean {
  return defaultDirection === 'ltr';
}

export function shouldUseRTL(locale: Locale): boolean {
  return getDirectionForLocale(locale) === 'rtl';
}
