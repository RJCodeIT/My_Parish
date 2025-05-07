"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import AnnouncementsForm from "@/containers/AnnouncementsForm";
import SectionTitle from "@/components/layout/SectionTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AnnouncementContent {
  order: number;
  text: string;
}

interface Announcement {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  content: AnnouncementContent[];
  extraInfo?: string;
}

export default function EditAnnouncement() {
  // Use useParams hook to get the ID
  const routeParams = useParams();
  const announcementId = routeParams.id as string;
  
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`/api/announcements/${announcementId}`);
        console.log("Fetched announcement data:", response.data);
        setAnnouncement(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setError("Nie udało się pobrać danych ogłoszenia.");
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Błąd</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
        >
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SectionTitle name="Edycja ogłoszenia" />
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Wróć
        </button>
      </div>
      {announcement && <AnnouncementsForm initialData={announcement} isEditMode={true} />}
    </div>
  );
}
