// lib/performance-optimizations.ts - تحسينات الأداء للـ Live Editor

import React, { ComponentType } from 'react';

// تحسينات التحميل المؤجل
export const lazyLoadComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return React.lazy(importFn);
};

// تحسينات التخزين المؤقت
export class ComponentCache {
  private static cache = new Map<string, any>();
  private static maxSize = 100;

  static set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  static get(key: string): any {
    return this.cache.get(key);
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }

  static clear(): void {
    this.cache.clear();
  }
}

// تحسينات الصور
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', '80'); // جودة 80%
  params.set('f', 'webp'); // تنسيق WebP
  
  return `${src}?${params.toString()}`;
};

// تحسينات الشبكة
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// تحسينات الذاكرة
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// تحسينات التحميل
export const preloadComponent = (importFn: () => Promise<any>): void => {
  importFn().catch(() => {
    // تجاهل الأخطاء في التحميل المسبق
  });
};

// تحسينات التخزين المحلي
export const localStorageOptimized = {
  setItem: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

// تحسينات الأداء العامة
export const performanceOptimizations = {
  // تحسين التحميل الأولي
  optimizeInitialLoad: () => {
    // تحميل المكونات الحرجة أولاً
    const criticalComponents = [
      () => import('@/components/tenant/live-editor/LiveEditor'),
      () => import('@/components/tenant/live-editor/LiveEditorUI')
    ];
    
    criticalComponents.forEach(component => {
      preloadComponent(component);
    });
  },
  
  // تحسين التحديثات
  optimizeUpdates: () => {
    // استخدام requestAnimationFrame للتحديثات
    let rafId: number;
    
    return (callback: () => void) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(callback);
    };
  },
  
  // تحسين الذاكرة
  optimizeMemory: () => {
    // تنظيف الذاكرة بانتظام
    setInterval(() => {
      if ((ComponentCache as any).cache.size > 50) {
        ComponentCache.clear();
      }
    }, 30000); // كل 30 ثانية
  }
};

// تحسينات خاصة بـ Live Editor
export const liveEditorOptimizations = {
  // تحسين تحميل المكونات
  optimizeComponentLoading: (componentType: string) => {
    const cacheKey = `component_${componentType}`;
    
    if (ComponentCache.has(cacheKey)) {
      return ComponentCache.get(cacheKey);
    }
    
    // تحميل المكون مع التخزين المؤقت
    const component = lazyLoadComponent(() => 
      import(`@/components/tenant/${componentType}`)
    );
    
    ComponentCache.set(cacheKey, component);
    return component;
  },
  
  // تحسين تحديثات البيانات
  optimizeDataUpdates: (data: any) => {
    // استخدام debounce لتحديثات البيانات
    return debounce((newData: any) => {
      // تحديث البيانات
      console.log('Updating data:', newData);
    }, 300);
  },
  
  // تحسين التصيير
  optimizeRendering: () => {
    // استخدام React.memo للمكونات
    return React.memo;
  }
};

export default performanceOptimizations;
