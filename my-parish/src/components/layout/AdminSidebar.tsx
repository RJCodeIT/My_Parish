"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/users",
    label: "Użytkownicy",
  },
  {
    href: "/admin/posts",
    label: "Posty",
  },
  {
    href: "/admin/intencje",
    label: "Intencje",
  },
  {
    href: "/admin/ogloszenia",
    label: "Ogłoszenia",
  },
  {
    href: "/admin/galeria",
    label: "Galeria",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-md">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}