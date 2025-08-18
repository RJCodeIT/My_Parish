'use client';

import SectionTitle from "@/components/layout/SectionTitle";
import HomeHero from "@/components/ui/HomeHero";
import RecommendationsPanel from "@/components/ui/RecommendationsPanel";
import HomeHighlight from "@/containers/HomeHighlight";
import NewsContainer from "@/containers/NewsContainer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <HomeHero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          altText="Witraż kościelny"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle name="Nasza Parafia" className="mt-16 md:mt-20" />
        <HomeHighlight />
        
        <SectionTitle name="Aktualności" className="mt-16 md:mt-20" />
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 mb-16">
          <NewsContainer />
          <div className="mt-8 md:mt-0">
            <RecommendationsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
