import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';
import { SITE_CONFIG } from '@/lib/data';

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/#about' },
  { label: 'Events', href: '/events' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Hackathon', href: '/hackathon' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Register', href: '/register' },
];

const SOCIAL_ITEMS = [
  { key: 'facebook', label: 'Facebook', icon: FaFacebookF },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
];

export default function Footer() {
  const { contacts, email, socials } = SITE_CONFIG;

  return (
    <footer className="bg-[#58595B] text-white pt-16 pb-8 border-t-0">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-12">
        {/* Column 1: ICON Info */}
        <div className="flex flex-col items-start">
          <Image
            src="/images/icon_logo.png"
            alt="ICON 2026"
            width={100}
            height={80}
            className="object-contain mb-4 drop-shadow-md w-auto h-16"
          />
          <p className="font-['Fira_Sans'] text-sm !text-white leading-relaxed max-w-sm m-0">
            ICON is the official techfest of Department of Data Science and
            Technology. It has always been our primary motive to encourage
            scientific thinking, innovation, creativity and some good
            old-fashioned fun.
          </p>
        </div>

        {/* Column 2: Useful Links */}
        <div>
          <h4 className="font-['Marcellus'] text-xl font-normal !text-white mb-2 leading-none">
            Useful Links
          </h4>
          <div className="w-10 h-0.5 bg-[#ED1C24] mb-4" />
          <ul className="grid grid-cols-2 gap-2 text-sm font-['Fira_Sans'] list-none p-0 m-0">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="!text-white hover:opacity-80 hover:underline transition-all py-1 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div>
          <h4 className="font-['Marcellus'] text-xl font-normal !text-white mb-2 leading-none">
            Contact Us
          </h4>
          <div className="w-10 h-0.5 bg-[#ED1C24] mb-4" />
          <address className="not-italic text-sm font-['Fira_Sans'] leading-relaxed mb-4">
            <p className="m-0 !text-white">K J Somaiya Institute of Management,</p>
            <p className="m-0 !text-white">Somaiya Vidyavihar University,</p>
            <p className="m-0 !text-white">Vidyavihar East</p>
            <p className="m-0 !text-white">Mumbai-400077.</p>
          </address>
          <div className="flex flex-col gap-1.5 mb-4">
            {contacts.map((c) => (
              <a
                key={c.phone}
                href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 text-sm font-['Fira_Sans'] !text-white hover:opacity-80 transition-opacity"
              >
                <HiPhone size={14} className="text-[#ED1C24] shrink-0" />
                <span className="!text-white">{c.name} | {c.phone}</span>
              </a>
            ))}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm font-['Fira_Sans'] !text-white hover:opacity-80 transition-opacity"
            >
              <HiMail size={14} className="text-[#ED1C24] shrink-0" />
              <span className="!text-white">{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            {SOCIAL_ITEMS.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={socials[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-[#B7202E] text-white flex items-center justify-center transition-all duration-200 shadow-xs"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container border-t border-white/25 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-['Fira_Sans']">
        <p className="m-0 !text-white">© {new Date().getFullYear()} ICON — KJSIM. All Rights Reserved.</p>
        <p className="m-0 !text-white">Designed &amp; Developed by Farhan Sayed</p>
      </div>
    </footer>
  );
}
