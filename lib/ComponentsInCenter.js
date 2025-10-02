// قائمة المكونات التي يجب توسيطها أفقياً
export const COMPONENTS_TO_CENTER = [
  'halfTextHalfImage1',
  // يمكن إضافة المزيد من المكونات هنا
];

// دالة للتحقق من ما إذا كان المكون يحتاج للتوسيط
export const shouldCenterComponent = (componentName) => {
  if (!componentName || typeof componentName !== 'string') {
    return false;
  }
  
  return COMPONENTS_TO_CENTER.includes(componentName);
};

// دالة لإنشاء wrapper للمكونات التي تحتاج للتوسيط
export const getCenterWrapperClasses = (componentName) => {
  if (shouldCenterComponent(componentName)) {
    return "flex justify-center items-center";
  }
  return "";
};