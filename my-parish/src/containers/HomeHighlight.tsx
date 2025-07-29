import Link from "next/link";
import Image from "next/image";
import RecommendationCard from "@/components/ui/RecommendationCard";
import recommendations from "@/const/recommendations";
import PageContainer from "@/components/layout/PageContainer";

interface SearchResults {
  announcements: {
    id: number;
    title: string;
    content: string;
    date: string;
  }[];
  massIntentions: {
    id: number;
    title: string;
    intentions: string[];
    date: string;
  }[];
}

interface HomeHighlightProps {
  searchResults?: SearchResults;
}

export default function HomeHighlight({ searchResults }: HomeHighlightProps) {
  const announcements = searchResults?.announcements?.[0] || {
    title: "Ogłoszenia Duszpasterskie – VIII Niedziela Zwykła rok C",
  };
  const massIntentions = searchResults?.massIntentions?.[0] || {
    title: "INTENCJE MSZALNE 2 – 9 III 2025 r.",
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              href="/ogloszenia"
              className="block hover:transform hover:scale-[1.02] transition-all h-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-6 border border-neutral/30 h-full flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold text-primary mb-2 text-center">
                  Ogłoszenia duszpasterskie
                </h2>
                <p className="text-sm sm:text-base text-neutral italic text-center mt-auto line-clamp-2 sm:line-clamp-none">
                  {announcements.title}
                </p>
              </div>
            </Link>
            <Link
              href="/intencje-mszalne"
              className="block hover:transform hover:scale-[1.02] transition-all h-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-6 border border-neutral/30 h-full flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold text-primary mb-2 text-center">
                  Intencje Mszalne
                </h2>
                <p className="text-sm sm:text-base text-neutral italic text-center mt-auto line-clamp-2 sm:line-clamp-none">
                  {massIntentions.title}
                </p>
              </div>
            </Link>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-6 border border-neutral/30">
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4 text-center">
              Polecane
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.link}
                  title={recommendation.name}
                  href={recommendation.link}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="h-full flex items-center mt-4 md:mt-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-6 border border-neutral/30 w-full">
            <div className="relative w-full aspect-[3/4] max-w-[250px] sm:max-w-[300px] mx-auto overflow-hidden group">
              <Image
                src="/mojaParafia/witraz.jpg"
                alt="Witraż"
                fill
                className="object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
