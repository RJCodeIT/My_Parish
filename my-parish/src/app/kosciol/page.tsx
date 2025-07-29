import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";
import ChurchPhotosGrid from "@/components/ui/ChurchPhotosGrid";

export default function Church() {
  return (
    <div>
      <SectionTitle name="Kościół" className="mt-8"/>
      <PageContainer>
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-primary text-center">
            Zdjęcia naszego kościoła
          </h2>
          <ChurchPhotosGrid />
        </div>
      </PageContainer>
    </div>
  );
}
