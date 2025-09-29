import { headers } from 'next/headers';
import AuthErrorPageWrapper from './AuthErrorPageWrapper';

export default async function AuthErrorPage() {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  return <AuthErrorPageWrapper tenantId={tenantId} />;
}
