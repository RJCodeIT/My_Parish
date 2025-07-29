"use client"
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import NewsCard from "@/components/ui/NewsCard";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import { useAlerts } from "@/components/ui/Alerts";
import axios from "axios";

interface News {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export default function News() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const alerts = useAlerts();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get("/mojaParafia/api/news");
        setNewsList(data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktualności:", error);
        alerts.showError("Nie udało się pobrać aktualności. Odśwież stronę i spróbuj ponownie.");
      }
    };

    fetchNews();
  }, [alerts]);

  const handleDelete = (id: string) => {
    // Update the UI by removing the deleted news
    setNewsList((prev) => prev.filter((news) => news._id !== id));
    
    // Fetch updated news list after a short delay
    setTimeout(async () => {
      try {
        const { data } = await axios.get("/mojaParafia/api/news");
        setNewsList(data);
      } catch (error) {
        console.error("Błąd podczas odświeżania aktualności:", error);
        // Already updated UI above, so no need to show an error
      }
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredNews = newsList.filter((news) => {
    const searchStr = `${news.title} ${news.subtitle} ${news.date}`.toLowerCase();
    return searchStr.includes(searchQuery);
  });

  return (
    <div>
      <SectionTitle name="Aktualności" />
      <div className="p-3 sm:p-6">
        <AdminSearchBar 
          onSearch={handleSearch}
          placeholder="Szukaj aktualności..."
        />
        <div className="mt-3 sm:mt-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <NewsCard 
                key={news._id} 
                news={news} 
                onDelete={handleDelete} 
              />
            ))
          ) : (
            <p className="text-center text-gray-500 p-4">Brak aktualności</p>
          )}
        </div>
      </div>
    </div>
  );
}
