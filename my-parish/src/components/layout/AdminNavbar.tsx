"use client";
import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-semibold">Panel Admina</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="text-gray-700 hover:text-gray-900"
              >
                Użytkownicy
              </Link>
              <Link
                href="/admin/posts"
                className="text-gray-700 hover:text-gray-900"
              >
                Posty
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
