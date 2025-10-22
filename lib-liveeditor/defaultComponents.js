// استيراد البيانات الافتراضية من defaultData.json
import defaultData from '../lib/defaultData.json';

// تعريف الصفحات المتاحة وأقسامها من defaultData.json
export const PAGE_DEFINITIONS = defaultData;

// Export للتوافق مع الكود القديم
export const defaultComponents = PAGE_DEFINITIONS;
