import { headers } from 'next/headers';
import PropertiesPageWrapper from './PropertiesPageWrapper';

export default async function PropertiesPage() {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  return <PropertiesPageWrapper tenantId={tenantId} />;
}