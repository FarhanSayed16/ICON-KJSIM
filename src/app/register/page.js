import { Suspense } from 'react';
import RegistrationClient from './RegistrationClient';

export const metadata = {
  title: 'Register | ICON 2026',
  description: 'Secure your spot at ICON 2026. Register for the ultimate technical festival at KJSIM.',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }}>Loading...</div>}>
      <RegistrationClient />
    </Suspense>
  );
}
