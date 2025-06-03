"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import NewsForm from "@/containers/NewsForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SectionTitle from "@/components/layout/SectionTitle";

interface News {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export default function EditNews() {
  const router = useRouter();
  // Use useParams hook to get the ID
  const params = useParams();
  const newsId = params.id as string;
  
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/mojaParafia/api/news/${newsId}`);
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
    <div className="container mx-auto py-8 px-4">
      <SectionTitle name="Edycja aktualności" />
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Wróć
        </button>
      </div>
      {news && <NewsForm initialData={news} isEditMode={true} />}
    </div>
  );
}
