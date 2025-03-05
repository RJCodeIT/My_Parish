"use client"
import { useState } from "react";
import ParishCard from "@/components/ui/ParishCard";
import Pagination from "@/components/ui/Pagination";

const mockNews = [
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
  {
    title: "Parafia w Krakowie",
    subtitle: "Witamy w mojej parafii w Krakowie!",
    date: "2024-01-01",
  },
];

export default function NewsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = mockNews.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-amber-50/50 to-stone-50/50 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-amber-100/20">
        {currentNews.map((news, index) => (
          <ParishCard
            key={index}
            title={news.title}
            subtitle={news.subtitle}
            date={news.date}
          />
        ))}
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={mockNews.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}