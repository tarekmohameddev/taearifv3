import { headers } from "next/headers";
import { getMetaForSlugFromStore, getMetaForSlugServer } from "@/lib/metaTags";
import { getDefaultSeoData } from "@/lib/defaultSeo";
import HomePageWrapper from "./HomePageWrapper";
import TaearifLandingPage from "../components/landing/homepage/TaearifLandingPage";

// إبقاء الصفحة dynamic لتتمكن من التحقق من tenantId
export const dynamic = "force-dynamic";

// توليد بيانات الميتا ديناميكياً عند توفر tenantId
export async function generateMetadata() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const slugPath = headersList.get("x-pathname") || "/";
  const locale = headersList.get("x-locale") || "ar";

  // إن لم يكن هناك tenantId، اترك الميتا الافتراضية لصفحة التعاريف
  if (!tenantId) return {} as any;

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

export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا لم يكن هناك subdomain (tenantId)، اعرض صفحة تعاريف الرسمية
  if (!tenantId) {
    return <TaearifLandingPage />;
  }

  return <HomePageWrapper tenantId={tenantId} />;
}
