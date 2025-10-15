### دمج بيانات الـ Meta في التطبيق

يوضح هذا الدليل كيف يتم توليد ودمج بيانات الـ SEO/Meta بشكل ديناميكي في الصفحة الرئيسية، وكيفية الاستفادة من أدوات التوليد والافتراضيّات.

---

### نظرة عامة سريعة
- يتم توليد الـ metadata ديناميكياً في `app/page.tsx` عبر `generateMetadata()` اعتماداً على:
  - معرف المستأجر `tenantId` القادم من الهيدر `x-tenant-id`.
  - المسار/السلَج `x-pathname` لتحديد الصفحة.
  - اللغة `x-locale` لضبط اللغة المناسبة.
- إذا كان هناك `tenantId` يتم جلب `WebsiteLayout` من الـ backend ثم استخراج الـ meta المناسبة.
- إذا لم تتوفر بيانات مخصّصة، يتم استخدام بيانات افتراضية من `lib/defaultSeo.ts` بحسب المسار.
- يتم تشكيل كائن `openGraph` من المصدر نفسه (المخصّص أو الافتراضي) مع مراعاة الحقول المتاحة فقط.

---

### تدفّق العمل في `app/page.tsx`
- إبقاء الصفحة ديناميكية حتى أثناء SSR:
```7:11:app/page.tsx
// إبقاء الصفحة dynamic لتتمكن من التحقق من tenantId
export const dynamic = "force-dynamic";

// توليد بيانات الميتا ديناميكياً عند توفر tenantId
export async function generateMetadata() {
```

- قراءة القيم من الهيدر أثناء SSR وتحديد السلوك:
```12:19:app/page.tsx
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const slugPath = headersList.get("x-pathname") || "/";
  const locale = headersList.get("x-locale") || "ar";

  // إن لم يكن هناك tenantId، اترك الميتا الافتراضية لصفحة التعاريف
  if (!tenantId) return {} as any;
```

- الحصول على الميتا من الخادم، ثم السقوط للبيانات الافتراضية إن لزم:
```20:54:app/page.tsx
  // على السيرفر: لا يمكن الاعتماد على الستور، اجلب WebsiteLayout من الـ backend
  // جلب الميتا من السيرفر، وإن لم تتوفر WebsiteLayout استخدم الافتراضي
  let meta = await getMetaForSlugServer(slugPath, tenantId);
  if (!meta || (!meta.titleAr && !meta.titleEn)) {
    const def = getDefaultSeoData(slugPath);
    meta = {
      titleAr: def.TitleAr,
      titleEn: def.TitleEn,
      descriptionAr: def.DescriptionAr,
      descriptionEn: def.DescriptionEn,
      keywordsAr: def.KeywordsAr,
      keywordsEn: def.KeywordsEn,
      authorAr: def.Author,
      authorEn: def.AuthorEn,
      robotsAr: def.Robots,
      robotsEn: def.RobotsEn,
      og: {
        title: def["og:title"],
        description: def["og:description"],
        keywords: def["og:keywords"],
        author: def["og:author"],
        robots: def["og:robots"],
        url: def["og:url"],
        image: def["og:image"],
        type: def["og:type"],
        locale: def["og:locale"],
        localeAlternate: def["og:locale:alternate"],
        siteName: def["og:site_name"],
        imageWidth: def["og:image:width"],
        imageHeight: def["og:image:height"],
        imageType: def["og:image:type"],
        imageAlt: def["og:image:alt"],
      },
    };
  }
```

- اختيار `title` و`description` حسب اللغة، وبناء كائن `openGraph` بأمان:
```55:95:app/page.tsx
  const title =
    locale === "ar"
      ? meta.titleAr || meta.titleEn || undefined
      : meta.titleEn || meta.titleAr || undefined;
  const description =
    locale === "ar"
      ? meta.descriptionAr || meta.descriptionEn || undefined
      : meta.descriptionEn || meta.descriptionAr || undefined;

  return {
    title,
    description,
    openGraph: {
      title: meta.og.title || title,
      description: meta.og.description || description,
      url: meta.og.url || undefined,
      images: meta.og.image
        ? [
            {
              url: String(meta.og.image),
              alt: meta.og.imageAlt || undefined,
              width:
                meta.og.imageWidth != null
                  ? Number(meta.og.imageWidth)
                  : undefined,
              height:
                meta.og.imageHeight != null
                  ? Number(meta.og.imageHeight)
                  : undefined,
              type: meta.og.imageType || undefined,
            },
          ]
        : undefined,
      type: meta.og.type || undefined,
      siteName: meta.og.siteName || undefined,
      locale: locale || meta.og.locale || undefined,
      alternateLocale: meta.og.localeAlternate || undefined,
    },
  } as any;
}
```

- سلوك عرض الصفحة نفسها حسب وجود `tenantId`:
```97:107:app/page.tsx
export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا لم يكن هناك subdomain (tenantId)، اعرض صفحة تعاريف الرسمية
  if (!tenantId) {
    return <TaearifLandingPageSimple />;
  }

  return <HomePageWrapper tenantId={tenantId} />;
}
```

---

### أدوات الميتا في `lib/metaTags.ts`
- نموذج البيانات وأنواعها، مع قيم افتراضية منطقية:
```78:106:lib/metaTags.ts
const defaultNormalizedMeta: NormalizedMeta = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  keywordsAr: "",
  keywordsEn: "",
  authorAr: "",
  authorEn: "",
  robotsAr: "index, follow",
  robotsEn: "index, follow",
  og: {
    title: "",
    description: "",
    keywords: "",
    author: "",
    robots: "index, follow",
    url: null,
    image: null,
    type: "website",
    locale: "ar",
    localeAlternate: "en",
    siteName: "",
    imageWidth: null,
    imageHeight: null,
    imageType: null,
    imageAlt: null,
  },
};
```

- استخراج الميتا لسلَج معيّن من `WebsiteLayout`:
```111:153:lib/metaTags.ts
export function getMetaForSlug(
  websiteLayout: WebsiteLayout | null | undefined,
  slug: string,
): NormalizedMeta {
  // يطبع المسار ويبحث عن مطابقة دقيقة، ثم يسقط للصفحة الرئيسية عند الحاجة
  // يعيد تركيبة موحدة NormalizedMeta مع Fallbacks معقولة
}
```

- استخدام الخادم: جلب `WebsiteLayout` ثم استخراج الميتا:
```215:221:lib/metaTags.ts
export async function getMetaForSlugServer(
  slug: string,
  tenantIdOrWebsiteName: string,
): Promise<NormalizedMeta> {
  const websiteLayout = await getWebsiteLayoutFromBackend(tenantIdOrWebsiteName);
  return getMetaForSlug(websiteLayout, slug);
}
```

- تحويل كائن الميتا إلى قائمة وسوم يمكن رسمها داخل `<head>` عند الحاجة على العميل:
```227:265:lib/metaTags.ts
export function toHeadDescriptors(meta: NormalizedMeta, locale: "ar" | "en" = "ar") {
  // يعيد Array من { name? , property?, content } لتسهيل رسم الوسوم
}
```

ملاحظات:
- توجد دوال إضافية للقراءة من Zustand Store على العميل بشكل آمن (Dynamic Import) عندما نحتاج ذلك على الواجهة.
- في الـ SSR/metadata تم تجنب الاعتماد على الستور والاكتفاء بالـ backend.

---

### البيانات الافتراضية في `lib/defaultSeo.ts`
- يحتوي على مولّد بيانات افتراضية بحسب المسار، مع قاموس صفحات معروفة:
```264:276:lib/defaultSeo.ts
export function getDefaultSeoData(slug: string): DefaultSeo {
  const isHome = !slug || slug === "/" || slug === "homepage" || slug === "home";
  const name = humanize(slug);

  // Use static defaults when available
  const normalizedKey = (() => {
    if (isHome) return "/";
    const s = (slug || "").replace(/^\/+|\/+$/g, "");
    return s;
  })();
  if (defaultData[normalizedKey] != null) {
    return defaultData[normalizedKey];
  }
```

- عند عدم وجود تعريف ثابت، يتم توليد قيم افتراضية معقولة:
```289:316:lib/defaultSeo.ts
  return {
    TitleAr: titleAr,
    TitleEn: titleEn,
    DescriptionAr: descAr,
    DescriptionEn: descEn,
    KeywordsAr: keywordsAr,
    KeywordsEn: keywordsEn,
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": titleAr,
    "og:description": descAr,
    "og:keywords": keywordsAr,
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": null,
    "og:image": null,
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": isHome ? "الموقع" : name,
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": titleAr,
  };
}
```

---

### كيف تختار القيم بين العربية والإنجليزية؟
- في `generateMetadata()` يتم تحديد `title` و`description` وفق اللغة (`ar` أو `en`).
- يتم استخدام القيم المخصصة إن وجدت، وإلا يسقط إلى الأصلية أو الافتراضية.

---

### ملاحظات تنفيذية
- حقول `openGraph.images` تُملأ فقط عند توفر صورة، مع تحويل القياسات الرقمية إلى `Number(...)` بشكل آمن.
- حقول نصية اختيارية تُعاد كـ `undefined` عندما لا تتوفر حتى لا تُنشئ وسوم فارغة.
- عند غياب `tenantId` ترجع ميتا فارغة لتستخدم الصفحة الرسمية العامة قيمها الخاصة.

---

### استخدامات إضافية
- عند الرغبة برسم الميتا يدوياً على الواجهة، يمكن استخدام `toHeadDescriptors(meta, locale)` لتحويل الكائن إلى قائمة وسوم قابلة للرسم.
- عند الحاجة للقراءة من Store على العميل (خارج سياق SSR)، وفّرت الدالة `getMetaForSlugFromStore(slug)`، لكن لا تُستخدم داخل `generateMetadata()`.

---

### خلاصة
- الميتا تُبنى بهذا الترتيب: مخصّص من الخادم (إن وجد) ثم افتراضي من `defaultSeo`.
- اللغة تضبط حقول العنوان والوصف فقط، بينما حقول Open Graph تُؤخذ من المصدر المفضّل مع Fallbacks.
- تم التأكد من أن الكود آمن على الخادم ولا يعتمد على Zustand أثناء SSR/metadata.
