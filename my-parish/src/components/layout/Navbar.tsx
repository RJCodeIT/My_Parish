"use client"

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Navbar() {
  const [isParafiaOpen, setIsParafiaOpen] = useState(false);
  const [isDuszpasterstwoOpen, setIsDuszpasterstwoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileParafiaOpen, setIsMobileParafiaOpen] = useState(false);
  const [isMobileDuszpasterstwoOpen, setIsMobileDuszpasterstwoOpen] = useState(false);
  const parafiaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const duszpasterstwoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to prevent scrolling when mobile menu is open (only on mobile)
  useEffect(() => {
    const isMobileDevice = window.innerWidth < 1024;
    
    if (isMobileMenuOpen && isMobileDevice) {
      // Prevent scrolling on mobile only
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (setIsOpen: (value: boolean) => void, timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = (setIsOpen: (value: boolean) => void, timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-neutral/20 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/mojaParafia/witraz_logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold italic transition-all duration-300 group-hover:scale-105">
              Moja Parafia
            </span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-primary focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <FaBars size={24} />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="nav-link">Strona główna</Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter(setIsParafiaOpen, parafiaTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsParafiaOpen, parafiaTimeoutRef)}
            >
              <button className="nav-link">Parafia</button>
              {isParafiaOpen && (
                <div className="dropdown-menu absolute left-1/2 mt-1 w-56 -translate-x-1/2">
                  <Link href="/kosciol" className="dropdown-item">Kościół</Link>
                  <Link href="/historia" className="dropdown-item">Historia</Link>
                  <Link href="/kapliczki-i-inne" className="dropdown-item">Kapliczki i inne</Link>
                  <Link href="/duszpasterze" className="dropdown-item">Duszpasterze</Link>
                  <Link href="/inwestycje" className="dropdown-item">Inwestycje</Link>
                </div>
              )}
            </div>

            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
            >
              <button className="nav-link">Duszpasterstwo</button>
              {isDuszpasterstwoOpen && (
                <div className="dropdown-menu absolute left-1/2 mt-1 w-72 -translate-x-1/2">
                  <Link href="/kancelaria" className="dropdown-item">Kancelaria</Link>
                  <Link href="/porzadek-mszy-swietych" className="dropdown-item">Porządek Mszy Świętych</Link>
                  <Link href="/nabozenstwa" className="dropdown-item">Nabożeństwa</Link>
                  <Link href="/sakramenty" className="dropdown-item">Sakramenty</Link>
                  <Link href="/grupy-parafialne" className="dropdown-item">Grupy parafialne</Link>
                  <Link href="/poradnia-zycia-rodzinnego" className="dropdown-item">Poradnia życia rodzinnego</Link>
                  <Link href="/statystyki" className="dropdown-item">Statystyki</Link>
                  <Link href="/nasi-zmarli" className="dropdown-item">Nasi zmarli</Link>
                </div>
              )}
            </div>
            
            <Link href="/intencje-mszalne" className="nav-link">Intencje Mszalne</Link>
            <Link href="/ogloszenia" className="nav-link">Ogłoszenia</Link>
            <Link href="/galeria" className="nav-link">Galeria</Link>
            <Link href="/kontakt" className="nav-link">Kontakt</Link>
          </div>
        </div>
        
        {/* Mobile Navigation - Full Screen */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-0 left-0 w-screen h-screen bg-white z-[9999] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/mojaParafia/witraz_logo.jpg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-2xl font-bold italic">
                  Moja Parafia
                </span>
              </div>
              <button 
                className="text-primary focus:outline-none p-2" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTimes size={32} />
              </button>
            </div>
            <div className="p-6 space-y-6 pb-24 min-h-[calc(100vh-80px)]">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md text-lg">Strona główna</Link>
            
            <div className="block">
              <button 
                onClick={() => setIsMobileParafiaOpen(!isMobileParafiaOpen)}
                className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-100 rounded-md text-lg font-medium"
              >
                <span>Parafia</span>
                {isMobileParafiaOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
              </button>
              
              {isMobileParafiaOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <Link href="/kosciol" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Kościół</Link>
                  <Link href="/historia" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Historia</Link>
                  <Link href="/kapliczki-i-inne" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Kapliczki i inne</Link>
                  <Link href="/duszpasterze" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Duszpasterze</Link>
                  <Link href="/inwestycje" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Inwestycje</Link>
                </div>
              )}
            </div>
            
            <div className="block">
              <button 
                onClick={() => setIsMobileDuszpasterstwoOpen(!isMobileDuszpasterstwoOpen)}
                className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-100 rounded-md text-lg font-medium"
              >
                <span>Duszpasterstwo</span>
                {isMobileDuszpasterstwoOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
              </button>
              
              {isMobileDuszpasterstwoOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <Link href="/kancelaria" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Kancelaria</Link>
                  <Link href="/porzadek-mszy-swietych" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Porządek Mszy Świętych</Link>
                  <Link href="/nabozenstwa" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Nabożeństwa</Link>
                  <Link href="/sakramenty" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Sakramenty</Link>
                  <Link href="/grupy-parafialne" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Grupy parafialne</Link>
                  <Link href="/poradnia-zycia-rodzinnego" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Poradnia życia rodzinnego</Link>
                  <Link href="/statystyki" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Statystyki</Link>
                  <Link href="/nasi-zmarli" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md">Nasi zmarli</Link>
                </div>
              )}
            </div>
            
            <Link href="/intencje-mszalne" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md text-lg">Intencje Mszalne</Link>
            <Link href="/ogloszenia" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md text-lg">Ogłoszenia</Link>
            <Link href="/galeria" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md text-lg">Galeria</Link>
            <Link href="/kontakt" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 hover:bg-gray-100 rounded-md text-lg">Kontakt</Link>
          </div>
          </div>
        )}
      </div>
    </nav>
  );
}