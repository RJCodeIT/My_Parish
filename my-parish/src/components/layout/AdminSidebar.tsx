"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useState } from "react";

const menuItems = [
  {
    label: "Parafianie",
    subItems: [
      { href: "/admin/dashboard/parafianie", label: "Wszyscy Parafianie" },
      { href: "/admin/dashboard/parafianie/dodawanie", label: "Nowy Parafianin" },
    ],
  },
  {
    label: "Grupy Parafialne",
    subItems: [
      { href: "/admin/dashboard/grupy-parafialne", label: "Wszystkie Grupy" },
      { href: "/admin/dashboard/grupy-parafialne/dodawanie", label: "Nowa Grupa" },
    ],
  },
  {
    label: "Ogłoszenia Duszpasterskie",
    subItems: [
      { href: "/admin/dashboard/ogloszenia", label: "Wszytskie Ogłoszenia" },
      { href: "/admin/dashboard/ogloszenia/dodawanie", label: "Dodaj Ogłoszenie" },
    ],
  },
  {
    label: "Intencje",
    subItems: [
      { href: "/admin/dashboard/intencje", label: "Wszystkie Intencje" },
      { href: "/admin/dashboard/intencje/dodawanie", label: "Nowa Intencja" },
    ],
  },
  {
    label: "Aktualności",
    subItems: [
      { href: "/admin/dashboard/aktualnosci", label: "Wszystkie Aktualnosci" },
      { href: "/admin/dashboard/aktualnosci/dodawanie", label: "Nowa Aktualność" },
    ],
  },
];

export default function AdminSidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside
      className={`fixed left-0 w-72 bg-white/95 backdrop-blur-sm shadow-lg h-screen transition-transform duration-300 border-r border-neutral/10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 flex justify-between items-center border-b border-neutral/10">
        <span className="text-xl font-semibold text-gray-800">Menu</span>
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          <AiOutlineClose size={24} />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.label} className="rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(item.label)}
              className="flex justify-between items-center w-full px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50/80 transition-colors"
            >
              <span className="font-medium">{item.label}</span>
              {openSections.includes(item.label) ? (
                <AiOutlineUp size={16} />
              ) : (
                <AiOutlineDown size={16} />
              )}
            </button>
            {openSections.includes(item.label) && (
              <div className="pl-4 bg-gray-50/50 border-l-2 border-primary/10">
                {item.subItems.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`block px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:text-primary hover:bg-gray-100/80"
                      }`}
                      onClick={toggleSidebar}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
