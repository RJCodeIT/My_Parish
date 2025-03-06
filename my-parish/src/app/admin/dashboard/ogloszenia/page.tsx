"use client"
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import AnnouncementCard from "@/components/ui/AnnouncementsCard";
import axios from "axios";

interface Announcement {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  content: { order: number; text: string }[];
  extraInfo?: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await axios.get("/api/announcements");
        setAnnouncements(data);
      } catch (error) {
        console.error("Błąd podczas pobierania ogłoszeń:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
  };

  return (
    <div>
      <SectionTitle name="Wszystkie ogłoszenia duszpasterskie" />
      <div className="mt-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <AnnouncementCard 
              key={announcement._id} 
              announcement={announcement} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Brak ogłoszeń</p>
        )}
      </div>
    </div>
  );
}
