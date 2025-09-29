import { headers } from 'next/headers';
import HomePageWrapper from './HomePageWrapper';

export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  return <HomePageWrapper tenantId={tenantId} />;
}