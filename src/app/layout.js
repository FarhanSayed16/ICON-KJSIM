import { Outfit, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import PageTransition from '@/components/PageTransition/PageTransition';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: {
    default: 'ICON 2026 — DATATRON | KJSIM Techfest',
    template: '%s | ICON 2026 — KJSIM',
  },
  description:
    'ICON 2026 is the official techfest of KJ Somaiya Institute of Management, Department of Data Science & Technology. Theme: DATATRON — celebrating data, automation, and futuristic technology. Register for hackathons, coding challenges, gaming events, and more.',
  keywords: [
    'ICON 2026',
    'DATATRON',
    'KJSIM',
    'techfest',
    'KJ Somaiya',
    'hackathon',
    'coding',
    'gaming',
    'data science',
    'Mumbai',
  ],
  authors: [{ name: 'ICON — KJSIM' }],
  openGraph: {
    title: 'ICON 2026 — DATATRON | KJSIM Techfest',
    description:
      'The official techfest of KJ Somaiya Institute of Management. Register for hackathons, coding challenges, and gaming events.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://icon-kjsim.com',
    siteName: 'ICON 2026',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://icon-kjsim.com'}/og-icon2026.svg`,
        width: 1200,
        height: 630,
        alt: 'ICON 2026 - KJSIM Techfest',
      }
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICON 2026 — DATATRON | KJSIM Techfest',
    description:
      'The official techfest of KJ Somaiya Institute of Management. Register now!',
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://icon-kjsim.com'}/og-icon2026.svg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body suppressHydrationWarning style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <LoadingScreen />

        <Navbar />
        <main id="main-content">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1a1a2e',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#4CAF50', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#C62828', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}

