import { headers } from 'next/headers';
import TenantPageWrapper from './TenantPageWrapper';

export default async function TenantPage({ params }: { params: { slug: string } }) {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  return <TenantPageWrapper tenantId={tenantId} slug={params.slug} />;
}
