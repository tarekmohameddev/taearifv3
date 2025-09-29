import { headers } from 'next/headers';
import HomePageWrapper from './HomePageWrapper';

export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  // إذا لم يكن هناك subdomain (tenantId)، اعرض صفحة فارغة
  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-red-500 text-6xl font-bold">hey</h1>
      </div>
    );
  }
  
  return <HomePageWrapper tenantId={tenantId} />;
}