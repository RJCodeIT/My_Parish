"use client";
import { useState } from "react";
import ParishCard from "@/components/ui/ParishCard";
import Pagination from "@/components/ui/Pagination";
import PageContainer from "@/components/layout/PageContainer";

const mockNews = [
  {
    title: "Święto Parafialne",
    subtitle: "Zapraszamy na coroczne święto naszej parafii!",
    date: "2024-03-24",
  },
  {
    title: "Rekolekcje Wielkopostne",
    subtitle: "Przygotowanie duchowe do Świąt Wielkanocnych",
    date: "2024-03-20",
  },
  {
    title: "Pielgrzymka do Częstochowy",
    subtitle: "Wspólny wyjazd na Jasną Górę",
    date: "2024-03-15",
  },
  {
    title: "Koncert Chóru Parafialnego",
    subtitle: "Zapraszamy na występ naszego chóru",
    date: "2024-03-10",
  },
  {
    title: "Spotkanie Młodzieży",
    subtitle: "Integracja i modlitwa dla młodych",
    date: "2024-03-05",
  }
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
