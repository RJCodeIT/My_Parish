import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";
import ChapelsGrid from "@/components/ui/ChapelsGrid";

export default function Chapels() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Gdzie są dwaj albo trzej zebrani w imię moje, tam jestem pośród nich."
          source="Ewangelia wg św. Mateusza 18:20"
          pageName="Kapliczki i inne"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <div className="space-y-8 mb-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">
              Kapliczki i krzyże przydrożne
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Na terenie naszej parafii znajduje się wiele zabytkowych kapliczek i krzyży przydrożnych, 
              które są świadectwem wiary i historii naszej społeczności.
            </p>
          </div>
          <ChapelsGrid />
        </div>
      </PageContainer>
    </div>
  );
}
