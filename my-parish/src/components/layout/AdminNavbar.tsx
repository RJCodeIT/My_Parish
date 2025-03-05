"use client";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";

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
    <nav className="bg-white shadow-md sticky top-0 z-10 w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            className={`text-gray-700 hover:text-gray-900 p-2 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
            onClick={() => setIsSidebarOpen(true)}
          >
            <AiOutlineMenu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Panel Administratora</h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <span className="text-gray-700 font-medium">Jan Kowalski</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <FaChevronDown size={16} className="text-gray-600" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
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
