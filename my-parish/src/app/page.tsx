'use client';

import { useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import HomeHighlight from "@/containers/HomeHighlight";
import NewsContainer from "@/containers/NewsContainer";
import SearchBar from "@/components/ui/SearchBar";
import { testData } from "@/const/testData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredData = {
    announcements: testData.announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.content.toLowerCase().includes(searchQuery)
    ),
    massIntentions: testData.massIntentions.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.intentions.some((intention) =>
          intention.toLowerCase().includes(searchQuery)
        )
    ),
  };

  return (
    <div>
      <SectionTitle name="Aktualności" />
      <div className="mt-8">
        <SearchBar onSearch={handleSearch} placeholder="Szukaj w ogłoszeniach i intencjach..." />
      </div>
      <HomeHighlight searchResults={filteredData} />
      <NewsContainer />
    </div>
  );
}
