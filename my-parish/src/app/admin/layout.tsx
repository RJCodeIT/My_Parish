"use client";
import { ReactNode, useState, useEffect } from "react";
import AdminNavbar from "@/components/layout/AdminNavbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminFooter from "@/components/layout/AdminFooter";
import { usePathname } from "next/navigation";
import AlertProvider from "@/components/providers/AlertProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/admin/auth");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  if (isAuthPage) {
    return <AlertProvider>{children}</AlertProvider>;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gray-50/50 overflow-x-hidden">
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "ml-80" : "ml-0"
        } ${isMobile && isSidebarOpen ? "invisible" : "visible"}`}
      >
        <AdminNavbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 p-8 overflow-auto container mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral/10 p-6">
            <AlertProvider>
              {children}
            </AlertProvider>
          </div>
        </main>
        <div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
