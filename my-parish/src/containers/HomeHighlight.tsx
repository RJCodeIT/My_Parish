import Image from "next/image";
import Link from "next/link";
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
      <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-8">
        {/* Image Column */}
        <div className="h-full flex items-center">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 border border-primary/10 w-full transform transition-all duration-300 hover:shadow-xl">
            <div className="relative w-full aspect-[3/4] max-w-[280px] sm:max-w-[320px] mx-auto overflow-hidden rounded-xl group">
              <Image
                src="/mojaParafia/witraz.jpg"
                alt="Witraż"
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
        
        {/* Announcements and Mass Intentions Column */}
        <div className="flex flex-col space-y-6">
          <Link
            href="/ogloszenia"
            className="block group h-full"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 border border-primary/10 h-full flex flex-col transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:bg-white/95">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3 text-center">
                Ogłoszenia duszpasterskie
              </h2>
              <div className="h-px w-16 bg-primary/30 mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-neutral-700 text-center mt-auto line-clamp-2 sm:line-clamp-none italic">
                {announcements.title}
              </p>
            </div>
          </Link>
          
          <Link
            href="/intencje-mszalne"
            className="block group h-full"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 border border-primary/10 h-full flex flex-col transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:bg-white/95">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3 text-center">
                Intencje Mszalne
              </h2>
              <div className="h-px w-16 bg-primary/30 mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-neutral-700 text-center mt-auto line-clamp-2 sm:line-clamp-none italic">
                {massIntentions.title}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
