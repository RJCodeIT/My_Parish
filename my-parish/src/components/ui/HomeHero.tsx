import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HomeHeroProps {
  imageUrl: string;
  altText?: string;
  className?: string;
}

export default function HomeHero({ 
  imageUrl, 
  altText = 'Zdjęcie parafii',
  className = '',
}: HomeHeroProps) {

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Hero Image with refined overlays */}
      <div className="relative w-full h-screen md:h-[100vh] pt-24 md:pt-28 pb-8 flex items-stretch">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          priority
          className="object-cover will-change-transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 brightness-[0.8]"
        />
        {/* Soft vignette and aurora-like gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-30 bg-primary/40" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-30 bg-emerald-500/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.5)_100%)]" />

        {/* Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-3 md:gap-4 w-full items-stretch">
            {/* Left Column - Decorative Image Card */}
            <div className="hidden sm:flex items-center justify-center md:translate-x-8 lg:translate-x-12 xl:translate-x-16">
              <div className="relative">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/60 via-white/30 to-emerald-400/50 blur-sm opacity-60" />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-2 sm:p-3 border border-white/20 w-[220px] sm:w-[240px] md:w-[280px] lg:w-[300px] transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-1">
                  <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden rounded-xl group">
                    <Image
                      src="/mojaParafia/witraz1.jpg"
                      alt="Witraż"
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-[0.5deg]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Heading + Actions */}
            <div className="flex flex-col justify-center gap-4 md:gap-6 max-w-[880px] mx-auto w-full py-2">
              {/* Heading Area */}
              <div className="text-center md:text-left space-y-2 md:space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-stone-200 opacity-90">Kościół rzymskokatolicki pw. Przemienienia Pańskiego</span>
                </h1>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 -mt-2">
                <Link href="/ogloszenia" className="group relative flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-white/90 backdrop-blur-lg shadow-xl border border-white/40 hover:bg-white transition-all">
                  <span className="inline-flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-primary">Ogłoszenia</span>
                  <span className="opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary/70">→</span>
                </Link>

                <Link href="/intencje-mszalne" className="group relative flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-white/90 backdrop-blur-lg shadow-xl border border-white/40 hover:bg-white transition-all">
                  <span className="inline-flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-primary">Intencje</span>
                  <span className="opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary/70">→</span>
                </Link>

                <Link href="/kontakt" className="group relative flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-white/90 backdrop-blur-lg shadow-xl border border-white/40 hover:bg-white transition-all">
                  <span className="inline-flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-primary">Dojazd</span>
                  <span className="opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary/70">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}