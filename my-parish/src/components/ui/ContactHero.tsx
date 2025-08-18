import React from 'react';
import Image from 'next/image';

interface ContactHeroProps {
  imageUrl: string;
  altText?: string;
  className?: string;
}

export default function ContactHero({ 
  imageUrl, 
  altText = 'Zdjęcie parafii',
  className = ''
}: ContactHeroProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Hero Image with Overlay - Full Screen */}
      <div className="relative w-full h-[100vh]">
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
      </div>
    </div>
  );
}