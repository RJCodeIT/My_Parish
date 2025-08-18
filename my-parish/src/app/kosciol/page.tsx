import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";
import ChurchPhotosGrid from "@/components/ui/ChurchPhotosGrid";

export default function Church() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Przyjdźcie do Mnie wszyscy, którzy utrudzeni i obciążeni jesteście, a Ja was pokrzepię."
          source="Ewangelia wg św. Mateusza 11:28"
          pageName="Kościół"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer>
        <div className="space-y-8 mb-6">
          <h2 className="text-2xl font-bold text-primary text-center">
            Zdjęcia naszego kościoła
          </h2>
          <ChurchPhotosGrid />
        </div>
      </PageContainer>
    </div>
  );
}
