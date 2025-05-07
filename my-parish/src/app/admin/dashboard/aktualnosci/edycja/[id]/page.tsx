"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsForm from "@/containers/NewsForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface News {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export default function EditNews({ params }: { params: { id: string } }) {
  // Use React.use() to unwrap the params object
  const unwrappedParams = React.use(Promise.resolve(params));
  const newsId = unwrappedParams.id;
  
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/news/${newsId}`);
        setNews(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania aktualności:", error);
        setError("Nie udało się pobrać danych aktualności. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Edytuj aktualność</h1>
      {news && <NewsForm initialData={news} isEditMode={true} />}
    </div>
  );
}
