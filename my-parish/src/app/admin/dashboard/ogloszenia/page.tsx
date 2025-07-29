'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import AnnouncementsCard from "@/components/ui/AnnouncementsCard";
import { useAlerts } from "@/components/ui/Alerts";

interface Announcement {
  _id: string;
  id?: string; // Adding id field for compatibility with different API responses
  title: string;
  date: string;
  imageUrl?: string;
  content: { order: number; text: string }[];
  extraInfo?: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const alerts = useAlerts();

  useEffect(() => {
    axios.get("/mojaParafia/api/announcements")
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
        alerts.showError("Nie udało się pobrać ogłoszeń. Odśwież stronę i spróbuj ponownie.");
      });
  }, [alerts]);

  const handleDelete = async (id: string) => {
    if (!id) {
      alerts.showError("Nie można usunąć ogłoszenia: brak identyfikatora");
      return;
    }
    
    try {
      const response = await axios.delete(`/mojaParafia/api/announcements/${id}`);
      console.log("Delete response:", response.data);
      
      // Update the UI by removing the deleted announcement
      setAnnouncements(prev => prev.filter(announcement => {
        const announcementId = announcement._id || announcement.id;
        return String(announcementId) !== String(id);
      }));
      
      alerts.showSuccess("Ogłoszenie zostało usunięte pomyślnie.");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alerts.showError(`Nie udało się usunąć ogłoszenia: ${error.response.data.error}`);
      } else {
        alerts.showError("Nie udało się usunąć ogłoszenia. Spróbuj ponownie.");
      }
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
      <SectionTitle name="Ogłoszenia duszpasterskie" />
      <div className="p-6">
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
