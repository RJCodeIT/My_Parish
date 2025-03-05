"use client"
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminPath && <Footer />}
    </>
  );
}
