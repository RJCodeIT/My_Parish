import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from "lucide-react";

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
      <div className="relative w-full h-[100vh] flex items-center justify-center">
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
        
        {/* Contact Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-16">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Information */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 border border-primary/10 space-y-4 w-full">
              <h2 className="text-lg sm:text-2xl font-bold text-neutral-700 text-center sm:text-left break-words">
                Kościół rzymskokatolicki pw. Przemienienia Pańskiego
              </h2>
              
              <div className="space-y-6">
                {/* Mobile layout: stacked elements */}
                <div className="block sm:hidden space-y-3 w-full max-w-full">
                  <div className="flex flex-col items-center space-y-2 w-full">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-neutral-600 font-medium">Adres:</p>
                    </div>
                    <p className="text-neutral-900 text-center break-words px-2">Kościelna 7, 21-136 Firlej</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2 w-full">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-neutral-600 font-medium">Telefon:</p>
                    </div>
                    <p className="text-neutral-900 break-words">+48 123 456 789</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2 w-full">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-neutral-600 font-medium">Email:</p>
                    </div>
                    <p className="text-neutral-900 break-words">parafia@gmail.com</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2 w-full">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-neutral-600 font-medium">Godziny otwarcia:</p>
                    </div>
                    <div className="text-center w-full px-2">
                      <p className="text-neutral-900 break-words">Poniedziałek - Piątek: 8:00 - 12:00</p>
                      <p className="text-neutral-900 break-words">Sobota: 8:00 - 11:00</p>
                    </div>
                  </div>
                </div>
                
                {/* Desktop layout: grid */}
                <div className="hidden sm:grid grid-cols-[auto_100px_1fr] gap-y-6 gap-x-3">
                  <MapPin className="w-5 h-5 text-primary self-center" />
                  <p className="text-neutral-600 self-center">Adres:</p>
                  <p className="text-neutral-900 self-center">Kościelna 7, 21-136 Firlej</p>
                  
                  <Phone className="w-5 h-5 text-primary self-center" />
                  <p className="text-neutral-600 self-center">Telefon:</p>
                  <p className="text-neutral-900 self-center">+48 123 456 789</p>
                  
                  <Mail className="w-5 h-5 text-primary self-center" />
                  <p className="text-neutral-600 self-center">Email:</p>
                  <p className="text-neutral-900 self-center">parafia@gmail.com</p>
                  
                  <Clock className="w-5 h-5 text-primary self-start mt-1" />
                  <p className="text-neutral-600 self-start mt-1">Godziny otwarcia:</p>
                  <div>
                    <p className="text-neutral-900">Poniedziałek - Piątek: 8:00 - 12:00</p>
                    <p className="text-neutral-900">Sobota: 8:00 - 11:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/95 w-full">
              <div className="w-full h-full overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9950.258214539755!2d22.51183671281737!3d51.55477997181436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472251795c4c6b0b%3A0x1c0c2c4e6c4c6b0a!2zS2_Fm2Npw7PFgiBQcnplbWllbmllbmlhIFBhxYRza2llZ28!5e0!3m2!1spl!2spl!4v1711206140!5m2!1spl!2spl"
                  className="w-full h-[300px] sm:h-[400px] transition-transform duration-500"
                  style={{ border: 0, maxWidth: '100%', width: '100%', display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}