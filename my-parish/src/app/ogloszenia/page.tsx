"use client";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";
import SearchForm from "@/components/ui/SearchForm";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

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
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 5;
  
  // Toggle announcement expansion
  const toggleAnnouncement = (id: string) => {
    setExpandedAnnouncements(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!searchQuery) return true;
    return announcement.title.toLowerCase().includes(searchQuery);
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

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
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Słowo Chrystusa niech w was mieszka w całym swym bogactwie: z całą mądrością nauczajcie i napominajcie się wzajemnie."
          source="List do Kolosan 3:16"
          pageName="Ogłoszenia duszpasterskie"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <SearchForm 
          onSearch={handleSearch}
          placeholder="Szukaj w ogłoszeniach..."
        />
        {loading ? (
          <div className="text-center py-8">Ładowanie ogłoszeń...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8">Brak ogłoszeń do wyświetlenia</div>
        ) : (
          currentAnnouncements.map((announcement) => {
            const announcementId = announcement._id || announcement.id;
            const isExpanded = expandedAnnouncements.has(announcementId);
            
            return (
              <div key={announcementId} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-neutral-200">
                <div 
                  onClick={() => toggleAnnouncement(announcementId)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-primary mb-2 text-center">
                      {announcement.title}
                    </h2>
                    <p className="text-neutral text-sm text-center">
                      • {formatDate(announcement.date)} •
                    </p>
                  </div>
                  <div className="text-primary ml-4">
                    {isExpanded ? (
                      <AiOutlineUp className="h-5 w-5" />
                    ) : (
                      <AiOutlineDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-2 border-t border-gray-200">
                    {announcement.content && announcement.content.length > 0 && (
                      <ol className="list-decimal pl-6 mb-4 space-y-2">
                        {announcement.content.map((item) => (
                          <li key={item.id} className="text-neutral-700 whitespace-normal break-words overflow-wrap-anywhere">
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
                )}
              </div>
            );
          })
        )}
        {!loading && !error && filteredAnnouncements.length > 0 && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredAnnouncements.length}
            onPageChange={setCurrentPage}
          />
        )}
      </PageContainer>
    </div>
  );
}
