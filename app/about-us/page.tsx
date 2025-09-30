import { headers } from 'next/headers';
import AboutUsPage from '../../components/AboutUsPage';
import TenantAboutUsPage from '../../components/TenantAboutUsPage';
import TenantPageWrapper from '../TenantPageWrapper';

export default async function AboutUs({ params }: { params: { slug: string } }) {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  // إذا كان هناك tenantId، اعرض صفحة tenant-specific
  if (tenantId) {
  return <TenantPageWrapper tenantId={tenantId} slug={params.slug} />;
  }
  
  // إذا لم يكن هناك tenantId، اعرض صفحة الموقع الرئيسي
  return <AboutUsPage />;
}
