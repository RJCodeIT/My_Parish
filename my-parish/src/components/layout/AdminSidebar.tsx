"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineDown, AiOutlineUp, AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import { 
  FaHome, 
  FaUsers, 
  FaPeopleCarry, 
  FaBullhorn, 
  FaPray, 
  FaNewspaper, 
  FaUserPlus, 
  FaUserFriends, 
  FaPlusCircle, 
  FaRegBell, 
  FaRegCalendarPlus, 
  FaRegNewspaper 
} from "react-icons/fa";

const menuItems = [
  {
    label: "Strona główna",
    icon: <FaHome className="text-lg" />,
    subItems: [
      { href: "/admin/dashboard", label: "Panel administratora", icon: <FaHome className="text-sm" /> },
    ],
  },
  {
    label: "Parafianie",
    icon: <FaUsers className="text-lg" />,
    subItems: [
      { href: "/admin/dashboard/parafianie", label: "Wszyscy Parafianie", icon: <FaUserFriends className="text-sm" /> },
      { href: "/admin/dashboard/parafianie/dodawanie", label: "Nowy Parafianin", icon: <FaUserPlus className="text-sm" /> },
    ],
  },
  {
    label: "Grupy Parafialne",
    icon: <FaPeopleCarry className="text-lg" />,
    subItems: [
      { href: "/admin/dashboard/grupy-parafialne", label: "Wszystkie Grupy", icon: <FaUsers className="text-sm" /> },
      { href: "/admin/dashboard/grupy-parafialne/dodawanie", label: "Nowa Grupa", icon: <FaPlusCircle className="text-sm" /> },
    ],
  },
  {
    label: "Ogłoszenia Duszpasterskie",
    icon: <FaBullhorn className="text-lg" />,
    subItems: [
      { href: "/admin/dashboard/ogloszenia", label: "Wszytskie Ogłoszenia", icon: <FaRegBell className="text-sm" /> },
      { href: "/admin/dashboard/ogloszenia/dodawanie", label: "Dodaj Ogłoszenie", icon: <FaPlusCircle className="text-sm" /> },
    ],
  },
  {
    label: "Intencje",
    icon: <FaPray className="text-lg" />,
    subItems: [
      { href: "/admin/dashboard/intencje", label: "Wszystkie Intencje", icon: <FaPray className="text-sm" /> },
      { href: "/admin/dashboard/intencje/dodawanie", label: "Nowa Intencja", icon: <FaRegCalendarPlus className="text-sm" /> },
    ],
  },
  {
    label: "Aktualności",
    icon: <FaNewspaper className="text-lg" />,
    subItems: [
      { href: "/admin/dashboard/aktualnosci", label: "Wszystkie Aktualnosci", icon: <FaRegNewspaper className="text-sm" /> },
      { href: "/admin/dashboard/aktualnosci/dodawanie", label: "Nowa Aktualność", icon: <FaPlusCircle className="text-sm" /> },
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices
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

  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 ${isMobile ? 'w-full' : 'w-80'} bg-white shadow-lg h-screen transition-transform duration-300 border-r border-neutral/10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50 overflow-y-auto`}
    >
      <div className="p-6 flex justify-between items-center border-b border-neutral/10">
        <span className="text-xl font-semibold text-gray-800">Menu</span>
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-primary transition-colors block sm:hidden"
          aria-label="Zamknij menu"
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
              <div className="flex items-center">
                <span className="mr-3 text-primary">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
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
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:text-primary hover:bg-gray-100/80"
                      }`}
                      onClick={toggleSidebar}
                    >
                      <span className={`mr-2 ${isActive ? 'text-white' : 'text-primary'}`}>
                        {subItem.icon}
                      </span>
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
