import { headers } from "next/headers";
import { getMetaForSlugServer } from "@/lib/metaTags";
import { getDefaultSeoData } from "@/lib/defaultSeo";
import TenantPageWrapper from "../TenantPageWrapper";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const locale = headersList.get("x-locale") || "ar";
  const slugParam = params?.slug || "";
  const slugPath = `/${slugParam}`;

  if (!tenantId) return {} as any;

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

export default async function TenantPage({
  params,
}: {
  params: { slug: string };
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const { slug } = params;

  return <TenantPageWrapper tenantId={tenantId} slug={slug} />;
}
