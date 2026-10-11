'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineLogout, HiExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { logoutAdmin } from '@/app/actions/adminAuth';
import styles from './AdminShell.module.css';

const NAV = [
  { href: '/admin', label: 'Operations', match: (p) => p === '/admin' },
  { href: '/admin/events', label: 'Events', match: (p) => p.startsWith('/admin/events') },
  { href: '/admin/settings', label: 'Settings', match: (p) => p.startsWith('/admin/settings') },
  { href: '/admin/broadcast', label: 'Broadcast', match: (p) => p.startsWith('/admin/broadcast') },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname?.startsWith('/admin/login');

  if (isLogin) {
    return <div className={styles.loginOnly}>{children}</div>;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
    toast.success('Logged out');
  };

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>iC</span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>ICON Admin</span>
            <span className={styles.brandSub}>Live operations desk</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Admin navigation">
          {NAV.map((item) => {
            const active = item.match(pathname || '');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <Link href="/" className={styles.iconBtn} target="_blank" rel="noreferrer">
            <HiExternalLink size={16} />
            Site
          </Link>
          <button type="button" className={`${styles.iconBtn} ${styles.logoutBtn}`} onClick={handleLogout}>
            <HiOutlineLogout size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className={styles.main}>{children}</div>
    </div>
  );
}
