"use client";
import { useState, useEffect } from "react";
import ParishCard from "@/components/ui/ParishCard";
import Pagination from "@/components/ui/Pagination";
import PageContainer from "@/components/layout/PageContainer";
import SearchForm from "@/components/ui/SearchForm";

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
  const [expandedNews, setExpandedNews] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 5;
  
  // Toggle news item expansion
  const toggleNewsItem = (id: string) => {
    setExpandedNews(prevExpanded => {
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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter news based on search query
  const filteredNews = news.filter((newsItem) => {
    if (!searchQuery) return true;
    return (
      newsItem.title.toLowerCase().includes(searchQuery) ||
      newsItem.subtitle.toLowerCase().includes(searchQuery)
    );
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

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
      
      <SearchForm 
        onSearch={handleSearch}
        placeholder="Szukaj w aktualnościach..."
      />
      
      {loading ? (
        <div className="text-center py-8">Ładowanie aktualności...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : news.length === 0 ? (
        <div className="text-center py-8">Brak aktualności do wyświetlenia</div>
      ) : (
        currentNews.map((newsItem) => {
          const newsId = newsItem._id || newsItem.id;
          const isExpanded = expandedNews.has(newsId);
          
          return (
            <ParishCard
              key={newsId}
              title={newsItem.title}
              subtitle={newsItem.subtitle}
              content={newsItem.content}
              date={formatDate(newsItem.date)}
              isExpanded={isExpanded}
              onToggle={() => toggleNewsItem(newsId)}
            />
          );
        })
      )}
      
      {!loading && !error && filteredNews.length > 0 && (
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredNews.length}
          onPageChange={setCurrentPage}
        />
      )}
    </PageContainer>
  );
}
