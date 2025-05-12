"use client"
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import NewsCard from "@/components/ui/NewsCard";
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get("/mojaParafia/api/news");
        setNewsList(data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktualności:", error);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = (id: string) => {
    setNewsList((prev) => prev.filter((news) => news._id !== id));
  };

  return (
    <div>
      <SectionTitle name="Aktualności" />
      <div className="mt-4">
        {newsList.length > 0 ? (
          newsList.map((news) => (
            <NewsCard 
              key={news._id} 
              news={news} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Brak aktualności</p>
        )}
      </div>
    </div>
  );
}
