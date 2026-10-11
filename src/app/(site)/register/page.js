import { Suspense } from 'react';
import RegistrationClient from './RegistrationClient';
import { getRegistrationBootstrap } from '@/app/actions/registerUser';

export const metadata = {
  title: 'Register | ICON',
  description: 'Register for ICON at KJSIM. Pay via Somaiya QR and get your pass after verification.',
};

export default async function RegisterPage() {
  const bootstrap = await getRegistrationBootstrap();

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }}>Loading...</div>}>
      <RegistrationClient events={bootstrap.events || []} siteConfig={bootstrap.siteConfig} />
    </Suspense>
  );
}
