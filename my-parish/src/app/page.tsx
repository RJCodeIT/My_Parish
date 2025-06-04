'use client';

import SectionTitle from "@/components/layout/SectionTitle";
import HomeHighlight from "@/containers/HomeHighlight";
import NewsContainer from "@/containers/NewsContainer";

export default function Home() {
  return (
    <div>
      <SectionTitle name="Aktualności" />
      <HomeHighlight/>
      <NewsContainer />
    </div>
  );
}
