'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import AnnouncementsCard from "@/components/ui/AnnouncementsCard";

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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get("/mojaParafia/api/announcements")
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/mojaParafia/api/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const searchStr = `${announcement.title} ${announcement.date}`.toLowerCase();
    return searchStr.includes(searchQuery);
  });

  return (
    <div>
      <SectionTitle name="Wszystkie ogłoszenia duszpasterskie" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Wszystkie Ogłoszenia</h1>
        </div>
        <AdminSearchBar 
          onSearch={handleSearch}
          placeholder="Szukaj w ogłoszeniach..."
        />
        <div className="mt-4 space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementsCard 
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
    </div>
  );
}
