"use client";
import { ReactNode } from "react";
import AdminNavbar from "@/components/layout/AdminNavbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/admin/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
