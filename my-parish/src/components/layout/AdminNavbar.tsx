"use client";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface AdminNavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function AdminNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: AdminNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-neutral/20 shadow-sm sticky top-0 z-50">
      <div className={`ml-auto px-6 py-4 ${isSidebarOpen ? 'ml-80' : ''} transition-all duration-300`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
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
                Panel Administratora
              </span>
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 text-gray-700 hover:text-primary transition-colors py-2 px-4 rounded-lg"
            >
              <span className="font-medium">Jan Kowalski</span>
              <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
              <FaChevronDown size={14} className="text-current" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
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
