"use client";

import { useRouter } from "next/navigation";
import SectionTitle from "@/components/layout/SectionTitle";
import AnnouncementsForm from "@/containers/AnnouncementsForm";

export default function AddAnnouncement() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-8">
      <SectionTitle name="Dodaj ogłoszenie" />
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto justify-center sm:justify-start mt-8 sm:mt-0"
        >
          <span className="mr-1">&larr;</span> Wróć
        </button>
      </div>
      <AnnouncementsForm />
    </div>
  );
}
