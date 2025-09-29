import { headers } from 'next/headers';
import PropertyPageWrapper from './PropertyPageWrapper';

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  return <PropertyPageWrapper tenantId={tenantId} propertyId={params.id} />;
}
