import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { SITE_CONFIG } from '@/lib/data';

export default function Location() {
  const { venue } = SITE_CONFIG;

  return (
    <section className="py-16 md:py-24 bg-white" id="location">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-marcellus text-3xl sm:text-4xl text-[#B7202E] font-normal mb-2">Location</h2>
            <p className="font-firasans text-stone-600 text-base">Find us at the heart of Mumbai</p>
            <span className="block w-14 h-1 bg-[#ED1C24] rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 md:gap-10 items-stretch">
          <ScrollReveal variant="slide-left" delay={0.1} className="h-full">
            <div className="rounded-2xl overflow-hidden border border-stone-200 min-h-[280px] sm:min-h-[380px] h-full shadow-sm hover:shadow-md transition-shadow duration-300">
              <iframe
                src={venue.mapsEmbed}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[280px] sm:min-h-[380px] block border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KJSIM Campus Location"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={0.2} className="h-full">
            <div className="relative overflow-hidden flex flex-col justify-center p-6 md:p-10 bg-white border border-stone-200 rounded-2xl shadow-sm h-full transition-all duration-300 hover:border-[#B7202E]/30 hover:shadow-md">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#B7202E]/10 text-[#B7202E] mb-6 transition-transform duration-300 hover:scale-105">
                <HiOutlineLocationMarker size={28} />
              </div>
              <h3 className="font-marcellus text-xl md:text-2xl text-[#231F20] font-normal mb-2">
                {venue.name}
              </h3>
              <p className="font-firasans text-sm md:text-base text-stone-600 leading-relaxed">
                {venue.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${venue.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center w-fit px-8 py-2.5 bg-transparent text-[#B7202E] hover:bg-[#ED1C24] hover:text-white border-2 border-[#B7202E] hover:border-[#ED1C24] font-semibold text-sm rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Get Directions
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
