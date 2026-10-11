import Navbar from '@/components/Navbar/Navbar';
import FooterGate from '@/components/Footer/FooterGate';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import ScrollToTopGate from '@/components/ScrollToTop/ScrollToTopGate';
import PageTransition from '@/components/PageTransition/PageTransition';

/**
 * Public marketing chrome only. Admin routes use app/admin/layout.js and never
 * import framer-motion / public nav — avoids mixed chunk graphs in the admin desk.
 */
export default function SiteLayout({ children }) {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <FooterGate />
      <ScrollToTopGate />
    </>
  );
}
