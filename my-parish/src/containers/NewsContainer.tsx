"use client";
import { useState } from "react";
import ParishCard from "@/components/ui/ParishCard";
import Pagination from "@/components/ui/Pagination";
import PageContainer from "@/components/layout/PageContainer";

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
    <PageContainer>
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
    </PageContainer>
  );
}
