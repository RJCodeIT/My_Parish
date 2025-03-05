"use client"

import { useState, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isParafiaOpen, setIsParafiaOpen] = useState(false);
  const [isDuszpasterstwoOpen, setIsDuszpasterstwoOpen] = useState(false);
  const parafiaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const duszpasterstwoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 100);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Moja Parafia</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="nav-link">Home</Link>
            
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter(setIsParafiaOpen, parafiaTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsParafiaOpen, parafiaTimeoutRef)}
            >
              <button className="nav-link">Parafia</button>
              {isParafiaOpen && (
                <div className="dropdown-menu absolute left-0 mt-2 w-56 z-50">
                  <Link href="/kosciol" className="dropdown-item block">Kościół</Link>
                  <Link href="/historia" className="dropdown-item block">Historia</Link>
                  <Link href="/kapliczki-i-inne" className="dropdown-item block">Kapliczki i inne</Link>
                  <Link href="/duszpasterze" className="dropdown-item block">Duszpasterze</Link>
                  <Link href="/inwestycje" className="dropdown-item block">Inwestycje</Link>
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
            >
              <button className="nav-link">Duszpasterstwo</button>
              {isDuszpasterstwoOpen && (
                <div className="dropdown-menu absolute left-0 mt-2 w-72 z-50">
                  <Link href="/kancelaria" className="dropdown-item block">Kancelaria</Link>
                  <Link href="/porzadek-mszy-swietych" className="dropdown-item block">Porządek Mszy Świętych</Link>
                  <Link href="/nabozenstwa" className="dropdown-item block">Nabożeństwa</Link>
                  <Link href="/sakramenty" className="dropdown-item block">Sakramenty</Link>
                  <Link href="/grupy-parafialne" className="dropdown-item block">Grupy parafialne</Link>
                  <Link href="/poradnia-zycia-rodzinnego" className="dropdown-item block">Poradnia życia rodzinnego</Link>
                  <Link href="/statystyki" className="dropdown-item block">Statystyki</Link>
                  <Link href="/nasi-zmarli" className="dropdown-item block">Nasi zmarli</Link>
                </div>
              )}
            </div>
            
            <Link href="/intencje-mszalne" className="nav-link">Intencje Mszalne</Link>
            <Link href="/ogloszenia" className="nav-link">Ogłoszenia</Link>
            <Link href="/galeria" className="nav-link">Galeria</Link>
            <Link href="/kontakt" className="nav-link">Kontakt</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}