"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";

export default function AdminNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <nav className={`bg-white/90 backdrop-blur-md border-b border-neutral/20 shadow-sm sticky top-0 z-40`}>
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-300">
        <div className="flex justify-between items-center w-full">
          {/* Lewa strona - przycisk menu i tytuł */}
          <div className="flex items-center">
            <button
              className="text-gray-700 hover:text-primary transition-colors mr-3"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
            
            <div className="flex items-center">
              <Image
                src="/mojaParafia/witraz_logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full object-cover mr-3"
              />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold italic m-0 p-0 text-left">
                Panel Administratora
              </h1>
            </div>
          </div>
          
          {/* Prawa strona - dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 hover:text-primary transition-colors py-1 sm:py-2 px-2 sm:px-4 rounded-lg"
              aria-label="Menu użytkownika"
            >
              {!isMobile && (
                <div className="flex items-center mr-4">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full mr-2"></div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">Jan Kowalski</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                </div>
              )}
              <FaChevronDown size={18} className="text-current" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                {isMobile && (
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">Jan Kowalski</p>
                      <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                )}
                <Link 
                  href="/admin/dashboard/ustawienia"
                  className="w-full px-4 py-2 text-left text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-2"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Ustawienia</span>
                </Link>
                <button 
                  className="w-full px-4 py-2 text-left text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-2"
                  onClick={() => {
                    // TODO: Implement logout
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Wyloguj</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
