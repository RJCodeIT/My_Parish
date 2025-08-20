"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ParishCard from "@/components/ui/ParishCard";
import Pagination from "@/components/ui/Pagination";
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
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid grid-cols-1 items-stretch md:[grid-template-columns:minmax(0,1fr)_minmax(280px,360px)] gap-8 md:gap-10 mt-8">
        <div>
          <div className="w-full bg-gradient-to-br from-amber-50/50 to-stone-50/50 backdrop-blur-sm rounded-xl shadow-lg p-1 sm:p-6 border border-amber-100/20">
            <h2 className="text-xl font-bold text-primary mb-6 text-center lg:text-left">
              Wydarzenia
            </h2>
            <SearchForm 
              onSearch={handleSearch}
              placeholder="Szukaj w wydarzeniach..."
            />
            
            <div className="mt-6">
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
            </div>
          </div>
        </div>

        <aside className="w-full md:w-[340px] self-stretch">
          <div className="grid h-full grid-rows-3 gap-6">
            {/* Image 1 */}
            <figure className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_24px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 ring-1 ring-yellow-200/40 bg-amber-50/30">
              <Image
                src="/mojaParafia/witraz3.jpg"
                alt="Witraż kościelny"
                fill
                className="object-cover object-center scale-[1.06] transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </figure>

            {/* Image 2 */}
            <figure className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_24px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 ring-1 ring-yellow-200/40 bg-amber-50/30">
              <Image
                src="/mojaParafia/witraz4.jpg"
                alt="Witraż kościelny"
                fill
                className="object-cover object-center scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
            </figure>

            {/* Image 3 */}
            <figure className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_24px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 ring-1 ring-yellow-200/40 bg-amber-50/30">
              <Image
                src="/mojaParafia/witraz5.jpg"
                alt="Witraż kościelny"
                fill
                className="object-cover object-center scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
            </figure>
          </div>
        </aside>
      </div>
    </div>
  );
}
