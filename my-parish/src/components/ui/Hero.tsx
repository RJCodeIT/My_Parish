import Image from 'next/image';
import { FaQuoteLeft } from 'react-icons/fa';

interface HeroProps {
  imageUrl: string;
  quote: string;
  source: string;
  altText?: string;
  className?: string;
}

export default function Hero({ 
  imageUrl, 
  quote, 
  source, 
  altText = 'Zdjęcie parafii',
  className = ''
}: HeroProps) {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]"></div>
      </div>
      
      {/* Quote Container */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/85 backdrop-blur-lg p-7 sm:p-9 md:p-12 rounded-2xl max-w-3xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.4)] border border-white/40 transform transition-all duration-500 hover:scale-[1.02] hover:bg-white/95">
          <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="flex justify-center">
            <FaQuoteLeft className="text-5xl text-primary mb-6 opacity-70" />
          </div>
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary mb-8 italic text-center leading-relaxed">
            {quote}
          </blockquote>
          <cite className="block text-right text-lg md:text-xl text-neutral font-medium">
            — {source}
          </cite>
        </div>
      </div>
    </div>
  );
}