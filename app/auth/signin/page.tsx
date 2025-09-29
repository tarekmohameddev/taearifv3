import { headers } from 'next/headers';
import SignInPageWrapper from './SignInPageWrapper';

export default async function SignInPage() {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  return <SignInPageWrapper tenantId={tenantId} />;
}
