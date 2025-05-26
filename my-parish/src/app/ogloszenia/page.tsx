"use client";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

type Announcement = {
  id: string;
  _id: string;
  title: string;
  date: string;
  extraInfo?: string;
  imageUrl?: string;
  content: {
    id: string;
    order: number;
    text: string;
    announcementId: string;
  }[];
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/mojaParafia/api/announcements');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch announcements: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched announcements:', data);
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Error loading announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (err) {
      console.error('Error formatting date:', err, dateString);
      return dateString; // Return original string if parsing fails
    }
  };

  // No helper functions needed here

  return (
    <div>
      <SectionTitle name="Ogłoszenia duszpasterskie" />
      <PageContainer>
        {loading ? (
          <div className="text-center py-8">Ładowanie ogłoszeń...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8">Brak ogłoszeń do wyświetlenia</div>
        ) : (
          currentAnnouncements.map((announcement) => (
            <div key={announcement._id || announcement.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-neutral-200">
              <h2 className="text-xl font-bold text-primary mb-2 text-center">
                {announcement.title}
              </h2>
              <p className="text-neutral text-sm text-center mb-4">
                • {formatDate(announcement.date)} •
              </p>
              
              {announcement.content && announcement.content.length > 0 && (
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  {announcement.content.map((item) => (
                    <li key={item.id} className="text-neutral-700">
                      {item.text}
                    </li>
                  ))}
                </ol>
              )}
              
              {announcement.extraInfo && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-neutral-700 italic">
                    {announcement.extraInfo}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
        {!loading && !error && announcements.length > 0 && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={announcements.length}
            onPageChange={setCurrentPage}
          />
        )}
      </PageContainer>
    </div>
  );
}
