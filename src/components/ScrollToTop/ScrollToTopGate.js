'use client';

import { usePathname } from 'next/navigation';
import ScrollToTop from './ScrollToTop';

export default function ScrollToTopGate() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <ScrollToTop />;
}
