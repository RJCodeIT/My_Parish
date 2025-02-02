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
    <nav className="bg-sky-200 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-center space-x-6 relative">
        <Link href="/" className="text-lg font-bold hover:text-gray-300">Home</Link>
        
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setIsParafiaOpen, parafiaTimeoutRef)}
          onMouseLeave={() => handleMouseLeave(setIsParafiaOpen, parafiaTimeoutRef)}
        >
          <button className="text-lg font-bold hover:text-gray-300">
            Parafia
          </button>
          {isParafiaOpen && (
            <div 
              className="absolute left-0 mt-2 w-56 bg-white text-black shadow-lg rounded-md z-50"
              onMouseEnter={() => handleMouseEnter(setIsParafiaOpen, parafiaTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsParafiaOpen, parafiaTimeoutRef)}
            >
              <Link href="/kosciol" className="block px-4 py-2 hover:bg-gray-200">Kościół</Link>
              <Link href="/historia" className="block px-4 py-2 hover:bg-gray-200">Historia</Link>
              <Link href="/kapliczki-i-inne" className="block px-4 py-2 hover:bg-gray-200">Kapliczki i inne</Link>
              <Link href="/duszpasterze" className="block px-4 py-2 hover:bg-gray-200">Duszpasterze</Link>
              <Link href="/inwestycje" className="block px-4 py-2 hover:bg-gray-200">Inwestycje</Link>
            </div>
          )}
        </div>

        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
          onMouseLeave={() => handleMouseLeave(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
        >
          <button className="text-lg font-bold hover:text-gray-300">
            Duszpasterstwo
          </button>
          {isDuszpasterstwoOpen && (
            <div 
              className="absolute left-0 mt-2 w-72 bg-white text-black shadow-lg rounded-md z-50"
              onMouseEnter={() => handleMouseEnter(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
              onMouseLeave={() => handleMouseLeave(setIsDuszpasterstwoOpen, duszpasterstwoTimeoutRef)}
            >
              <Link href="/kancelaria" className="block px-4 py-2 hover:bg-gray-200">Kancelaria</Link>
              <Link href="/porzadek-mszy-swietych" className="block px-4 py-2 hover:bg-gray-200">Porządek Mszy Świętych</Link>
              <Link href="/nabozenstwa" className="block px-4 py-2 hover:bg-gray-200">Nabożeństwa</Link>
              <Link href="/sakramenty" className="block px-4 py-2 hover:bg-gray-200">Sakramenty</Link>
              <Link href="/grupy-parafialne" className="block px-4 py-2 hover:bg-gray-200">Grupy parafialne</Link>
              <Link href="/poradnia-zycia-rodzinnego" className="block px-4 py-2 hover:bg-gray-200">Poradnia życia rodzinnego</Link>
              <Link href="/statystyki" className="block px-4 py-2 hover:bg-gray-200">Statystyki</Link>
              <Link href="/nasi-zmarli" className="block px-4 py-2 hover:bg-gray-200">Nasi zmarli</Link>
            </div>
          )}
        </div>
        
        <Link href="/intencje-mszalne" className="text-lg font-bold hover:text-gray-300">Intencje Mszalne</Link>
        <Link href="/ogloszenia" className="text-lg font-bold hover:text-gray-300">Ogłoszenia</Link>
        <Link href="/galeria" className="text-lg font-bold hover:text-gray-300">Galeria</Link>
        <Link href="/kontakt" className="text-lg font-bold hover:text-gray-300">Kontakt</Link>
      </div>
    </nav>
  );
}