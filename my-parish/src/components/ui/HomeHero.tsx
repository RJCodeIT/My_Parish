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
      {/* Hero Image with Overlay */}
      <div className="relative w-full h-screen pt-28 pb-8 flex items-center">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          priority
          className="object-cover transition-transform duration-[3000ms] ease-in-out hover:scale-105 filter brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        
        {/* Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[auto,auto] gap-5 md:gap-8 items-stretch justify-center">
            {/* Left Column - Image */}
            <div className="h-full flex items-center justify-center mx-auto">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-5 sm:p-6 border border-primary/10 w-[200px] sm:w-[230px] md:w-[270px] lg:w-[280px] transform transition-all duration-300 hover:shadow-xl h-[calc(75vh-5rem)]">
                <div className="relative w-full h-full max-w-none mx-auto overflow-hidden rounded-xl group">
                  <Image
                    src="/mojaParafia/witraz.jpg"
                    alt="Witraż"
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Content */}
            <div className="flex flex-col justify-center gap-5 h-[calc(75vh-5rem)] w-full max-w-[780px] mx-auto">
              {/* Buttons only: Announcements, Mass Intentions, Directions */}
              <div className="flex flex-col justify-between h-full gap-4">
                <Link href="/ogloszenia" className="group flex items-center justify-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-primary/10 hover:bg-white/95 hover:shadow-xl transition-all h-[calc((75vh-5rem)/3-2.67rem)]">
                  <span className="inline-flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </span>
                  <span className="text-lg font-semibold text-primary">Ogłoszenia</span>
                </Link>

                <Link href="/intencje-mszalne" className="group flex items-center justify-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-primary/10 hover:bg-white/95 hover:shadow-xl transition-all h-[calc((75vh-5rem)/3-2.67rem)]">
                  <span className="inline-flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-lg font-semibold text-primary">Intencje</span>
                </Link>

                <Link href="/kontakt" className="group flex items-center justify-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-primary/10 hover:bg-white/95 hover:shadow-xl transition-all h-[calc((75vh-5rem)/3-2.67rem)]">
                  <span className="inline-flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </span>
                  <span className="text-lg font-semibold text-primary">Dojazd</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}