'use client';

import SectionTitle from "@/components/layout/SectionTitle";
import HomeHero from "@/components/ui/HomeHero";
import NewsContainer from "@/containers/NewsContainer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <HomeHero 
          imageUrl="/mojaParafia/hero.jpg"
          altText="Witraż kościelny"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle name="Aktualności" className="mt-16 md:mt-20" />
        <div className="mb-16">
          <NewsContainer />
        </div>
      </div>
    </div>
  );
}
