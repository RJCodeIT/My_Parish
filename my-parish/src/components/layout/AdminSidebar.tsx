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
    label: "Ogłoszenia Mszalne",
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
      className={`fixed left-0 w-64 bg-white shadow-md h-screen transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <span className="text-lg font-semibold">Menu</span>
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-gray-900"
        >
          <AiOutlineClose size={24} />
        </button>
      </div>

      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <div key={item.label} className="bg-gray-100 rounded-lg">
            <button
              onClick={() => toggleSection(item.label)}
              className="flex justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              {item.label}
              {openSections.includes(item.label) ? (
                <AiOutlineUp size={16} />
              ) : (
                <AiOutlineDown size={16} />
              )}
            </button>
            {openSections.includes(item.label) && (
              <div className="pl-4 bg-white border-l border-gray-300">
                {item.subItems.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`block px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                        isActive ? "bg-primary text-white" : "hover:bg-gray-100"
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
