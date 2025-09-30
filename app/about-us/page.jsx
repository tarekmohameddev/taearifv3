import { headers } from 'next/headers';
import AboutUsPage from '../../components/AboutUsPage';
import TenantAboutUsPage from '../../components/TenantAboutUsPage';

export default async function AboutUs() {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  // إذا كان هناك tenantId، اعرض صفحة tenant-specific
  if (tenantId) {
    return <TenantAboutUsPage tenantId={tenantId} />;
  }
  
  // إذا لم يكن هناك tenantId، اعرض صفحة الموقع الرئيسي
  return <AboutUsPage />;
}
