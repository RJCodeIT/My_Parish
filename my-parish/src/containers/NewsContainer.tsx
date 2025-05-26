"use client";
import { useState, useEffect } from "react";
import ParishCard from "@/components/ui/ParishCard";
import Pagination from "@/components/ui/Pagination";
import PageContainer from "@/components/layout/PageContainer";

type News = {
  id: string;
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  date: string;
};

export default function NewsContainer() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/mojaParafia/api/news');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched news:', data);
        setNews(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Error loading news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

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

  return (
    <PageContainer>
      <h2 className="text-xl font-bold text-primary mb-6 text-center">
        Aktualności
      </h2>
      
      {loading ? (
        <div className="text-center py-8">Ładowanie aktualności...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : news.length === 0 ? (
        <div className="text-center py-8">Brak aktualności do wyświetlenia</div>
      ) : (
        currentNews.map((newsItem) => (
          <ParishCard
            key={newsItem._id || newsItem.id}
            title={newsItem.title}
            subtitle={newsItem.subtitle}
            content={newsItem.content}
            date={formatDate(newsItem.date)}
          />
        ))
      )}
      
      {!loading && !error && news.length > 0 && (
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={news.length}
          onPageChange={setCurrentPage}
        />
      )}
    </PageContainer>
  );
}
