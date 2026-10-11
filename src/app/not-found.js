import Link from 'next/link';
import { HiOutlineEmojiSad } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a2e] text-white p-8 text-center font-firasans">
      <HiOutlineEmojiSad className="text-7xl text-[#ED1C24] mb-6 animate-pulse" />
      <h1 className="font-marcellus text-6xl sm:text-7xl mb-2 text-white">404</h1>
      <h2 className="font-marcellus text-2xl text-white/80 mb-4">Page Not Found</h2>
      <p className="max-w-md mb-8 text-white/60 text-sm leading-relaxed">
        The data or arena you are looking for does not exist in the ICON Datatron network.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#B7202E] to-[#ED1C24] hover:from-[#9B1925] hover:to-[#B7202E] text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
      >
        Return to Core (Home)
      </Link>
    </div>
  );
}
