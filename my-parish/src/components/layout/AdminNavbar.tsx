"use client";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              className={`text-gray-700 hover:text-primary transition-colors ${
                isSidebarOpen ? "opacity-0 invisible" : "opacity-100 visible"
              }`}
              onClick={() => setIsSidebarOpen(true)}
            >
              <AiOutlineMenu size={24} />
            </button>
            <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
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
                <button 
                  className="w-full px-4 py-2 text-left text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // TODO: Implement logout
                    setIsDropdownOpen(false);
                  }}
                >
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
