// ملف لتوليد المعاملات الثابتة للصفحات
export const generateStaticParams = () => {
  // إرجاع معاملات ثابتة للصفحات الرئيسية
  return [
    { slug: 'home' },
    { slug: 'solutions' },
    { slug: 'updates' },
    { slug: 'landing' },
    { slug: 'about-us' }
  ];
};

// دالة لتحسين البناء للصفحات الثابتة
export const getStaticProps = async () => {
  return {
    props: {},
    revalidate: false, // لا إعادة تحقق - صفحات ثابتة تماماً
  };
};

// دالة لتحسين البناء للصفحات الديناميكية
export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: 'home' } },
      { params: { slug: 'solutions' } },
      { params: { slug: 'updates' } },
      { params: { slug: 'landing' } },
      { params: { slug: 'about-us' } }
    ],
    fallback: false, // لا fallback - جميع الصفحات مُعدة مسبقاً
  };
};
