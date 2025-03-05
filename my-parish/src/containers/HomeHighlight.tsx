import Link from "next/link";
import Image from "next/image";
import RecommendationCard from "@/components/ui/RecommendationCard";
import recommendations from "@/const/recommendations";
import PageContainer from "@/components/layout/PageContainer";

export default function HomeHighlight() {
  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-2 gap-6 h-[150px]">
            <Link
              href="/ogloszenia"
              className="block hover:transform hover:scale-[1.02] transition-all h-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200 h-full flex flex-col">
                <h2 className="text-xl font-bold text-primary mb-2 text-center">
                  Ogłoszenia duszpasterskie
                </h2>
                <p className="text-gray-600 italic text-center mt-auto">
                  Ogłoszenia Duszpasterskie – VIII Niedziela Zwykła rok C
                </p>
              </div>
            </Link>
            <Link
              href="/intencje-mszalne"
              className="block hover:transform hover:scale-[1.02] transition-all h-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200 h-full flex flex-col">
                <h2 className="text-xl font-bold text-primary mb-2 text-center">
                  Intencje Mszalne
                </h2>
                <p className="text-gray-600 italic text-center mt-auto">
                  INTENCJE MSZALNE 2 – 9 III 2025 r.
                </p>
              </div>
            </Link>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-primary mb-4 text-center">
              Polecane
            </h2>
            <div className="grid grid-cols-3 gap-4">
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
        <div className="h-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200 h-full">
            <div className="relative w-full h-full">
              <Image
                src="/patronSaint.png"
                alt="Patron Parafii"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
