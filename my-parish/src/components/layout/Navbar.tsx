"use client"

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FaBars, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp, 
  FaHome, 
  FaChurch, 
  FaPray, 
  FaCalendarAlt, 
  FaBullhorn, 
  FaImages, 
  FaEnvelope, 
  FaHistory, 
  FaLandmark, 
  FaCross, 
  FaUsers, 
  FaHeart, 
  FaChartBar, 
  FaBookDead 
} from "react-icons/fa";

export default function Navbar() {
  const [isParafiaOpen, setIsParafiaOpen] = useState(false);
  const [isDuszpasterstwoOpen, setIsDuszpasterstwoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileParafiaOpen, setIsMobileParafiaOpen] = useState(false);
  const [isMobileDuszpasterstwoOpen, setIsMobileDuszpasterstwoOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const parafiaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const duszpasterstwoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // CSS for Navbar - defined inside the component to access isScrolled state
  const navStyles = {
    navLink: `relative font-medium ${isScrolled ? 'text-neutral-800' : 'text-white'} hover:text-primary transition-colors duration-300 py-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`,
    dropdownMenu: `bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-neutral-100 overflow-hidden py-1 transform transition-all duration-300 ease-in-out origin-top scale-y-100 opacity-100`,
    dropdownItem: `flex items-center w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary/5 hover:text-primary transition-colors duration-200`
  };
  
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

  // Effect to detect scroll position and change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <nav className={`${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-black/30 backdrop-blur-md'} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white shadow-md transition-all duration-300 group-hover:border-primary">
              <Image
                src="/mojaParafia/witraz_logo.jpg"
                alt="Logo"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className={`text-2xl font-bold ${isScrolled ? 'text-primary' : 'text-white'} transition-all duration-300 group-hover:text-secondary`}>
              Moja Parafia
            </span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className={`lg:hidden ${isScrolled ? 'text-primary' : 'text-white'} hover:text-secondary focus:outline-none transition-colors duration-300`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes size={28} className="drop-shadow-sm" />
            ) : (
              <FaBars size={28} className="drop-shadow-sm" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className={`${navStyles.navLink} flex items-center space-x-2`}>
              <FaHome className={`${isScrolled ? 'text-primary' : 'text-white'}`} />
              <span>Strona główna</span>
            </Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter(setIsParafiaOpen, parafiaTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsParafiaOpen, parafiaTimeoutRef)}
            >
              <button className={`${navStyles.navLink} flex items-center space-x-2`}>
                <FaChurch className={`${isScrolled ? 'text-primary' : 'text-white'}`} />
                <span>Parafia</span>
                {isParafiaOpen ? <FaChevronUp className="ml-1 text-xs" /> : <FaChevronDown className="ml-1 text-xs" />}
              </button>
              {isParafiaOpen && (
                <div className={`${navStyles.dropdownMenu} absolute left-1/2 mt-1 w-56 -translate-x-1/2`}>
                  <Link href="/kosciol" className={navStyles.dropdownItem}>
                    <FaLandmark className="mr-2" /> Kościół
                  </Link>
                  <Link href="/historia" className={navStyles.dropdownItem}>
                    <FaHistory className="mr-2" /> Historia
                  </Link>
                  <Link href="/kapliczki-i-inne" className={navStyles.dropdownItem}>
                    <FaCross className="mr-2" /> Kapliczki i inne
                  </Link>
                  <Link href="/duszpasterze" className={navStyles.dropdownItem}>
                    <FaUsers className="mr-2" /> Duszpasterze
                  </Link>
                  <Link href="/inwestycje" className={navStyles.dropdownItem}>
                    <FaLandmark className="mr-2" /> Inwestycje
                  </Link>
                  <Link href="/galeria" className={navStyles.dropdownItem}>
                    <FaImages className="mr-2" /> Galeria
                  </Link>
                </div>
              )}
            </div>

            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
            >
              <button className={`${navStyles.navLink} flex items-center space-x-2`}>
                <FaPray className={`${isScrolled ? 'text-primary' : 'text-white'}`} />
                <span>Duszpasterstwo</span>
                {isDuszpasterstwoOpen ? <FaChevronUp className="ml-1 text-xs" /> : <FaChevronDown className="ml-1 text-xs" />}
              </button>
              {isDuszpasterstwoOpen && (
                <div className={`${navStyles.dropdownMenu} absolute left-1/2 mt-1 w-72 -translate-x-1/2`}>
                  <Link href="/kancelaria" className={navStyles.dropdownItem}>
                    <FaLandmark className="mr-2" /> Kancelaria
                  </Link>
                  <Link href="/porzadek-mszy-swietych" className={navStyles.dropdownItem}>
                    <FaCalendarAlt className="mr-2" /> Porządek Mszy Świętych
                  </Link>
                  <Link href="/nabozenstwa" className={navStyles.dropdownItem}>
                    <FaPray className="mr-2" /> Nabożeństwa
                  </Link>
                  <Link href="/sakramenty" className={navStyles.dropdownItem}>
                    <FaCross className="mr-2" /> Sakramenty
                  </Link>
                  <Link href="/grupy-parafialne" className={navStyles.dropdownItem}>
                    <FaUsers className="mr-2" /> Grupy parafialne
                  </Link>
                  <Link href="/poradnia-zycia-rodzinnego" className={navStyles.dropdownItem}>
                    <FaHeart className="mr-2" /> Poradnia życia rodzinnego
                  </Link>
                  <Link href="/statystyki" className={navStyles.dropdownItem}>
                    <FaChartBar className="mr-2" /> Statystyki
                  </Link>
                  <Link href="/nasi-zmarli" className={navStyles.dropdownItem}>
                    <FaBookDead className="mr-2" /> Nasi zmarli
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/intencje-mszalne" className={`${navStyles.navLink} flex items-center space-x-2`}>
              <FaCalendarAlt className={`${isScrolled ? 'text-primary' : 'text-white'}`} />
              <span>Intencje Mszalne</span>
            </Link>
            <Link href="/ogloszenia" className={`${navStyles.navLink} flex items-center space-x-2`}>
              <FaBullhorn className={`${isScrolled ? 'text-primary' : 'text-white'}`} />
              <span>Ogłoszenia</span>
            </Link>
            <Link href="/kontakt" className={`${navStyles.navLink} flex items-center space-x-2`}>
              <FaEnvelope className={`${isScrolled ? 'text-primary' : 'text-white'}`} />
              <span>Kontakt</span>
            </Link>
          </div>
        </div>
        
        {/* Mobile Navigation - Full Screen */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-0 left-0 w-screen h-screen bg-white/98 backdrop-blur-md z-[9999] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-primary/30 shadow-md">
                  <Image
                    src="/mojaParafia/witraz_logo.jpg"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-2xl font-bold text-primary">
                  Moja Parafia
                </span>
              </div>
              <button 
                className="text-primary hover:text-secondary focus:outline-none p-2 transition-colors duration-300" 
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes size={32} className="drop-shadow-sm" />
              </button>
            </div>
            <div className="p-6 space-y-4 pb-24 min-h-[calc(100vh-80px)]">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center space-x-3 py-3 px-4 hover:bg-gray-50 rounded-lg text-lg text-primary transition-colors duration-300"
              >
                <FaHome className="text-primary" size={20} />
                <span>Strona główna</span>
              </Link>
            
              <div className="block">
                <button 
                  onClick={() => setIsMobileParafiaOpen(!isMobileParafiaOpen)}
                  className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg text-lg font-medium text-primary transition-colors duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <FaChurch className="text-primary" size={20} />
                    <span>Parafia</span>
                  </div>
                  {isMobileParafiaOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </button>
                
                {isMobileParafiaOpen && (
                  <div className="pl-6 mt-2 space-y-2 border-l-2 border-primary/20 ml-4">
                    <Link 
                      href="/kosciol" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaLandmark className="text-primary" size={18} />
                      <span>Kościół</span>
                    </Link>
                    <Link 
                      href="/historia" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaHistory className="text-primary" size={18} />
                      <span>Historia</span>
                    </Link>
                    <Link 
                      href="/kapliczki-i-inne" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaCross className="text-primary" size={18} />
                      <span>Kapliczki i inne</span>
                    </Link>
                    <Link 
                      href="/duszpasterze" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaUsers className="text-primary" size={18} />
                      <span>Duszpasterze</span>
                    </Link>
                    <Link 
                      href="/inwestycje" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaLandmark className="text-primary" size={18} />
                      <span>Inwestycje</span>
                    </Link>
                    <Link 
                      href="/galeria" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaImages className="text-primary" size={18} />
                      <span>Galeria</span>
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="block">
                <button 
                  onClick={() => setIsMobileDuszpasterstwoOpen(!isMobileDuszpasterstwoOpen)}
                  className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg text-lg font-medium text-primary transition-colors duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <FaPray className="text-primary" size={20} />
                    <span>Duszpasterstwo</span>
                  </div>
                  {isMobileDuszpasterstwoOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </button>
                
                {isMobileDuszpasterstwoOpen && (
                  <div className="pl-6 mt-2 space-y-2 border-l-2 border-primary/20 ml-4">
                    <Link 
                      href="/kancelaria" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaLandmark className="text-primary" size={18} />
                      <span>Kancelaria</span>
                    </Link>
                    <Link 
                      href="/porzadek-mszy-swietych" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaCalendarAlt className="text-primary" size={18} />
                      <span>Porządek Mszy Świętych</span>
                    </Link>
                    <Link 
                      href="/nabozenstwa" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaPray className="text-primary" size={18} />
                      <span>Nabożeństwa</span>
                    </Link>
                    <Link 
                      href="/sakramenty" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaCross className="text-primary" size={18} />
                      <span>Sakramenty</span>
                    </Link>
                    <Link 
                      href="/grupy-parafialne" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaUsers className="text-primary" size={18} />
                      <span>Grupy parafialne</span>
                    </Link>
                    <Link 
                      href="/poradnia-zycia-rodzinnego" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaHeart className="text-primary" size={18} />
                      <span>Poradnia życia rodzinnego</span>
                    </Link>
                    <Link 
                      href="/statystyki" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaChartBar className="text-primary" size={18} />
                      <span>Statystyki</span>
                    </Link>
                    <Link 
                      href="/nasi-zmarli" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                    >
                      <FaBookDead className="text-primary" size={18} />
                      <span>Nasi zmarli</span>
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/intencje-mszalne" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center space-x-3 py-3 px-4 hover:bg-gray-50 rounded-lg text-lg text-primary transition-colors duration-300"
              >
                <FaCalendarAlt className="text-primary" size={20} />
                <span>Intencje Mszalne</span>
              </Link>
              <Link 
                href="/ogloszenia" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center space-x-3 py-3 px-4 hover:bg-gray-50 rounded-lg text-lg text-primary transition-colors duration-300"
              >
                <FaBullhorn className="text-primary" size={20} />
                <span>Ogłoszenia</span>
              </Link>
              <Link 
                href="/kontakt" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center space-x-3 py-3 px-4 hover:bg-gray-50 rounded-lg text-lg text-primary transition-colors duration-300"
              >
                <FaEnvelope className="text-primary" size={20} />
                <span>Kontakt</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}