export const defaultLocale = 'ar' as const;
export const locales = ['ar', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ar: "https://flagcdn.com/24x18/sa.png",
  en: "https://flagcdn.com/24x18/us.png",
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const localeFonts: Record<Locale, string> = {
  ar: 'Cairo, Inter, system-ui, sans-serif',
  en: 'Inter, system-ui, sans-serif',
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
