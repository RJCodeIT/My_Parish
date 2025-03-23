"use client"

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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
    }, 200);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-neutral/20 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/witraz_logo.jpg"
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
          
          <div className="flex items-center space-x-8">
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
      </div>
    </nav>
  );
}