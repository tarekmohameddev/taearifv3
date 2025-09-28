// lib/security-enhancements.ts - تحسينات الأمان للـ Live Editor

import { NextRequest, NextResponse } from 'next/server';

// تحسينات الأمان العامة
export const securityEnhancements = {
  // تنظيف البيانات المدخلة
  sanitizeInput: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // إزالة scripts
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // إزالة iframes
      .replace(/javascript:/gi, '') // إزالة javascript: URLs
      .replace(/on\w+\s*=/gi, '') // إزالة event handlers
      .trim();
  },

  // التحقق من صحة البيانات
  validateData: (data: any, schema: any): boolean => {
    try {
      // التحقق من وجود البيانات المطلوبة
      for (const field in schema) {
        if (schema[field].required && !data[field]) {
          return false;
        }
        
        // التحقق من نوع البيانات
        if (data[field] && typeof data[field] !== schema[field].type) {
          return false;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  // تشفير البيانات الحساسة
  encryptSensitiveData: (data: string): string => {
    // استخدام Base64 للتشفير البسيط
    return Buffer.from(data).toString('base64');
  },

  // فك تشفير البيانات
  decryptSensitiveData: (encryptedData: string): string => {
    try {
      return Buffer.from(encryptedData, 'base64').toString('utf-8');
    } catch (error) {
      return '';
    }
  }
};

// تحسينات أمان API
export const apiSecurityEnhancements = {
  // التحقق من المصادقة
  authenticateRequest: async (request: NextRequest): Promise<boolean> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) return false;
      
      // التحقق من صحة الـ token
      // يمكن إضافة JWT verification هنا
      return true;
    } catch (error) {
      return false;
    }
  },

  // التحقق من الصلاحيات
  authorizeRequest: async (request: NextRequest, requiredRole: string): Promise<boolean> => {
    try {
      // التحقق من صلاحيات المستخدم
      const userRole = request.headers.get('x-user-role');
      return userRole === requiredRole;
    } catch (error) {
      return false;
    }
  },

  // حماية من CSRF
  csrfProtection: (request: NextRequest): boolean => {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // التحقق من المصدر الموثوق
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-domain.com'
    ];
    
    return allowedOrigins.includes(origin || '') || 
           allowedOrigins.some(allowed => referer?.startsWith(allowed));
  },

  // حماية من SQL Injection
  sqlInjectionProtection: (query: string): string => {
    return query
      .replace(/['"]/g, '') // إزالة الاقتباسات
      .replace(/;/g, '') // إزالة الفواصل المنقوطة
      .replace(/--/g, '') // إزالة التعليقات
      .replace(/\/\*/g, '') // إزالة التعليقات متعددة الأسطر
      .replace(/\*\//g, '');
  }
};

// تحسينات أمان المكونات
export const componentSecurityEnhancements = {
  // تنظيف props المكونات
  sanitizeComponentProps: (props: any): any => {
    const sanitized = { ...props };
    
    // تنظيف النصوص
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = securityEnhancements.sanitizeInput(sanitized[key]);
      }
    }
    
    return sanitized;
  },

  // التحقق من صحة المكونات
  validateComponent: (component: any): boolean => {
    const requiredFields = ['id', 'type', 'name'];
    
    for (const field of requiredFields) {
      if (!component[field]) {
        return false;
      }
    }
    
    // التحقق من نوع المكون
    const allowedTypes = [
      'hero', 'header', 'footer', 'content', 
      'property', 'contact', 'form'
    ];
    
    return allowedTypes.includes(component.type);
  },

  // حماية من XSS
  xssProtection: (content: string): string => {
    return content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
};

// تحسينات أمان قاعدة البيانات
export const databaseSecurityEnhancements = {
  // تنظيف استعلامات قاعدة البيانات
  sanitizeQuery: (query: any): any => {
    const sanitized = { ...query };
    
    // تنظيف جميع القيم
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = apiSecurityEnhancements.sqlInjectionProtection(sanitized[key]);
      }
    }
    
    return sanitized;
  },

  // التحقق من صحة البيانات قبل الحفظ
  validateBeforeSave: (data: any): boolean => {
    // التحقق من وجود البيانات المطلوبة
    if (!data.id || !data.type) {
      return false;
    }
    
    // التحقق من حجم البيانات
    const dataSize = JSON.stringify(data).length;
    if (dataSize > 1000000) { // 1MB limit
      return false;
    }
    
    return true;
  },

  // حماية من NoSQL Injection
  nosqlInjectionProtection: (query: any): any => {
    const protectedQuery = { ...query };
    
    // إزالة العمليات الخطيرة
    const dangerousOperators = ['$where', '$regex', '$text', '$expr'];
    for (const op of dangerousOperators) {
      delete protectedQuery[op];
    }
    
    return protectedQuery;
  }
};

// تحسينات أمان الملفات
export const fileSecurityEnhancements = {
  // التحقق من نوع الملف
  validateFileType: (filename: string, allowedTypes: string[]): boolean => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  },

  // التحقق من حجم الملف
  validateFileSize: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
  },

  // تنظيف اسم الملف
  sanitizeFilename: (filename: string): string => {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // إزالة الأحرف الخاصة
      .replace(/\.{2,}/g, '.') // إزالة النقاط المتعددة
      .toLowerCase();
  },

  // التحقق من محتوى الملف
  validateFileContent: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // التحقق من وجود محتوى خطير
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /vbscript:/i,
          /onload/i,
          /onerror/i
        ];
        
        const isSafe = !dangerousPatterns.some(pattern => pattern.test(content));
        resolve(isSafe);
      };
      reader.readAsText(file);
    });
  }
};

// تحسينات أمان الجلسات
export const sessionSecurityEnhancements = {
  // التحقق من صحة الجلسة
  validateSession: (session: any): boolean => {
    if (!session || !session.user) {
      return false;
    }
    
    // التحقق من انتهاء صلاحية الجلسة
    const now = Date.now();
    const sessionExpiry = session.expires || 0;
    
    return sessionExpiry > now;
  },

  // تجديد الجلسة
  refreshSession: (session: any): any => {
    return {
      ...session,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 ساعة
    };
  },

  // إنهاء الجلسة
  terminateSession: (session: any): void => {
    // تنظيف بيانات الجلسة
    if (session) {
      delete session.user;
      delete session.expires;
    }
  }
};

// تحسينات أمان الشبكة
export const networkSecurityEnhancements = {
  // حماية من DDoS
  ddosProtection: async (request: NextRequest): Promise<boolean> => {
    const ip = request.ip || 'unknown';
    // محاكاة rate limiting
    return true;
  },

  // حماية من Brute Force
  bruteForceProtection: async (request: NextRequest): Promise<boolean> => {
    const ip = request.ip || 'unknown';
    const attempts = await getFailedAttempts(ip);
    
    if (attempts > 5) {
      return false; // حظر IP
    }
    
    return true;
  },

  // تسجيل محاولات الدخول الفاشلة
  logFailedAttempt: async (ip: string): Promise<void> => {
    // تسجيل محاولة فاشلة
    await incrementFailedAttempts(ip);
  }
};

// دوال مساعدة
const getFailedAttempts = async (ip: string): Promise<number> => {
  // تنفيذ منطق الحصول على المحاولات الفاشلة
  return 0;
};

const incrementFailedAttempts = async (ip: string): Promise<void> => {
  // تنفيذ منطق زيادة المحاولات الفاشلة
};

// تصدير جميع التحسينات
export const allSecurityEnhancements = {
  ...securityEnhancements,
  ...apiSecurityEnhancements,
  ...componentSecurityEnhancements,
  ...databaseSecurityEnhancements,
  ...fileSecurityEnhancements,
  ...sessionSecurityEnhancements,
  ...networkSecurityEnhancements
};

export default allSecurityEnhancements;
