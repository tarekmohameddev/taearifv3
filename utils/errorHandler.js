/**
 * مساعد معالجة الأخطاء الشامل
 * يوفر وظائف لمعالجة أنواع مختلفة من الأخطاء
 */

/**
 * تحديد نوع الخطأ وإرجاع رسالة مناسبة
 * @param {Error} error - كائن الخطأ
 * @returns {Object} - معلومات الخطأ المعالجة
 */
export const getErrorInfo = (error) => {
  const timestamp = new Date().toISOString();
  
  // خطأ من axios
  if (error.response) {
    const { status, data } = error.response;
    
    if (status >= 500) {
      return {
        type: 'server',
        status,
        message: data?.message || 'خطأ في الخادم',
        userMessage: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً',
        timestamp,
        url: error.config?.url,
        retryable: true
      };
    } else if (status >= 400 && status < 500) {
      return {
        type: 'client',
        status,
        message: data?.message || 'خطأ في الطلب',
        userMessage: getClientErrorMessage(status, data?.message),
        timestamp,
        url: error.config?.url,
        retryable: false
      };
    }
  }
  
  // خطأ في الشبكة
  if (error.request) {
    return {
      type: 'network',
      message: error.message,
      userMessage: 'خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت',
      timestamp,
      retryable: true
    };
  }
  
  // خطأ آخر
  return {
    type: 'unknown',
    message: error.message || 'خطأ غير معروف',
    userMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى',
    timestamp,
    retryable: true
  };
};

/**
 * الحصول على رسالة خطأ مناسبة للعميل
 * @param {number} status - رمز حالة HTTP
 * @param {string} message - رسالة الخطأ من الخادم
 * @returns {string} - رسالة خطأ مناسبة للمستخدم
 */
const getClientErrorMessage = (status, message) => {
  switch (status) {
    case 400:
      return 'الطلب غير صحيح. تحقق من البيانات المرسلة';
    case 401:
      return 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى';
    case 403:
      return 'غير مسموح لك بهذا الإجراء';
    case 404:
      return 'المورد المطلوب غير موجود';
    case 422:
      return 'البيانات المرسلة غير صحيحة';
    case 429:
      return 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً';
    default:
      return message || 'حدث خطأ في الطلب';
  }
};

/**
 * دالة إعادة المحاولة مع تأخير متزايد
 * @param {Function} fn - الدالة المراد إعادة تنفيذها
 * @param {number} maxRetries - عدد المحاولات القصوى
 * @param {number} baseDelay - التأخير الأساسي بالميلي ثانية
 * @returns {Promise} - نتيجة تنفيذ الدالة
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // إذا كانت هذه آخر محاولة، أرمي الخطأ
      if (attempt === maxRetries) {
        break;
      }
      
      // تحقق من إمكانية إعادة المحاولة
      const errorInfo = getErrorInfo(error);
      if (!errorInfo.retryable) {
        break;
      }
      
      // حساب التأخير مع التزايد الأسي
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`محاولة ${attempt + 1} فشلت، إعادة المحاولة بعد ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * تسجيل الخطأ في وحدة التحكم مع تفاصيل إضافية
 * @param {Error} error - كائن الخطأ
 * @param {string} context - سياق الخطأ (مثل اسم الدالة)
 */
export const logError = (error, context = '') => {
  const errorInfo = getErrorInfo(error);
  
  console.group(`🚨 خطأ ${context ? `في ${context}` : ''}`);
  console.error('نوع الخطأ:', errorInfo.type);
  console.error('الرسالة:', errorInfo.message);
  console.error('رسالة المستخدم:', errorInfo.userMessage);
  console.error('الوقت:', errorInfo.timestamp);
  
  if (errorInfo.status) {
    console.error('رمز الحالة:', errorInfo.status);
  }
  
  if (errorInfo.url) {
    console.error('الرابط:', errorInfo.url);
  }
  
  console.error('الخطأ الأصلي:', error);
  console.groupEnd();
  
  return errorInfo;
};

/**
 * إنشاء رسالة خطأ منسقة للعرض في واجهة المستخدم
 * @param {Error} error - كائن الخطأ
 * @param {string} defaultMessage - الرسالة الافتراضية
 * @returns {string} - رسالة خطأ منسقة
 */
export const formatErrorMessage = (error, defaultMessage = 'حدث خطأ غير متوقع') => {
  const errorInfo = getErrorInfo(error);
  return errorInfo.userMessage || defaultMessage;
};
